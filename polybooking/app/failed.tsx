import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useBookingStore } from "@/store/useBookingStore";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentFailed() {
    const router = useRouter();
    const { selectedCourt } = useBookingStore();

    const handleGoBack = () => {
        if (selectedCourt?.venue_id) {
            router.push(`/booking/${selectedCourt.venue_id}`);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <VStack space="lg" className="items-center p-4">
                <AntDesign name="close-circle" size={72} color="red" />
                <Heading>Thanh toán thất bại</Heading>
                <Text className="text-center">Đã có lỗi xảy ra .Giao dịch đã bị huỷ .</Text>
                <Button onPress={handleGoBack} action="negative" className="mt-4">
                    <ButtonText>Quay Lại</ButtonText>
                </Button>
            </VStack>
        </SafeAreaView>
    );
}