import { ThemedView } from "@/components/themed-view";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from '@/components/ui/heading';
import { EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import ToastManager, { Toast } from 'toastify-react-native';
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { initialize, loading } = useAuthStore();
    const handleShowPassState = () => {
        setShowPassword((showstate) => { return !showstate });
    }
    const handleEmailLogin = async (email: string, password: string) => {
        const cleanEmail = email.trim();
        if (!cleanEmail || !password) {
            Toast.warn("Vui lòng nhập email và mật khẩu hợp lệ.");
            return;
        }
        try {

            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', cleanEmail)
                .maybeSingle();

            if (checkError) throw checkError;


            if (!existingProfile) {
                Toast.warn("User chưa tồn tại. Vui lòng đăng ký trước khi đăng nhập.");
                console.log("User ko tồn tại ");

                return; // Dừng luồng tại đây
            }

            const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: password,
            });

            if (loginError) throw loginError;
            if (authData.user) {
                console.log("Đăng nhập thành công:", authData.user);
                Toast.success("Đăng nhập thành công")
                router.replace('/(tabs)/home');
            }
        } catch (error: any) {
            console.log("Lỗi quy trình:", error.message);
            // Toast.error(error.message);
        }

    }
    return (
        <>
            <SafeAreaView style={styles.container}>
                <ThemedView style={styles.container}>
                    <FormControl className="p-4 border border-outline-200 rounded-lg w-full">
                        <VStack className="gap-4 ">
                            <Heading className="text-typography-900">Login</Heading>
                            <VStack space="xs" className="">
                                <Text className="text-typography-500">Email</Text>
                                <Input>
                                    <InputField type="text" value={email} onChangeText={(text) => setEmail(text)} />
                                </Input>
                            </VStack>
                            <VStack space="xs">
                                <Text className="text-typography-500">Password</Text>
                                <Input>
                                    <InputField type={showPassword ? 'text' : 'password'} value={password} onChangeText={(pass) => setPassword(pass)} />
                                    <InputSlot className="pr-3" onPress={handleShowPassState}>
                                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                </Input>
                            </VStack >
                            <Text onPress={() => {
                                router.push('/signup')
                            }}>Have no account yet? signup now!!</Text>
                            <Button className="ml-auto w-full" onPress={() => {
                                handleEmailLogin(email, password);
                            }}>
                                <ButtonText>Login</ButtonText>
                            </Button>
                            <Button className="ml-auto w-full">
                                <ButtonText>Login with google</ButtonText>
                            </Button>
                        </VStack>
                    </FormControl>
                </ThemedView>
                <ToastManager />
            </SafeAreaView>
        </>
    );

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