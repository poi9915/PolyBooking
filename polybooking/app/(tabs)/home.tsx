import ItemCard from "@/components/item-card";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/useAuthStore";
import { useVenueStore } from "@/store/useVenueStore";
import { Venue } from "@/types/store.type";
import { getCurrentLocation, haversineWithPlusCode } from "@/utils/location";
import { router, useFocusEffect } from "expo-router";
import { SearchIcon, SlidersHorizontal } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "A-Z" | "BEST_RATED" | "LOWEST_PRICE" | "NEAR_ME" | "OPEN_NOW";

interface VenueWithDistance extends Venue {
    distance?: number;
}

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
    const [venuesWithDistance, setVenuesWithDistance] = useState<VenueWithDistance[]>([]);

    const venues = useVenueStore((state) => state.venues);
    const loading = useVenueStore((state) => state.loading);
    const fetchVenues = useVenueStore((state) => state.fetchVenues);
    const { session, loading: authLoading } = useAuthStore();

    const onRefresh = () => {
        setRefreshing(true);
        fetchVenues().finally(() => setRefreshing(false));
    };

    useFocusEffect(
        useCallback(() => {
            // Chỉ fetch venues khi quá trình xác thực đã hoàn tất và không còn loading
            if (!authLoading) {
                fetchVenues();
            }
        }, [authLoading]) // Chạy lại effect này khi trạng thái authLoading thay đổi
    );

    useEffect(() => {
        // Calculate distances when venues list or location permission changes
        const calculateDistances = async () => {
            try {
                const loc = await getCurrentLocation();
                const venuesWithDist = venues.map((venue) => {
                    if (!venue.location_code) return { ...venue, distance: undefined };
                    try {
                        const distance = haversineWithPlusCode(loc.lat, loc.lng, venue.location_code);
                        return { ...venue, distance };
                    } catch (e) {
                        return { ...venue, distance: undefined };
                    }
                });
                setVenuesWithDistance(venuesWithDist);
            } catch (error) {
                // If location is not available, just use venues without distance
                setVenuesWithDistance(venues);
            }
        };

        if (venues.length > 0) {
            calculateDistances();
        }
    }, [venues]);

    const handleFilterPress = (filter: FilterType) => {
        setActiveFilter((prevFilter) => (prevFilter === filter ? null : filter));
    };

    const processedVenues = useMemo(() => {
        // 1. Apply search query first
        let processed = venuesWithDistance.filter((venue) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                venue.name.toLowerCase().includes(query) ||
                venue.address?.toLowerCase().includes(query)
            );
        });

        // 2. Apply active filter/sort
        if (activeFilter) {
            // Create a shallow copy before sorting to avoid mutating the original array
            processed = [...processed];

            switch (activeFilter) {
                case "A-Z":
                    processed.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "BEST_RATED":
                    processed.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case "LOWEST_PRICE":
                    processed.sort((a, b) => Number(a.price) - Number(b.price));
                    break;
                case "NEAR_ME":
                    processed.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
                    break;
                case "OPEN_NOW":
                    // This is a placeholder logic. You should replace it with your actual opening hours logic.
                    // For example, check if current time is within venue's opening hours.
                    // Here, we'll just filter for venues that have a specific (mock) property.
                    processed = processed.filter((venue) => venue.id % 2 === 0); // Mock: only even IDs are "open"
                    break;
            }
        }

        return processed;
    }, [searchQuery, venuesWithDistance, activeFilter]);

    const handleVenuePress = (venue: Venue) => {
        // Check if the venue object has distance and remove it before passing to router
        const { distance, ...venueData } = venue as VenueWithDistance;
        if (distance !== undefined) {
            router.push(`/venue/${(venueData as Venue).id}`);
        } else {
            router.push(`/venue/${venue.id}`);
        }
    };

    // HEADER UI
    const SearchHeader = useMemo(() => {
        return (
            <VStack space="md" className="px-4 pt-4 pb-2">
                <Heading size="3xl" className="font-bold text-[#0A401E]">
                    Find Your Perfect Pitch
                </Heading>

                <Input className="mt-2 bg-white rounded-2xl" style={styles.shadow}>
                    <InputSlot className="pl-3">
                        <InputIcon as={SearchIcon} />
                    </InputSlot>

                    <InputField
                        placeholder="Search by court name or location"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <InputSlot className="pr-3">
                        <InputIcon as={SlidersHorizontal} />
                    </InputSlot>
                </Input>

                {/* Filter Buttons */}
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <HStack space="sm" className="mt-1 flex-wrap">
                        <Button
                            variant={activeFilter === "A-Z" ? "solid" : "outline"}
                            size="sm"
                            className="rounded-full px-4"
                            onPress={() => handleFilterPress("A-Z")}
                        >
                            <ButtonText>A-Z</ButtonText>
                        </Button>
                        <Button
                            variant={activeFilter === "BEST_RATED" ? "solid" : "outline"}
                            size="sm"
                            className="rounded-full px-4"
                            onPress={() => handleFilterPress("BEST_RATED")}
                        >
                            <ButtonText>⭐ Best Rated</ButtonText>
                        </Button>

                        <Button
                            variant={activeFilter === "LOWEST_PRICE" ? "solid" : "outline"}
                            size="sm"
                            className="rounded-full px-4"
                            onPress={() => handleFilterPress("LOWEST_PRICE")}
                        >
                            <ButtonText>$ Lowest Price</ButtonText>
                        </Button>

                        <Button
                            variant={activeFilter === "NEAR_ME" ? "solid" : "outline"}
                            size="sm"
                            className="rounded-full px-4"
                            onPress={() => handleFilterPress("NEAR_ME")}
                        >
                            <ButtonText>📍 Near Me</ButtonText>
                        </Button>

                        <Button
                            variant={activeFilter === "OPEN_NOW" ? "solid" : "outline"}
                            size="sm"
                            className="rounded-full px-4"
                            onPress={() => handleFilterPress("OPEN_NOW")}
                        >
                            <ButtonText>🟢 Open Now</ButtonText>
                        </Button>
                    </HStack>
                </ScrollView>

            </VStack>
        );
    }, [searchQuery, activeFilter]);

    return (
        <SafeAreaView style={styles.container}>
            {SearchHeader}

            <FlatList
                data={processedVenues}
                renderItem={({ item }) => (
                    <ItemCard item={item} onPress={handleVenuePress} />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
                keyboardShouldPersistTaps="always"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F7F9",
    },
    shadow: {
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
});
