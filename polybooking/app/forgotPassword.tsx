import { ButtonSpinner, ButtonText, Button } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/utils/supabase';
import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    
    useEffect(() => {
        // Hàm xử lý URL khi app mở từ deep link
        const handleDeepLink = async (url: string) => {
            if (!url) return;

            // Phân tích URL để lấy access_token (thường nằm sau dấu #)
            const { queryParams } = Linking.parse(url);

            // Supabase trả token qua URL Fragment (#), expo-linking đôi khi gộp vào queryParams
            // Nếu dùng link dạng polybooking://forgotPassword#access_token=...
            const frag = url.split("#")[1];
            if (frag) {
                const params = new URLSearchParams(frag);
                const accessToken = params.get("access_token");
                const refreshToken = params.get("refresh_token");

                if (accessToken && refreshToken) {
                    await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                }
            }
        };

        // 1. Kiểm tra nếu app đang tắt và được mở bởi link (Cold Start)
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink(url);
        });

        // 2. Lắng nghe nếu app đang chạy nền và được mở bởi link
        const subscriptionLinking = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        // 3. Lắng nghe sự kiện Auth của Supabase
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`SUPABASE EVENT: ${event}`);

            // Khi link recovery được setSession thành công, event này sẽ kích hoạt
            if (event === 'PASSWORD_RECOVERY') {
                setIsRecoveryMode(true);
            } else if (event === 'SIGNED_IN') {
                const isRecovery = session?.user?.recovery_sent_at
                if (isRecovery) {
                    setIsRecoveryMode(true);
                }
            }
            if (event === 'USER_UPDATED') {
                setTimeout(() => {
                    Toast.success("Cập nhật mật khẩu thành công!");
                    setIsRecoveryMode(false);
                    setLoading(false);
                    router.replace('/login');
                }, 1000)
            }
        });
        return () => {
            subscriptionLinking.remove();
            authSubscription.unsubscribe();
        };
    }, []);

    const handleResetPassword = async () => {
        if (!email) {
            Toast.error("Vui lòng nhập email hợp lệ.");
            return;
        }
        setLoading(true);
        try {
            // Đảm bảo scheme này trùng với app.json và Supabase Dashboard
            const resetLink = Linking.createURL('forgotPassword');
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: resetLink
            });

            if (error) {
                Toast.error(error.message);
            } else {
                Toast.success("Kiểm tra email để nhận liên kết khôi phục.");
            }
        } catch (err) {
            Toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            Toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                Toast.error("Lỗi cập nhật: " + error.message);
            }
            await useAuthStore.getState().signOut();
        } catch (err) {
            Toast.error("Lỗi kết nối. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <VStack space="md" className="p-4 border-b border-gray-200 bg-white">
                <HStack className="items-center space-x-4">
                    <Pressable onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="black" />
                    </Pressable>
                    <Text className="text-xl font-bold">
                        {isRecoveryMode ? "Đặt lại mật khẩu" : "Quên mật khẩu"}
                    </Text>
                </HStack>
            </VStack>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <VStack space="xl" className="p-6 items-center">
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Heading size="xl" className="text-center">
                        {isRecoveryMode ? "Nhập mật khẩu mới" : "Khôi phục mật khẩu"}
                    </Heading>

                    <Text className="text-center text-gray-500">
                        {isRecoveryMode
                            ? "Vui lòng nhập mật khẩu mới cho tài khoản của bạn."
                            : "Nhập email của bạn để nhận liên kết đặt lại mật khẩu."}
                    </Text>

                    <FormControl className="w-full">
                        <FormControlLabel className="mb-2">
                            <FormControlLabelText>
                                {isRecoveryMode ? "Mật khẩu mới" : "Email"}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input>
                            <InputField
                                type={isRecoveryMode ? "password" : "text"}
                                secureTextEntry={isRecoveryMode}
                                value={isRecoveryMode ? newPassword : email}
                                onChangeText={isRecoveryMode ? setNewPassword : setEmail}
                                placeholder={isRecoveryMode ? "Nhập mật khẩu mới" : "Nhập email của bạn"}
                                autoCapitalize="none"
                                keyboardType={isRecoveryMode ? "default" : "email-address"}
                            />
                        </Input>
                    </FormControl>

                    <Button
                        onPress={isRecoveryMode ? handleUpdatePassword : handleResetPassword}
                        disabled={loading}
                        className="w-full mt-4"
                    >
                        {loading ? <ButtonSpinner color="white" /> : (
                            <ButtonText>{isRecoveryMode ? "Cập nhật mật khẩu" : "Gửi yêu cầu"}</ButtonText>
                        )}
                    </Button>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    scrollContent: { paddingBottom: 20 },
    logo: { width: 150, height: 150, marginBottom: 10 }
});