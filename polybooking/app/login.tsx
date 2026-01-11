import {ThemedView} from "@/components/themed-view";
import {Button, ButtonText} from "@/components/ui/button";
import {FormControl} from "@/components/ui/form-control";
import {Heading} from '@/components/ui/heading';
import {EyeIcon, EyeOffIcon} from "@/components/ui/icon";
import {Input, InputField, InputIcon, InputSlot} from '@/components/ui/input';
import {Text} from '@/components/ui/text';
import {VStack} from '@/components/ui/vstack';
import {useAuthStore} from "@/store/useAuthStore";
import {router} from "expo-router";
import React, {useState} from "react";
import {Image, StyleSheet, Pressable} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import ToastManager, {Toast} from 'toastify-react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassState = () => {
        setShowPassword((showstate) => {
            return !showstate
        });
    };

    const handleEmailLogin = async (email: string, password: string) => {
        const cleanEmail = email.trim();
        if (!cleanEmail || !password) {
            Toast.warn("Vui lòng nhập email và mật khẩu hợp lệ.");
            return;
        }

        // Gọi hàm signIn từ store, store sẽ xử lý toàn bộ logic
        try {
            const signIn = useAuthStore.getState().signIn;
            await signIn(cleanEmail, password);
        } catch (err) {
            console.log();
            
        }

    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ThemedView style={styles.container}>
                    <VStack space="xl" className="w-full items-center">
                        <Image
                            source={require('../assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <FormControl style={{
                            padding: 16,
                            borderRadius: 12,
                            backgroundColor: 'white',
                            elevation: 8,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: -4},
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                        }} className=" bg-white  p-4 border border-outline-200 rounded-lg w-full ">
                            <VStack space="lg">
                                <Heading size="2xl" className="text-typography-900 text-center font-bold">Welcome
                                    Back!</Heading>
                                <VStack space="xs" className="">
                                    <Text className="text-typography-600">Email</Text>
                                    <Input>
                                        <InputField type="text" value={email} onChangeText={(text) => setEmail(text)}/>
                                    </Input>
                                </VStack>
                                <VStack space="xs" className="mt-2">
                                    <Text className="text-typography-600">Password</Text>
                                    <Input>
                                        <InputField type={showPassword ? 'text' : 'password'} value={password}
                                                    onChangeText={(pass) => setPassword(pass)}/>
                                        <InputSlot className="pr-3" onPress={handleShowPassState}>
                                            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon}/>
                                        </InputSlot>
                                    </Input>
                                    <Pressable onPress={() => router.push('/forgotPassword')}>
                                        <Text className="text-right text-sm text-primary-500 font-medium mt-1">Forgot
                                            password?</Text>
                                    </Pressable>
                                </VStack>
                                <VStack space="md" className="mt-4">
                                    <Button className="w-full" onPress={() => {
                                        handleEmailLogin(email, password);
                                    }}>
                                        <ButtonText>Login</ButtonText>
                                    </Button>
                                    {/* <Button variant="outline" className="w-full">
                                        <ButtonText>Login with Google</ButtonText>
                                    </Button> */}
                                    <Text className="text-center mt-2" onPress={() => {
                                        router.push('/signup')
                                    }}>Have no account yet? <Text className="font-bold text-primary-500">Signup
                                        now!</Text></Text>
                                </VStack>
                            </VStack>
                        </FormControl>
                    </VStack>
                </ThemedView>
            </SafeAreaView>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FEF8E9',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 16,
    }
});