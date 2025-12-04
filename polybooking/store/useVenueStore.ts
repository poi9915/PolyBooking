import { create } from 'zustand';
import { Court, Venue } from '../types/store.type';
import { supabase } from '../utils/supabase';

export interface VenueState {
    venues: Venue[];
    activeVenue: Venue | null;
    courts: Court[]; // Danh sách sân con của activeVenue
    loading: boolean;

    fetchVenues: () => Promise<void>;
    setActiveVenue: (venue: Venue) => void;
    fetchVenueById: (venueId: number) => Promise<void>;
    fetchCourts: (venueId: number) => Promise<void>;
}

export const useVenueStore = create<VenueState>()((set) => ({
    venues: [],
    activeVenue: null,
    courts: [],
    loading: false,

    fetchVenues: async () => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('is_active', true) // Chỉ lấy sân đang hoạt động
            .order('id');

        if (!error && data) {
            set({ venues: data });
        }
        set({ loading: false });
    },

    setActiveVenue: (venue) => {
        set({ activeVenue: venue, courts: [] }); // Reset courts khi đổi venue
    },

    fetchVenueById: async (venueId) => {
        set({ loading: true, activeVenue: null, courts: [] });
        try {
            const { data, error } = await supabase
                .from('venues')
                .select(`
                    *,
                    courts ( * )
                `)
                .eq('id', venueId)
                .single();

            if (error) throw error;

            set({ activeVenue: data, courts: data.courts || [] });
        } finally {
            set({ loading: false });
        }
    },

    fetchCourts: async (venueId) => {
        set({ loading: true });
        const { data, error } = await supabase
            .from('courts')
            .select('*')
            .eq('venue_id', venueId)
            .eq('is_active', true);

        if (!error && data) {
            set({ courts: data });
        }
        set({ loading: false });
    }
}));