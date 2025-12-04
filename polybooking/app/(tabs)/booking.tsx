import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/store/useAuthStore';
import { Tables } from '@/types/database.types';
import { supabase } from '@/utils/supabase';
import { AntDesign, Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";

// Mở rộng type Booking để bao gồm thông tin từ court và venue
type BookingWithDetails = Tables<'bookings'> & {
    courts: {
        name: string;
        venues: {
            name: string;
            images: string[] | null;
        } | null;
    } | null;
};

// Bảng màu cho các trạng thái, sử dụng hex-code để tương thích với StyleSheet
const statusColors: Record<string, string> = {
    pending: '#facc15', // yellow-400
    confirmed: '#3b82f6', // blue-500
    paid: '#22c55e', // green-500
    cancelled: '#ef4444', // red-500
    refund_requested: '#F97316FF', // orange-500
    completed: '#9ca3af', // gray-400
};

const statusTranslations: Record<string, string> = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    paid: 'Đã thanh toán',
    cancelled: 'Đã hủy',
    refund_requested: 'Yêu cầu hoàn tiền',
    completed: 'Đã hoàn thành',
};

const BookingScreen = () => {
    const { profile } = useAuthStore();
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
    const actionSheetRef = useRef<ActionSheetRef>(null);

    const fetchBookings = async () => {
        if (!profile) return;
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          courts (
            name,
            venues (
              name,
              images
            )
          )
        `)
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data as BookingWithDetails[]);
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
            `Bạn có chắc chắn muốn hủy lịch đặt này? Trạng thái sẽ được chuyển thành "${newStatus}".`,
            [
                { text: "Không" },
                {
                    text: "Có, hủy",
                    onPress: async () => {
                        const { error } = await supabase
                            .from('bookings')
                            .update({ status: newStatus })
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
        // Logic for reviewing a booking will go here
        actionSheetRef.current?.hide();
        Alert.alert("Thông báo", "Chức năng đánh giá đang được phát triển.");
    }


    const renderBookingItem = ({ item }: { item: BookingWithDetails }) => {
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
            <Pressable onPress={() => handleOpenActionSheet(item)} >
                <Box className="bg-background-0 rounded-lg overflow-hidden shadow-lg" style={styles.fabCard}>
                    <Image source={{ uri: imageUrl }} style={styles.cardImage} />
                    <VStack className="p-4 space-y-3">
                        {/* Tên địa điểm và sân */}
                        <VStack>
                            <Text className="text-lg font-bold text-typography-900">{venue?.name || 'Không rõ địa điểm'}</Text>
                            <Text className="text-sm text-typography-500">{court?.name || 'Không rõ sân'}</Text>
                        </VStack>

                        {/* Thông tin ngày và giờ */}
                        <VStack className="space-y-2">
                            <Box className="flex-row items-center gap-2 m-1">
                                <AntDesign name="calendar" size={16} color="black" />
                                <Text className="text-sm">{startDate && !isNaN(startDate.getTime()) ? format(startDate, 'dd/MM/yyyy') : 'N/A'}</Text>
                            </Box>
                            <Box className="flex-row items-center gap-2 m-1">
                                <AntDesign name="clock-circle" size={16} color="black" />
                                <Text className="text-sm">{startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) ? `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}` : 'N/A'}</Text>
                            </Box>
                        </VStack>

                        {/* Trạng thái và Giá */}
                        <View className="flex-row justify-between items-center pt-2">
                            <View className="flex-row items-center gap-2">
                                <Box style={[styles.statusDot, { backgroundColor: statusColors[item.status] || '#e5e7eb' }]} />
                                <Text style={[styles.statusText, { color: statusColors[item.status] || '#6b7280' }]}>{statusTranslations[item.status] || item.status}</Text>
                            </View>
                            <Text style={styles.priceText}>{item.price.toLocaleString('vi-VN')} ₫</Text>
                        </View>
                    </VStack>
                </Box>
            </Pressable>
        );
    };

    if (loading) {
        return <View style={styles.containerCenter}><ActivityIndicator size="large" /></View>;
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
                    ListEmptyComponent={<View className="flex-1 justify-center items-center"><Text>Bạn chưa có lịch đặt nào.</Text></View>}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            </SafeAreaView>

            <ActionSheet ref={actionSheetRef} gestureEnabled containerStyle={{ paddingBottom: 20 }}>
                <VStack className="p-4 space-y-5 ">
                    <Pressable
                        className="flex-row items-center gap-4 m-5"
                        onPress={handleReviewBooking}
                    >
                        <Feather name="star" size={24} color="black" />
                        <Text className="text-lg">Đánh giá</Text>
                    </Pressable>
                    <Pressable
                        className="flex-row items-center gap-4 m-5"
                        onPress={() => {
                            actionSheetRef.current?.hide();
                            if (selectedBooking) handleCancelBooking(selectedBooking);
                        }}
                    >
                        <Feather name="trash-2" size={24} color="red" />
                        <Text className="text-lg text-red-500">Hủy lịch</Text>
                    </Pressable>
                </VStack>
            </ActionSheet>
        </>
    );
};

const styles = StyleSheet.create({
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
    statusText: { fontSize: 14, fontWeight: '500' },
    priceText: { fontSize: 18, fontWeight: 'bold', color: '#3b82f6' },
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
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    }
});

export default BookingScreen;