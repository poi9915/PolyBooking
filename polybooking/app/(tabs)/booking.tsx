import {Box} from '@/components/ui/box';
import {Heading} from '@/components/ui/heading';
import {Input} from '@/components/ui/input';
import {Text} from '@/components/ui/text';
import {VStack} from '@/components/ui/vstack';
import {useAuthStore} from '@/store/useAuthStore';
import {Tables} from '@/types/database.types';
import {supabase} from '@/utils/supabase'; // Import supabase
import {AntDesign, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {format} from 'date-fns';
import {Image} from 'expo-image';
import {useFocusEffect} from 'expo-router';
import {useCallback, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
    TextInput,
    ScrollView
} from 'react-native';
import ActionSheet, {ActionSheetRef} from "react-native-actions-sheet";
import {SafeAreaView} from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";


// Mở rộng type Booking để bao gồm thông tin từ court và venue
type BookingWithDetails = Tables<'bookings'> & {
    courts: {
        venue_id: number;
        name: string;
        venues: {
            name: string;
            images: string[] | null;
        } | null;
    } | null;
};

// Bảng màu cho các trạng thái, sử dụng hex-code để tương thích với StyleSheet
const statusColors: Record<string, string> = {
    pending: '#facc15',            // yellow-400
    confirmed: '#3b82f6',          // blue-500
    paid: '#22c55e',               // green-500
    checked_in: '#14b8a6',         // teal-500
    checked_in_completed: '#0f766e', // teal-700
    cancelled: '#ef4444',          // red-500
    refund_requested: '#F97316FF', // orange-500
    completed: '#9ca3af',          // gray-400
};

const statusTranslations: Record<string, string> = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    paid: 'Đã thanh toán',
    checked_in: 'Đợi check in ',
    checked_in_completed: 'Đã check in',
    cancelled: 'Đã hủy',
    refund_requested: 'Yêu cầu hoàn tiền',
    completed: 'Đã hoàn thành',
};


