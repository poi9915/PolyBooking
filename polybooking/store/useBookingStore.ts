import { create } from 'zustand';
import { Booking, Court } from '../types/store.type';
import { supabase } from '../utils/supabase';

interface BookingFlowState {
    // --- Selection State ---
    selectedCourt: Court | null;
    selectedDate: Date; // Ngày chọn (không có giờ)
    startTime: Date | null;
    endTime: Date | null;
    totalPrice: number;

    // --- Processing State ---
    isSubmitting: boolean;
    bookingResult: Booking | null;
    error: string | null;

    // --- Actions ---
    selectCourt: (court: Court) => void;
    setTimeSlot: (start: Date, end: Date) => void;
    resetFlow: () => void;

    // Create Booking Action
    createBooking: (userId: string) => Promise<boolean>;
}

export const useBookingStore = create<BookingFlowState>((set, get) => ({
    selectedCourt: null,
    selectedDate: new Date(),
    startTime: null,
    endTime: null,
    totalPrice: 0,
    isSubmitting: false,
    bookingResult: null,
    error: null,

    selectCourt: (court) => set((state) => ({
        selectedCourt: court,
        // Giữ nguyên startTime và endTime, chỉ reset totalPrice
        totalPrice: 0,
    })),

    setTimeSlot: (start, end) => {
        const { selectedCourt } = get();
        if (!selectedCourt) return;

        // Tính tiền logic đơn giản (Duration * PricePerHour)
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const price = durationHours * selectedCourt.default_price_per_hour;

        set({
            startTime: start,
            endTime: end,
            totalPrice: price
        });
    },

    createBooking: async (userId) => {
        const { selectedCourt, startTime, endTime, totalPrice } = get();

        if (!selectedCourt || !startTime || !endTime) {
            set({ error: "Vui lòng chọn đầy đủ thông tin sân và giờ." });
            return false;
        }

        set({ isSubmitting: true, error: null });

        // Format Range cho Postgres: [start, end)
        // Lưu ý: Cần convert sang ISO string cẩn thận
        const tstzrange = `[${startTime.toISOString()},${endTime.toISOString()})`;

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    user_id: userId,
                    court_id: selectedCourt.id,
                    during: tstzrange as unknown, // Ép kiểu vì Type Gen tạo ra là 'unknown' cho range
                    price: totalPrice,
                    status: 'pending',
                    // expires_at sẽ được default bởi DB (now + 15p), nhưng nếu cần custom thì thêm vào đây
                })
                .select() // Để lấy về record vừa tạo (bao gồm ID)
                .single();

            if (error) throw error;

            set({ bookingResult: data });
            return true;

        } catch (err: any) {
            console.error(err);
            set({ error: err.message || "Lỗi tạo booking" });
            return false;
        } finally {
            set({ isSubmitting: false });
        }
    },

    resetFlow: () => set({
        selectedCourt: null,
        startTime: null,
        endTime: null,
        totalPrice: 0,
        bookingResult: null,
        error: null
    })
}));