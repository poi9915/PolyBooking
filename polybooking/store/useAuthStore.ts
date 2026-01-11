import { Profile } from '@/types/store.type';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { create } from 'zustand';
import { supabase } from '../utils/supabase'; // Đường dẫn tới file khởi tạo supabase client

interface AuthState {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;

    // Actions
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    setProfile: (profile: Profile) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    profile: null,
    loading: true,

    signIn: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (!data.user) throw new Error("Không tìm thấy thông tin người dùng sau khi đăng nhập.");

            // Sau khi đăng nhập thành công, fetch profile để kiểm tra status
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) throw profileError;

            if (profile && profile.status === false) {
                Toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
                //await supabase.auth.signOut(); // Đăng xuất ngay lập tức
                return false; // Báo hiệu đăng nhập thất bại
            }

            // Đăng nhập thành công và tài khoản hợp lệ
            set({ session: data.session, profile });
            Toast.success("Đăng nhập thành công");
            router.replace('/(tabs)/home');
            return true;

        } catch (error: any) {
            console.log("Lỗi đăng nhập:", error.message);
            Toast.error(error.message || "Email hoặc mật khẩu không chính xác.");
            return false;
        }
    },

    initialize: async () => {
        // Lắng nghe thay đổi auth state (chủ yếu cho logout và kiểm tra session ban đầu)
        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (_event === 'SIGNED_IN') return; // Bỏ qua sự kiện SIGNED_IN vì đã xử lý ở hàm signIn

            if (_event === 'SIGNED_OUT') {
                set({ session: null, profile: null });
                router.replace('/login');
                return;
            }

            // Xử lý khi app khởi động và đã có session từ trước
            try {
                if (session?.user && !get().profile) {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                    set({ session, profile });
                    router.replace('/(tabs)/home');
                } else if (!session) {
                    router.replace('/login');
                }
            } catch (err) {
                console.log(err)
            }

        });

        try {
            // Lấy session ban đầu để xác định trạng thái
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (!initialSession) {
                router.replace('/login');
            }
        } catch (error) {
            console.error('Auth init error:', error);
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        // onAuthStateChange sẽ tự động xử lý việc dọn dẹp state và điều hướng
        set({ session: null, profile: null });
    },

    setProfile: async (profile) => {
        // 1. Cập nhật state cục bộ ngay lập tức để UI phản hồi nhanh
        set({ profile });

        // 2. Đồng bộ các thông tin có thể cập nhật lên Supabase Auth user
        // Điều này hữu ích để giữ cho `session.user` luôn được cập nhật.
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                }
            });

            if (error) throw error;
        } catch (error) {
            console.error("Lỗi khi đồng bộ profile với Supabase Auth:", error);
        }
    }
}));