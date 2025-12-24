import { Colors } from "@/constants/theme";
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
                borderTopColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
            }
        }}>
            <Tabs.Screen name="home" options={{
                title: "Home",
                tabBarIcon: ({ color }) => <FontAwesome name='home' size={28} color={color} />
            }} />
            <Tabs.Screen name="booking" options={{
                title: "Booking",
                tabBarIcon: ({ color }) => <FontAwesome name='calendar' size={28} color={color} />
            }} />
            <Tabs.Screen name="setting" options={{
                title: "Setting",
                tabBarIcon: ({ color }) => <FontAwesome name='cog' size={28} color={color} />
            }} />
        </Tabs>
    )
}