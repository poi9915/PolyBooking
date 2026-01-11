import {ThemedView} from "@/components/themed-view";
import {useAuthStore} from "@/store/useAuthStore";
import {supabase} from "@/utils/supabase";
import {Image} from 'expo-image';
import {useRouter} from "expo-router";
import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import * as SecureStore from 'expo-secure-store'
import {RECOVERY_FLAG} from "@/flag/systemFlag";

export default function ModalScreen() {
    const initialize = useAuthStore((state) => state.initialize);
    const router = useRouter();

    useEffect(() => {
        // Khởi tạo luồng xác thực từ store
        // const bootstrap = async () => {
        //     await guardRecovery()
        //
        // }
        initialize();
        // bootstrap()
        // Lắng nghe sự kiện thay đổi trạng thái auth, đặc biệt là PASSWORD_RECOVERY
        const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_OUT") {
                router.replace("/login");
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [])
    // const guardRecovery = async () => {
    //     const isRecovery = await SecureStore.getItemAsync(RECOVERY_FLAG)
    //     if (isRecovery === "true") {
    //         await supabase.auth.signOut()
    //     }
    // }
    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.container}>
                <View style={styles.container}>
                    <Image
                        source={require('../assets/images/background-blu.png')}
                        contentFit='cover'
                        style={StyleSheet.absoluteFill}
                    />
                </View>
            </ThemedView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
