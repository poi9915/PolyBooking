import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccess() {
    const router = useRouter();

    const handleViewBookings = () => {
        router.replace('/(tabs)/booking');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <VStack space="lg" className="items-center justify-center p-4 flex-1">
                <AntDesign name="check-circle" size={72} color="green" />
                <Heading>Thanh toán thành công</Heading>
                <Text className="text-center">Cảm ơn bạn đã đặt sân. Lịch đặt của bạn đã được xác nhận.</Text>
                <Button onPress={handleViewBookings} action="primary" className="mt-4">
                    <ButtonText>Xem lịch đặt</ButtonText>
                </Button>
            </VStack>
        </SafeAreaView>
    );
}