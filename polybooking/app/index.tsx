
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/useAuthStore";
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalScreen() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Khởi tạo luồng xác thực từ store
    initialize();
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
