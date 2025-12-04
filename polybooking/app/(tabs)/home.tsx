import ItemCard from "@/components/item-card";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/useAuthStore";
import { useVenueStore } from "@/store/useVenueStore";
import { Venue } from "@/types/store.type";
import { AntDesign } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
    // Lấy state và actions từ store một cách riêng lẻ để tối ưu render
    const venues = useVenueStore((state) => state.venues);
    const loading = useVenueStore((state) => state.loading);
    const fetchVenues = useVenueStore((state) => state.fetchVenues);

    const { initialize, session } = useAuthStore()
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            fetchVenues();
            setRefreshing(false);
        }, 500)
    }

    // Sử dụng useFocusEffect để đảm bảo dữ liệu được làm mới khi quay lại màn hình
    useFocusEffect(
        useCallback(() => {
            if (session == null) {
                initialize()
            }
            fetchVenues();
        }, [])
    );

    // Lọc danh sách sân khi query hoặc danh sách gốc thay đổi
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVenues(venues);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = venues.filter(
                (venue) =>
                    venue.name.toLowerCase().includes(lowercasedQuery) || (venue.address && venue.address.toLowerCase().includes(lowercasedQuery))
            );
            setFilteredVenues(filtered);
        }
    }, [searchQuery, venues]);
    const handleVenuePress = (venue: Venue) => {
        router.push(`/venue/${venue.id}`)
    }

    // Sử dụng useMemo để memoize component Header, chỉ render lại khi searchQuery thay đổi.
    const SearchHeader = useMemo(() => {
        return (
            <Card className="m-3 shadow-md" style={styles.fabCard}>
                <VStack space="lg" className="p-4">
                    <Heading size="2xl" className="font-bold">Find Your Perfect Pitch</Heading>
                    <HStack space="md" className="items-center">
                        <Input className="flex-1">
                            <InputSlot className="pl-3">
                                <InputIcon as={SearchIcon} />
                            </InputSlot>
                            <InputField
                                placeholder="Tìm theo tên sân, địa chỉ..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </Input>
                        <Button onPress={() => router.push('/notification')} variant="link" size="lg" className="p-0 pl-3">
                            <AntDesign name="bell" size={24} color="black" />
                        </Button>
                    </HStack>
                </VStack>
            </Card>
        );
    }, [searchQuery]);

    return (
        <SafeAreaView style={styles.container}>
            {SearchHeader}
            <FlatList
                data={filteredVenues}
                renderItem={
                    ({ item }) => (
                        <Box style={styles.itemContainer}>
                            <ItemCard item={item} onPress={handleVenuePress} />
                        </Box>
                    )
                }
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContentContainer}
                keyboardShouldPersistTaps='always'
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    listContentContainer: {
        paddingHorizontal: 4,
    },
    itemContainer: {
        flex: 1,
        padding: 8,
    },
    fabCard: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
});