const BookingScreen = () => {
    const {profile} = useAuthStore();
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const reviewActionSheetRef = useRef<ActionSheetRef>(null);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [ratedVenueIds, setRatedVenueIds] = useState<Set<number>>(new Set());

    const fetchBookings = async () => {
        if (!profile) return;
        try {
            const {data, error} = await supabase
                .from('bookings')
                .select(`
          *,
          courts (
            venue_id,
            name,
            venues (
              name,
              images
            )
          )
        `)
                .eq('user_id', profile.id)
                .order('created_at', {ascending: false});

            if (error) throw error;
            setBookings(data as BookingWithDetails[]);

            // Lấy danh sách các venue đã được user này đánh giá
            const {data: ratingsData, error: ratingsError} = await supabase
                .from('venue_ratings')
                .select('venue_id')
                .eq('user_id', profile.id);
            if (ratingsData) setRatedVenueIds(new Set(ratingsData.map(r => r.venue_id)));
        } catch (error: any) {
            Alert.alert('Lỗi', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            if (profile) {
                fetchBookings();
            }
        }, [profile])
    );
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBookings();
    }, [profile]);

    const handleCancelBooking = async (booking: BookingWithDetails) => {
        const newStatus = booking.status === 'paid' ? 'refund_requested' : 'cancelled';

        Alert.alert(
            "Xác nhận hủy",
            `Bạn có chắc chắn muốn hủy lịch đặt này? ".`,
            [
                {text: "Không"},
                {
                    text: "Có, hủy",
                    onPress: async () => {
                        const {error} = await supabase
                            .from('bookings')
                            .update({status: newStatus})
                            .eq('id', booking.id);

                        if (error) {
                            Alert.alert('Lỗi', 'Không thể hủy lịch đặt: ' + error.message);
                        } else {
                            Alert.alert('Thành công', 'Lịch đặt đã được hủy.');
                            fetchBookings(); // Tải lại danh sách
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleOpenActionSheet = (booking: BookingWithDetails) => {
        setSelectedBooking(booking);
        actionSheetRef.current?.show();
    };

    const handleReviewBooking = () => {
        actionSheetRef.current?.hide();
        setRating(0); // Reset rating khi mở
        setReviewContent(''); // Reset content khi mở
        reviewActionSheetRef.current?.show();
    }

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn số sao để đánh giá.");
            return;
        }
        if (!profile || !selectedBooking || !selectedBooking.courts?.venue_id) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin cần thiết để đánh giá.");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const {error} = await supabase.from('venue_ratings').insert({
                user_id: profile.id,
                venue_id: selectedBooking.courts.venue_id,
                rating: rating,
                content: reviewContent, // Thêm content vào đây
            });

            if (error) throw error;

            Alert.alert("Thành công", "Cảm ơn bạn đã gửi đánh giá!");
            reviewActionSheetRef.current?.hide();
            // Cập nhật lại danh sách đã đánh giá để UI thay đổi ngay lập tức
            setRatedVenueIds(prev => {
                const newSet = new Set(prev);
                newSet.add(selectedBooking.courts!.venue_id);
                return newSet;
            });
        } catch (error: any) {
            console.error("Review submission error:", error);
            // Giả sử lỗi '23505' là lỗi unique constraint (đã đánh giá rồi)
            const message = error.code === '23505' ? "Bạn đã đánh giá địa điểm này rồi." : `Đã có lỗi xảy ra: ${error.message}`;
            Alert.alert("Lỗi", message);
        } finally {
            setIsSubmittingReview(false);
        }
    }


    const renderBookingItem = ({item}: { item: BookingWithDetails }) => {
        const venue = item.courts?.venues;
        const court = item.courts;
        const imageUrl = venue?.images?.[0] || 'https://via.placeholder.com/300x200.png?text=No+Image';


        let startDate: Date | null = null;
        let endDate: Date | null = null;
        if (Array.isArray(item.during)) {
            // Xử lý nếu là mảng
            let startStr = item.during[0].replace(" ", "T");
            let endStr = item.during[1].replace(" ", "T");
            // Fix lỗi +00 cho mobile
            if (startStr.endsWith("+00")) startStr = startStr.replace("+00", "Z");
            if (endStr.endsWith("+00")) endStr = endStr.replace("+00", "Z");
            startDate = new Date(startStr);
            endDate = new Date(endStr);
        } else if (typeof item.during === "string") {
            // Clean ký tự đặc biệt
            const cleanStr = item.during.replace(/[\[\]()"]/g, '');
            const parts = cleanStr.split(',');
            if (parts.length >= 2) {
                // Trim và thay thế Space -> T
                let startStr = parts[0].trim().replace(" ", "T");
                let endStr = parts[1].trim().replace(" ", "T");

                // Thay thế đuôi "+00" thành "Z" để engine hiểu đây là giờ UTC chuẩn
                if (startStr.endsWith("+00")) startStr = startStr.replace("+00", "Z");
                if (endStr.endsWith("+00")) endStr = endStr.replace("+00", "Z");
                startDate = new Date(startStr);
                endDate = new Date(endStr);
                //console.log("Final String:", startStr, endStr);
            }
        }

        return (
            <Pressable onPress={() => handleOpenActionSheet(item)}>
                <Box className="bg-background-0 rounded-lg overflow-hidden shadow-lg" style={styles.fabCard}>
                    <Image source={{uri: imageUrl}} style={styles.cardImage}/>
                    <VStack className="p-4 space-y-3">
                        {/* Tên địa điểm và sân */}
                        <VStack>
                            <Text
                                className="text-lg font-bold text-typography-900">{venue?.name || 'Không rõ địa điểm'}</Text>
                            <Text className="text-sm text-typography-500">{court?.name || 'Không rõ sân'}</Text>
                        </VStack>

                        {/* Thông tin ngày và giờ */}
                        <VStack className="space-y-2">
                            <Box className="flex-row items-center gap-2 m-1">
                                <AntDesign name="calendar" size={16} color="black"/>
                                <Text
                                    className="text-sm">{startDate && !isNaN(startDate.getTime()) ? format(startDate, 'dd/MM/yyyy') : 'N/A'}</Text>
                            </Box>
                            <Box className="flex-row items-center gap-2 m-1">
                                <AntDesign name="clock-circle" size={16} color="black"/>
                                <Text
                                    className="text-sm">{startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) ? `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}` : 'N/A'}</Text>
                            </Box>
                        </VStack>

                        {/* Trạng thái và Giá */}
                        <View className="flex-row justify-between items-center pt-2">
                            <View className="flex-row items-center gap-2">
                                <Box
                                    style={[styles.statusDot, {backgroundColor: statusColors[item.status] || '#e5e7eb'}]}/>
                                <Text
                                    style={[styles.statusText, {color: statusColors[item.status] || '#6b7280'}]}>{statusTranslations[item.status] || item.status}</Text>
                            </View>
                            <Text style={styles.priceText}>{item.price.toLocaleString('vi-VN')} ₫</Text>
                        </View>
                    </VStack>
                </Box>
            </Pressable>
        );
    };

    if (loading) {
        return <View style={styles.containerCenter}><ActivityIndicator size="large"/></View>;
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <FlatList
                    ListHeaderComponent={<Heading size="xl" className="p-4 font-bold">My Bookings</Heading>}
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContentContainer}
                    ListEmptyComponent={<View className="flex-1 justify-center items-center"><Text>Bạn chưa có lịch đặt
                        nào.</Text></View>}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                />
            </SafeAreaView>

            {selectedBooking && (
                <ActionSheet ref={actionSheetRef} gestureEnabled containerStyle={{paddingBottom: 20}}>{(() => {
                    const hasRated = selectedBooking.courts?.venue_id ? ratedVenueIds.has(selectedBooking.courts.venue_id) : false;
                    const canReview = ['paid', 'completed'].includes(selectedBooking.status);
                    const showQRCode = selectedBooking.status === 'checked_in';
                    console.log(`Booking ID :${selectedBooking.id}`)
                    return (
                        <VStack className="p-4 space-y-5 ">
                            {showQRCode && (
                                <>
                                    <Text className="text-lg gap-4 m-5">
                                        Sử dụng QR code để check in
                                    </Text>
                                    <View className="w-full items-center">
                                        <Box className="border-2">
                                            <QRCode quietZone={10} size={200} value={selectedBooking.id.toString()}/>
                                        </Box>
                                    </View>
                                </>
                            )}

                            <Pressable
                                disabled={!canReview || hasRated}
                                className={`flex-row items-center gap-4 m-5 ${(!canReview || hasRated) ? 'opacity-50' : ''}`}
                                onPress={handleReviewBooking}
                            >
                                <Feather name={hasRated ? "check-circle" : "star"} size={24}
                                         color={!canReview || hasRated ? 'gray' : 'black'}/>
                                <Text className={`text-lg ${!canReview || hasRated ? 'text-gray-500' : ''}`}>
                                    {hasRated ? "Bạn đã đánh giá sân này" : "Đánh giá"}
                                </Text>
                            </Pressable>


                            <Pressable
                                disabled={['cancelled', 'refund_requested'].includes(selectedBooking.status)}
                                className={`flex-row items-center gap-4 m-5 ${['cancelled', 'refund_requested'].includes(selectedBooking.status) ? 'opacity-50' : ''}`}
                                onPress={() => {
                                    if (['cancelled', 'refund_requested'].includes(selectedBooking.status)) return;
                                    actionSheetRef.current?.hide();
                                    if (selectedBooking) handleCancelBooking(selectedBooking);
                                }}
                            >
                                <Feather name="trash-2" size={24}
                                         color={['cancelled', 'refund_requested'].includes(selectedBooking.status) ? 'gray' : 'red'}/>
                                <Text
                                    className={`text-lg ${['cancelled', 'refund_requested'].includes(selectedBooking.status) ? 'text-gray-500' : 'text-red-500'}`}>
                                    Hủy lịch
                                </Text>
                            </Pressable>
                        </VStack>
                    )
                        ;
                })()}</ActionSheet>
            )}

            <ActionSheet ref={reviewActionSheetRef} gestureEnabled containerStyle={{paddingBottom: 20}}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <VStack className="p-6 space-y-5 items-center">
                        <Heading>Đánh giá địa điểm</Heading>
                        <Text className="text-center text-gray-500">
                            {selectedBooking?.courts?.venues?.name || 'Địa điểm này'}
                        </Text>
                        <View className="flex-row space-x-2 py-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable key={star} onPress={() => setRating(star)}>
                                    {star <= rating ? (
                                        <AntDesign name="star" size={36} color="#facc15"/>
                                    ) : (
                                        <MaterialCommunityIcons name="star-outline" size={36} color="gray"/>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                        <TextInput
                            placeholder="Viết đánh giá của bạn (không bắt buộc)"
                            value={reviewContent}
                            onChangeText={setReviewContent}
                            multiline
                            style={styles.textInput}
                        />
                        <Pressable
                            disabled={isSubmittingReview}
                            onPress={handleSubmitReview}
                            className={`w-full p-3 rounded-lg ${isSubmittingReview ? 'bg-gray-400' : 'bg-primary-500'}`}>
                            <Text
                                className="text-white text-center font-bold text-lg">{isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}</Text>
                        </Pressable>
                    </VStack>
                </ScrollView>
            </ActionSheet>
        </>
    );
};
const styles = StyleSheet.create({
    QRcontainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#f9fafb', // bg-gray-50
    },
    containerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContentContainer: {
        padding: 16,
        gap: 20,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusText: {fontSize: 14, fontWeight: '500'},
    priceText: {fontSize: 18, fontWeight: 'bold', color: '#3b82f6'},
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'transparent',
    },
    fabCard: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    textInput: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: '#d1d5db', // gray-300
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top'
    }
});

export default BookingScreen;