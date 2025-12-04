import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Heading} from "@/components/ui/heading";
import {ArrowRightIcon, CheckIcon, GlobeIcon, Icon} from "@/components/ui/icon";
import {Link} from "@/components/ui/link";
import {Skeleton, SkeletonText} from "@/components/ui/skeleton";
import {Text} from "@/components/ui/text";
import {VStack} from "@/components/ui/vstack";
import {useVenueStore} from "@/store/useVenueStore";
import {Image} from "expo-image";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect} from "react";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

const {width} = Dimensions.get('window');

export default function Venue() {
    const {id} = useLocalSearchParams();
    const {activeVenue, courts, loading, fetchVenueById} = useVenueStore();

    useEffect(() => {

        if (id) {
            fetchVenueById(Number(id));
        }


    }, [id]);

    // Lọc chỉ những sân con đang hoạt động
    const activeCourts = courts.filter(court => court.is_active);

    // Xử lý metadata để lấy danh sách tiện ích
    const amenities = activeVenue?.metadata
        ? Object.entries(activeVenue.metadata)
            .filter(([, value]) => value === true)
            .map(([key]) => key)
        : [];

    const handleBooking = () => {
        router.push(`/booking/${activeVenue?.id}`)
    }

    // Chuẩn bị dữ liệu cho SwiperFlatList, nếu không có ảnh thì dùng mảng chứa null
    const displayImages = (activeVenue?.images && activeVenue.images.length > 0)
        ? activeVenue.images
        : [null];

    // --- SKELETON LOADER ---
    if (loading) {
        // Hiển thị giao diện chờ trong khi tải dữ liệu
        return <VenueDetailSkeleton/>;
    }

    if (!activeVenue) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Không tìm thấy thông tin địa điểm.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Card className="m-3 shadow-md" style={styles.fabCard}>
                    {/* Image Slider */}
                    <View style={styles.swiperContainer}>
                        <SwiperFlatList
                            autoplayDelay={3}
                            autoplayLoop
                            data={displayImages}
                            renderItem={({item}) => (
                                <View style={styles.slide}>
                                    <Image source={item ? {uri: item} : require('@/assets/images/Spinner.gif')}
                                           style={styles.image} alt={item ? 'Venue image' : 'Placeholder'}
                                           contentFit='fill'/>
                                </View>
                            )}
                        />
                    </View>

                    {/* Venue Info */}
                    <VStack space="md" className="p-4">
                        <Heading size="xl">{activeVenue.name}</Heading>
                        <Link href="#" className="flex-row items-center -mt-2">
                            <Icon as={GlobeIcon} size="sm" className="mr-2 text-typography-500"/>
                            <Text isTruncated className="text-typography-600 underline">{activeVenue.address}</Text>
                        </Link>

                        <View className="flex-row justify-between items-center mt-2">
                            <Text size="lg" bold>{Number(activeVenue.price).toLocaleString('vi-VN')}đ/h</Text>
                            <StarRatingDisplay rating={activeVenue.rating || 0} starSize={24}/>
                        </View>

                        <View className="flex-row gap-4">
                            <Text size="sm" className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {activeVenue.surface || 'N/A'}
                            </Text>
                            <Text size="sm" className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                {activeVenue.is_indoor ? 'Trong nhà' : 'Ngoài trời'}
                            </Text>
                        </View>
                    </VStack>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                        <VStack space="sm" className="p-4 pt-0">
                            <Heading size="lg">Tiện ích</Heading>
                            <View className="flex-row flex-wrap gap-2">
                                {amenities.map(amenity => (
                                    <View key={amenity} className="flex-row items-center bg-gray-100 p-2 rounded">
                                        <Icon as={CheckIcon} size="sm" className="mr-1"/>
                                        <Text size="sm" className="capitalize">{amenity}</Text>
                                    </View>
                                ))}
                            </View>
                        </VStack>
                    )}

                    {/* Courts */}
                    <VStack space="sm" className="p-4 pt-0">
                        <Heading size="lg">Các sân có sẵn</Heading>
                        {activeCourts.length > 0 ? activeCourts.map(court => (
                            <Card key={court.id}
                                  className="p-3 flex-row justify-between items-center shadow-sm bg-gray-50">
                                <VStack>
                                    <Text bold>{court.name}</Text>
                                    <Text size="sm"
                                          className="text-typography-500">Giá: {court.default_price_per_hour.toLocaleString('vi-VN')}đ/h</Text>
                                </VStack>
                            </Card>
                        )) : <Text>Hiện không có sân nào hoạt động.</Text>}
                    </VStack>
                </Card>
            </ScrollView>

            {/* Floating Action Button (FAB) */}
            <View style={styles.fabContainer}>
                <Button size="lg" className="rounded-full shadow-lg" onPress={handleBooking}>
                    <ButtonText>Đặt sân</ButtonText>
                    <ButtonIcon as={ArrowRightIcon} className="ml-2"/>
                </Button>
            </View>
        </SafeAreaView>
    )
}

// Component cho giao diện chờ (Skeleton)
const VenueDetailSkeleton = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Skeleton cho Image Slider */}
                <Skeleton className="h-[250px] w-full"/>

                <VStack space="md" className="p-4">
                    {/* Skeleton cho Tên và Địa chỉ */}
                    <SkeletonText className="h-8 w-3/4"/>
                    <SkeletonText className="h-5 w-full mt-1"/>

                    {/* Skeleton cho Tags */}
                    <View className="flex-row gap-4 mt-2">
                        <Skeleton className="h-7 w-24 rounded"/>
                        <Skeleton className="h-7 w-24 rounded"/>
                    </View>

                    {/* Skeleton cho Giá và Rating */}
                    <View className="flex-row justify-between items-center mt-4">
                        <SkeletonText className="h-7 w-1/3"/>
                        <Skeleton className="h-6 w-28"/>
                    </View>

                    {/* Skeleton cho Sân con */}
                    <VStack space="sm" className="mt-6">
                        <SkeletonText className="h-7 w-1/2 mb-2"/>
                        <Skeleton className="h-16 w-full rounded-lg"/>
                        <Skeleton className="h-16 w-full rounded-lg"/>
                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    swiperContainer: {
        width: '100%',
        height: 230,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 35,
        right: 20,
    },
    fabCard: {
        padding: 10,
        borderRadius: 3,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    fabCardChild: {
        padding: 1,
        borderRadius: 2,
        backgroundColor: 'white',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
    }
});