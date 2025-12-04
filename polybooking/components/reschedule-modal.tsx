import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Tables } from "@/types/database.types";
import { supabase } from "@/utils/supabase";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addHours, format, startOfDay } from "date-fns";
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from "react";
import { FlatList, Platform, Pressable, View } from "react-native";
import ToastManager, { Toast } from 'toastify-react-native'

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    courtId: number;
    currentBooking: Tables<'bookings'>;
    onReschedule: (newStartTime: Date, newEndTime: Date) => Promise<boolean>;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose, courtId, currentBooking, onReschedule }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);

    const bookingDurationHours = 1; // Giả sử mỗi booking là 1 giờ

    useEffect(() => {
        if (isOpen) {
            fetchAvailableSlots(selectedDate);
        }
    }, [selectedDate, isOpen]);

    const fetchAvailableSlots = async (date: Date) => {
        setLoading(true);
        setAvailableSlots([]);
        setSelectedSlot(null);

        const dayStart = startOfDay(date).toISOString();
        const dayEnd = startOfDay(addHours(date, 24)).toISOString();

        const { data, error } = await supabase
            .from('bookings')
            .select('during')
            .eq('court_id', courtId)
            .neq('id', currentBooking.id) // Loại trừ booking hiện tại
            .overlaps('during', `[${dayStart},${dayEnd})`);

        if (error) {
            Toast.error("Lỗi khi lấy khung giờ trống.");
            setLoading(false);
            return;
        }

        const bookedSlots = data.map(b => new Date((b.during as any as string).split(',')[0].substring(1)).getHours());

        const allSlots: Date[] = [];
        for (let i = 6; i < 22; i++) { // Giả sử sân hoạt động từ 6h -> 22h
            if (!bookedSlots.includes(i)) {
                const slotDate = new Date(date);
                slotDate.setHours(i, 0, 0, 0);
                allSlots.push(slotDate);
            }
        }
        setAvailableSlots(allSlots);
        setLoading(false);
    };

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleConfirmReschedule = async () => {
        if (!selectedSlot) {
            Toast.warn("Vui lòng chọn khung giờ mới.");
            return;
        }
        const newEndTime = addHours(selectedSlot, bookingDurationHours);
        const success = await onReschedule(selectedSlot, newEndTime);
        if (success) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading>Đổi lịch đặt sân</Heading>
                    <ModalCloseButton><AntDesign name="close" size={24} color="black" /></ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Button onPress={() => setShowDatePicker(true)}>
                        <ButtonText>Chọn ngày: {format(selectedDate, 'dd/MM/yyyy')}</ButtonText>
                    </Button>
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                    <Text>Chọn khung giờ trống:</Text>
                    <FlatList
                        data={availableSlots}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => setSelectedSlot(item)} style={{ flex: 1 / 3, margin: 4 }}>
                                <View style={{ padding: 12, backgroundColor: selectedSlot?.getTime() === item.getTime() ? '#3b82f6' : '#e5e7eb', borderRadius: 6, alignItems: 'center' }}>
                                    <Text style={{ color: selectedSlot?.getTime() === item.getTime() ? 'white' : 'black' }}>{format(item, 'HH:mm')}</Text>
                                </View>
                            </Pressable>
                        )}
                        keyExtractor={(item) => item.toISOString()}
                        ListEmptyComponent={<Text>Không có giờ trống trong ngày này.</Text>}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="outline" action="secondary" onPress={onClose} ><ButtonText>Hủy</ButtonText></Button>
                    <Button onPress={handleConfirmReschedule} disabled={!selectedSlot || loading}><ButtonText>Xác nhận</ButtonText></Button>
                </ModalFooter>
            </ModalContent>
            <ToastManager />
        </Modal>
    );
};

export default RescheduleModal;