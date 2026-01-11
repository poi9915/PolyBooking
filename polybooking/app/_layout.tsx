import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto'; // Polyfill for Supabase

import {useColorScheme} from '@/hooks/use-color-scheme';

import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ToastManager from "toastify-react-native";


// export const unstable_settings = {
//   anchor: '(tabs)',
// };

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <SafeAreaProvider style={{flex: 1}}>
                <GluestackUIProvider mode={'light'}>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Stack>
                            <Stack.Screen name="index" options={{title: 'index', headerShown: false}}/>
                            <Stack.Screen name="login" options={{title: 'login', headerShown: false}}/>
                            <Stack.Screen name="signup" options={{title: 'signup', headerShown: false}}/>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="venue/[id]" options={{headerShown: false,}}/>
                            <Stack.Screen name="booking/[id]" options={{headerShown: false}}/>
                            <Stack.Screen name="success" options={{headerShown: false}}/>
                            <Stack.Screen name="failed" options={{headerShown: false}}/>
                            <Stack.Screen name="notification" options={{headerShown: false}}/>
                            <Stack.Screen name="review" options={{headerShown: false}}/>
                            <Stack.Screen name="forgotPassword" options={{headerShown: false}}/>
                            <Stack.Screen name="resetPassword" options={{headerShown: false}}/>
                        </Stack>
                        <StatusBar style="auto"/>
                    </ThemeProvider>
                </GluestackUIProvider>
            </SafeAreaProvider>
            <ToastManager/>
        </GestureHandlerRootView>
    );
}
