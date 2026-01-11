import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from 'toastify-react-native';
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";

export default function ResetPassword() {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Toast.error("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            Toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);

        try {
            // Update password directly for the logged-in user
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                Toast.error(`Lỗi cập nhật mật khẩu: ${updateError.message}`);
            } else {
                Toast.success("Đổi mật khẩu thành công.");
                router.back();
            }
        } catch (error: any) {
            Toast.error(`Đã xảy ra lỗi: ${error.message}`);
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
                    <Text className="text-xl font-bold">Đổi mật khẩu</Text>
                </HStack>
            </VStack>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <VStack space="xl" className="p-6">
                    <FormControl>
                        <FormControlLabel className="mb-2"><FormControlLabelText className="text-base font-medium text-gray-700">Mật khẩu mới</FormControlLabelText></FormControlLabel>
                        <Input>
                            <InputField 
                                type={showNewPassword ? "text" : "password"} 
                                value={newPassword} 
                                onChangeText={setNewPassword} 
                                placeholder="Nhập mật khẩu mới" 
                            />
                            <InputSlot className="pr-3" onPress={() => setShowNewPassword(!showNewPassword)}>
                                <InputIcon as={showNewPassword ? EyeIcon : EyeOffIcon} />
                            </InputSlot>
                        </Input>
                    </FormControl>

                    <FormControl>
                        <FormControlLabel className="mb-2"><FormControlLabelText className="text-base font-medium text-gray-700">Xác nhận mật khẩu mới</FormControlLabelText></FormControlLabel>
                        <Input>
                            <InputField 
                                type={showConfirmPassword ? "text" : "password"} 
                                value={confirmPassword} 
                                onChangeText={setConfirmPassword} 
                                placeholder="Nhập lại mật khẩu mới" 
                            />
                            <InputSlot className="pr-3" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                            </InputSlot>
                        </Input>
                    </FormControl>

                    <Button onPress={handleUpdatePassword} disabled={loading} className="mt-6 w-full">
                        {loading ? <ButtonSpinner color="white" /> : <ButtonText>Lưu thay đổi</ButtonText>}
                    </Button>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        paddingBottom: 20,
    },
});