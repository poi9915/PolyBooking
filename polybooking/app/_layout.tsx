import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';

import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import {SafeAreaProvider} from 'react-native-safe-area-context';


// export const unstable_settings = {
//   anchor: '(tabs)',
// };

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
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
                    </Stack>
                    <StatusBar style="auto"/>
                </ThemeProvider>
            </GluestackUIProvider>
        </SafeAreaProvider>
    );
}
