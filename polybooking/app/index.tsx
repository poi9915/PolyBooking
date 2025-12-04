
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen() {
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("User is logged in :");
        router.replace('./(tabs)/home');
      } else {
        router.replace('/login');
      }
    }
    checkAuth()
  }, [])

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
