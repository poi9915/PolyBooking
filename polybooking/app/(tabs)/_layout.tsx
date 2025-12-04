import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
export default function RootLayout() {
    const colorScheme = useColorScheme() ?? 'light';
    const activeColors = Colors[colorScheme];
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: activeColors.tabIconSelected,
            tabBarInactiveTintColor: activeColors.tabIconDefault,
            tabBarStyle: {
                backgroundColor: activeColors.background,
                borderTopColor: colorScheme === 'dark' ? '#333' : '#e5e5e5'
            }
        }}>
            <Tabs.Screen name="home" options={{
                title: "Home"
            }} />
            <Tabs.Screen name="booking" options={{
                title: "Booking"
            }} />
            <Tabs.Screen name="setting" options={{
                title: "Setting"
            }} />
        </Tabs>
    )
}