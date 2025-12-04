import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from '@/components/ui/hstack';
import { CalendarDaysIcon, CircleIcon, ClockIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from "@/components/ui/radio";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useVenueStore } from "@/store/useVenueStore";
import { Court } from "@/types/store.type";
import { supabase } from "@/utils/supabase";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';

// Các mốc thời gian cho slider (tính bằng phút)
const DURATION_STEPS = [60, 90, 120, 150, 180];

export default function BookingScreen() {
    const router = useRouter();
    const { id: venueId } = useLocalSearchParams();

    // State cho UI
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [durationIndex, setDurationIndex] = useState(0); // Index của DURATION_STEPS
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [bookedCourtIds, setBookedCourtIds] = useState<number[]>([]);

    // Lấy state và actions từ stores
    const { session } = useAuthStore();
    const { activeVenue, courts, fetchVenueById, fetchCourts } = useVenueStore();
    const {
        selectedCourt,
        selectedDate,
        startTime,
        endTime,
        totalPrice,
        selectCourt,
        setTimeSlot,
        resetFlow
    } = useBookingStore();

    // Fetch danh sách sân con khi vào màn hình
    useEffect(() => {
        if (venueId) {
            fetchVenueById(Number(venueId));
            fetchCourts(Number(venueId));
        }
        // Reset flow khi vào màn hình để đảm bảo dữ liệu sạch
        return () => {
            resetFlow();
        }
    }, [venueId]);

    // Cập nhật giá tiền, thời gian kết thúc và kiểm tra các sân đã được đặt
    useEffect(() => {
        const fetchBookedCourts = async () => {
            // Nếu chưa có giờ bắt đầu hoặc danh sách sân, reset và thoát
            if (!startTime || !courts || courts.length === 0) {
                setBookedCourtIds([]);
                return;
            }

            // 1. Tính toán endTime mới
            const durationMinutes = DURATION_STEPS[durationIndex];
            const newEndTime = new Date(startTime.getTime() + durationMinutes * 60000);

            // 2. Cập nhật time slot trong store (bao gồm cả tính toán giá)
            setTimeSlot(startTime, newEndTime);

            // 3. Fetch các sân đã được đặt trong khoảng thời gian mới
            const courtIds = courts.map(c => c.id);
            const startTimeISO = startTime.toISOString();
            const endTimeISO = newEndTime.toISOString();

            const bookedStatuses = ['pending', 'confirmed', 'paid'];

            const { data, error } = await supabase
                .from('bookings')
                .select('court_id')
                .in('court_id', courtIds)
                .in('status', bookedStatuses)
                .overlaps('during', `[${startTimeISO},${endTimeISO})`);
            if (error) {
                console.error('Error fetching booked courts:', error);
                setBookedCourtIds([]);
            } else {
                setBookedCourtIds(data.map(b => b.court_id));
            }
        };
        fetchBookedCourts();
    }, [startTime, durationIndex, courts, selectedCourt]); // Chạy lại khi giờ bắt đầu, thời lượng, hoặc sân thay đổi

    const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            // Cập nhật ngày trong store (hoặc state cục bộ)
            // Ở đây ta giả định startTime sẽ được set lại khi ngày thay đổi
            const newStartTime = new Date(date);
            if (startTime) { // Giữ lại giờ và phút đã chọn
                newStartTime.setHours(startTime.getHours());
                newStartTime.setMinutes(startTime.getMinutes());
            }
            useBookingStore.setState({ selectedDate: date, startTime: newStartTime });
        }
    };

    const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowTimePicker(false);
        if (date) {
            useBookingStore.setState({ startTime: date });
        }
    };

    const handleDurationChange = (value: number) => {
        setDurationIndex(value);
    };

    const handleSelectCourt = (court: Court) => {
        selectCourt(court);
    };

    const handlePayment = async () => {
        if (!selectedCourt || !startTime || !endTime || !session) {
            alert("Vui lòng chọn đầy đủ thông tin và đăng nhập để tiếp tục.");
            console.log(`Court : ${selectCourt} ,\n Start Time ${startTime} , \nEnd Time ${endTime} , \nSession ${session}`);

            return;
        }

        try {
            console.log("Invoking 'create-payment-link' function...");
            const { data, error } = await supabase.functions.invoke('payos-gen-link', {
                body: {
                    court: selectedCourt,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    totalPrice: totalPrice,
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) throw error;

            if (data.checkoutUrl) {
                console.log("Received checkoutUrl:", data.checkoutUrl);
                setPaymentUrl(data.checkoutUrl); // Mở WebView
            } else {
                throw new Error("Không nhận được URL thanh toán từ server.");
            }

        } catch (err: any) {
            console.error("Error creating payment link:", err);
            alert(`Lỗi khi tạo link thanh toán: ${err.message}`);
        }
    };

    // Lắng nghe deep link để xử lý khi quay lại từ app thanh toán
    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const { url } = event;
            if (url.includes('success')) {
                setPaymentUrl(null); // Đóng WebView
                router.replace('/success');
            } else if (url.includes('failed') || url.includes('cancel=true')) {
                setPaymentUrl(null); // Đóng WebView
                router.replace('/failed');
            }
        };

        // Lắng nghe các deep link khi app đang mở
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Gỡ bỏ listener khi component bị unmount
        return () => {
            subscription.remove();
        };
    }, [router]);


    // Nếu có paymentUrl, render WebView để thanh toán
    if (paymentUrl) {
        return (
            <SafeAreaView style={styles.container}>
                <WebView
                    originWhitelist={['*', 'polybooking://*']}
                    source={{ uri: paymentUrl }}
                    onShouldStartLoadWithRequest={(event) => {
                        const { url } = event;
                        console.log('WebView is trying to load:', url);

                        // Kiểm tra nếu URL là deep link 
                        if (url.startsWith('polybooking://')) {
                            if (url.includes('success')) {
                                setPaymentUrl(null);
                                router.replace('/success');
                            } else if (url.includes('failed') || url.includes('cancel=true')) {
                                setPaymentUrl(null);
                                router.replace('/failed');
                            }
                            return false; // Ngăn WebView cố gắng tải URL này
                        }

                        // Cho phép tải các URL khác (http, https)
                        return true;
                    }}
                />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <VStack space="lg" className="p-4">
                    <Heading>Đặt sân</Heading>

                    {/* Card for Venue Info */}
                    {activeVenue && (
                        <Card className="shadow-md rounded-lg overflow-hidden" style={styles.fabCardItem}>
                            <Box className="h-24">
                                <Image
                                    style={{ flex: 1 }}
                                    source={{ uri: activeVenue.images?.[0] || 'https://via.placeholder.com/400x150' }}
                                    className="absolute w-full h-full"
                                    contentFit="cover"
                                    alt={activeVenue.name}
                                />
                                <Box className="absolute inset-0 bg-black/40" />
                                <VStack className="absolute bottom-0 left-0 p-6">
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }} size="xs">Địa
                                        điểm</Text>
                                    <Heading style={{ color: 'white', fontWeight: 'bold' }}
                                        size="md">{activeVenue.name}</Heading>
                                </VStack>
                            </Box>
                        </Card>
                    )}

                    {/* Card 1: Chọn ngày và giờ */}
                    <Card className="p-4 shadow-md" style={styles.fabCardItem}>
                        <VStack space="md">
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Chọn
                                    ngày</FormControlLabelText></FormControlLabel>
                                <Pressable onPress={() => setShowDatePicker(true)}>
                                    <Input isReadOnly pointerEvents="none">
                                        <InputField value={selectedDate.toLocaleDateString('vi-VN')} />
                                        <InputSlot><InputIcon as={CalendarDaysIcon} className="mr-2" /></InputSlot>
                                    </Input>
                                </Pressable>
                            </FormControl>
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Giờ bắt
                                    đầu</FormControlLabelText></FormControlLabel>
                                <Pressable onPress={() => setShowTimePicker(true)}>
                                    <Input isReadOnly pointerEvents="none">
                                        <InputField value={startTime ? startTime.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'Chọn giờ'} />
                                        <InputSlot><InputIcon as={ClockIcon} className="mr-2" /></InputSlot>
                                    </Input>
                                </Pressable>
                            </FormControl>
                        </VStack>
                    </Card>

                    {/* Card 2: Chọn thời lượng */}
                    <Card className="p-4 shadow-md" style={styles.fabCardItem}>
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>{`Thời lượng: ${DURATION_STEPS[durationIndex] / 60} giờ`}</FormControlLabelText>
                            </FormControlLabel>
                            <VStack space="sm" className="items-center pt-2">
                                <Slider
                                    value={durationIndex}
                                    minValue={0}
                                    maxValue={DURATION_STEPS.length - 1}
                                    step={1}
                                    onChange={handleDurationChange}
                                    className="w-[90%]"
                                >
                                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                                    <SliderThumb />
                                </Slider>
                                <HStack className="w-[90%] justify-between">
                                    {DURATION_STEPS.map((duration) => (
                                        <Text key={duration} size="xs">
                                            {duration / 60}h
                                        </Text>
                                    ))}
                                </HStack>
                            </VStack>
                        </FormControl>
                    </Card>

                    {/* Card 3: Chọn sân con */}
                    <Card className="p-4 shadow-md" style={styles.fabCardItem}>
                        <FormControl>
                            <FormControlLabel><FormControlLabelText>Chọn sân</FormControlLabelText></FormControlLabel>
                            <RadioGroup value={selectedCourt?.id.toString()} onChange={(id) => {
                                const court = courts.find(c => c.id.toString() === id);
                                if (court) handleSelectCourt(court);
                            }}>
                                <VStack space="md" className="pt-2">
                                    {courts.map(court => (
                                        <Card key={court.id} className={`p-3 shadow-sm ${bookedCourtIds.includes(court.id) ? 'bg-gray-200' : 'bg-gray-50'}`}>
                                            <Radio
                                                value={court.id.toString()}
                                                size="md"
                                                isDisabled={bookedCourtIds.includes(court.id)}
                                            >
                                                <RadioIndicator><RadioIcon as={CircleIcon} /></RadioIndicator>
                                                <RadioLabel className={`${bookedCourtIds.includes(court.id) ? 'text-gray-400' : ''}`}>{court.name} - {court.default_price_per_hour.toLocaleString('vi-VN')}đ/h</RadioLabel>
                                                {bookedCourtIds.includes(court.id) && <Text size="xs" className="text-red-500 ml-10 -mt-1">Đã được đặt</Text>}
                                            </Radio>
                                        </Card>
                                    ))}
                                </VStack>
                            </RadioGroup>
                        </FormControl>
                    </Card>
                </VStack>
            </ScrollView>

            {/* Dialog chọn ngày/giờ */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            {showTimePicker && (
                <DateTimePicker
                    value={startTime || new Date()}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            {/* FAB Section: Tổng tiền và nút bấm */}
            <View style={styles.fabContainer}>
                <Card style={styles.fabCard}>
                    <View style={styles.priceContainer}>
                        <Text>Tổng tiền:</Text>
                        <Text size="xl" bold>{totalPrice.toLocaleString('vi-VN')}đ</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                        <Button variant="outline" action="secondary" onPress={() => router.back()} style={{ flex: 1 }}>
                            <ButtonText>Huỷ bỏ</ButtonText>
                        </Button>
                        <Button onPress={handlePayment} style={{ flex: 1 }}>
                            <ButtonText>Thanh Toán</ButtonText>
                        </Button>
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    scrollContent: { paddingBottom: 150 }, // Thêm padding để nội dung không bị FAB che
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
    },
    fabCardItem: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 16,
    }
});