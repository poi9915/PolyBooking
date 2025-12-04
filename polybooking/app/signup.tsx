import { ThemedView } from "@/components/themed-view";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from '@/components/ui/heading';
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from 'toastify-react-native';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState('');
    const [CfPassword, setCfPassword] = useState('');

    const handleShowPassState = () => {
        setShowPassword((showstate) => { return !showstate });
    }
    const handleEmailSignup = async (userName: string, email: string, password: string) => {
        const cleanEmail = email.trim();
        if (!cleanEmail || !password || !userName) {
            Toast.warn("Vui lòng nhập đầy đủ thông tin hợp lệ.");
            return;
        }
        if (password !== CfPassword) {
            Toast.warn("Mật khẩu xác nhận không khớp.");
            return;
        }
        try {
            // check user tồn tại chưa
            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', cleanEmail)
                .maybeSingle();
            if (checkError) throw checkError;
            if (existingProfile) {
                Toast.error("Email đã được sử dụng.");
                return;
            }
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: cleanEmail,
                password: password
            })
            if (authError) throw authError;
            if (authData.user) {
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: cleanEmail,
                        username: userName,
                    });
                if (insertError) {
                    Toast.error("Đã xảy ra lỗi khi tạo hồ sơ người dùng.");
                } else {
                    Toast.success("Đăng ký thành công! Đang chuyển đến trang đăng nhập ....");
                    setTimeout(() => {
                        router.replace('/login');
                    }, 1500)
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
            Toast.error("Đã xảy ra lỗi trong quá trình đăng ký.");
        }
    }


    return (
        <>
            <SafeAreaView style={styles.container}>
                <ThemedView style={styles.container}>
                    <FormControl className="p-4 border border-outline-200 rounded-lg w-full">
                        <VStack className="gap-4 ">
                            <Heading className="text-typography-900">Signup</Heading>
                            <VStack space="xs" className="">
                                <Text className="text-typography-500">Username</Text>
                                <Input>
                                    <InputField type="text" value={userName} onChangeText={(text) => setUserName(text)} />
                                </Input>
                            </VStack>
                            <VStack space="xs" className="">
                                <Text className="text-typography-500">Email</Text>
                                <Input>
                                    <InputField type="text" value={email} onChangeText={(text) => setEmail(text)} />
                                </Input>
                            </VStack>
                            <VStack space="xs">
                                <Text className="text-typography-500">Password</Text>
                                <Input>
                                    <InputField type={showPassword ? 'text' : 'password'} value={password} onChangeText={(text) => setPassword(text)} />
                                    <InputSlot className="pr-3" onPress={handleShowPassState}>
                                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                </Input>
                            </VStack >
                            <VStack space="xs">
                                <Text className="text-typography-500">Confirm Password</Text>
                                <Input>
                                    <InputField type={showPassword ? 'text' : 'password'} value={CfPassword} onChangeText={(text) => setCfPassword(text)} />
                                    <InputSlot className="pr-3" onPress={handleShowPassState}>
                                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                </Input>
                            </VStack >
                            <Button className="ml-auto w-full" onPress={() => {
                                handleEmailSignup(userName, email, password);
                            }}>
                                <ButtonText>Signup</ButtonText>
                            </Button>
                        </VStack>
                    </FormControl>
                </ThemedView>
                <ToastManager />
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});