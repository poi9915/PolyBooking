import { Database, Tables, Enums } from './database.types'; // Import file bạn vừa gửi

// Rút gọn tên Types từ Database
export type Venue = Tables<'venues'>;
export type Court = Tables<'courts'>;
export type Profile = Tables<'profiles'>;
export type Booking = Tables<'bookings'>;
export type Payment = Tables<'payments'>;

export type BookingStatus = Enums<'booking_status'>;
export type PayOSStatus = Enums<'payos_payment_status'>;

// Type cho Slot thời gian (Front-end only)
export type TimeSlot = {
    start: Date;
    end: Date;
};