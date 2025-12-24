import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { usePlusCodeDistance } from "@/hooks/use-plus-code-distance";
import { Venue } from "@/types/store.type";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

interface ItemCardProps {
    item: Venue;
    onPress: (item: Venue) => void;
}

interface VenueWithDistance extends Venue {
    distance?: number;
}

export default function ItemCard({
    item,
    onPress,
}: ItemCardProps) {
    const imageURL = item.images?.[0];

    const rating = item.rating || 0;
    const ratingCount = item.rating_count || 0;
    const price = Number(item.price).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    // Use pre-calculated distance if available, otherwise use the hook as a fallback
    const precalculatedDistance = (item as VenueWithDistance).distance;
    const { distanceText: hookDistanceText } = usePlusCodeDistance(item.location_code, precalculatedDistance);
    const distanceText = precalculatedDistance !== undefined
        ? (precalculatedDistance < 1
            ? `${Math.round(precalculatedDistance * 1000)} m`
            : `${precalculatedDistance.toFixed(1)} km`)
        : hookDistanceText;


    return (
        <Pressable onPress={() => onPress(item)} style={{ width: "100%" }}>
            <Card style={styles.card}>
                <HStack space="md" style={styles.container}>

                    {/* IMAGE */}
                    <Image
                        source={imageURL}
                        style={styles.imageStyle} // Giữ lại borderRadius
                        placeholder={require("../assets/images/Spinner.gif")}
                        transition={300}
                    />

                    {/* INFO */}
                    <VStack style={{ flex: 1 }} space="sm">
                        <Heading size="md" numberOfLines={1}>
                            {item.name}
                        </Heading>

                        <Text size="xs" className="text-gray-500 text-sm" numberOfLines={1}>
                            {item.address}
                        </Text>

                        <HStack space="md" className="items-center mt-1">
                            <VStack>
                                <Text size="xs" className="font-bold text-sm text-[#0A401E]">
                                    {rating.toFixed(1)}/5 ({ratingCount}{" "}
                                    {ratingCount <= 1 ? "vote" : "votes"})
                                </Text>
                            </VStack>
                            {distanceText && (
                                <Text size="xs" className="text-gray-600">
                                    📍 {distanceText} away
                                </Text>
                            )}
                        </HStack>

                        <Text className="font-bold text-lg text-[#0A401E]">
                            {price} / giờ
                        </Text>

                        <Button
                            size="sm"
                            className="bg-[#0A401E] rounded-xl w-[90px] mt-1"
                            onPress={() => onPress(item)}
                        >
                            <ButtonText className="text-white text-xs">Details</ButtonText>
                        </Button>
                    </VStack>
                </HStack>
            </Card>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    card: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 14,
        padding: 12,
        marginBottom: 14,

        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    imageStyle: {
        width: 140,
        height: 140,
        borderRadius: 12,
    },
});
