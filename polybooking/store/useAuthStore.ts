import {Profile} from '@/types/store.type';
import {Session} from '@supabase/supabase-js';
import {router} from 'expo-router';
import {create} from 'zustand';
import {supabase} from '../utils/supabase'; // Đường dẫn tới file khởi tạo supabase client

interface AuthState {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;

    // Actions
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
    setProfile: (profile: Profile) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    profile: null,
    loading: true,

    initialize: async () => {
        try {
            // 1. Lấy session hiện tại
            const {data: {session}} = await supabase.auth.getSession();
            set({session});

            if (session?.user) {
                // 2. Fetch thông tin Profile từ bảng 'profiles'
                const {data: profile} = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({profile});
                console.log(`fetch profile : ${JSON.stringify(profile)}`);

            }

            // 3. Lắng nghe thay đổi auth state
            supabase.auth.onAuthStateChange(async (_event, session) => {
                set({session});
                if (session?.user) {
                    const {data: profile} = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    set({profile});
                } else {
                    set({profile: null});
                }
            });

        } catch (error) {
            console.error('Auth init error:', error);
        } finally {
            set({loading: false});
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        router.navigate('/login')
        set({session: null, profile: null});
    },

    setProfile: async (profile) => {
        // 1. Cập nhật state cục bộ ngay lập tức để UI phản hồi nhanh
        set({profile});

        // 2. Đồng bộ các thông tin có thể cập nhật lên Supabase Auth user
        // Điều này hữu ích để giữ cho `session.user` luôn được cập nhật.
        try {
            const {data, error} = await supabase.auth.updateUser({
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