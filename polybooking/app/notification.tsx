import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuthStore } from '@/store/useAuthStore';
import { Json, Tables } from '@/types/database.types';
import { supabase } from '@/utils/supabase';
import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Notification = Tables<'notifications'>;

export default function NotificationScreen() {
    const router = useRouter();
    const { profile } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        if (!profile) return;
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data);
        } catch (error: any) {
            Alert.alert('Lỗi', `Không thể tải thông báo: ${error.message}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchNotifications();
        }, [profile])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications();
    }, [profile]);

    const handleMarkAsRead = async (notification: Notification) => {
        if (notification.is_read) return; // Không cần cập nhật nếu đã đọc

        // Cập nhật UI ngay lập tức để có trải nghiệm tốt hơn
        setNotifications(prev =>
            prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
        );

        // Cập nhật trên server
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notification.id);

        if (error) {
            // Nếu lỗi, hoàn tác lại thay đổi trên UI
            setNotifications(prev =>
                prev.map(n => (n.id === notification.id ? { ...n, is_read: false } : n))
            );
            Alert.alert('Lỗi', 'Không thể đánh dấu đã đọc.');
        }
    };

    // Component để render payload một cách thân thiện
    const NotificationPayload = ({ payload, isRead }: { payload: Json | null, isRead: boolean | null }) => {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            return <Text className={`${isRead ? 'text-gray-500' : 'text-gray-700'}`}>{String(payload)}</Text>;
        }

        // Hàm chuyển đổi key (vd: venue_name -> Venue Name)
        const formatKey = (key: string) => {
            return key
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        // Hàm định dạng giá trị (đặc biệt cho tiền tệ)
        const formatValue = (key: string, value: any) => {
            if ((key.includes('amount') || key.includes('price')) && typeof value === 'number') {
                return `${value.toLocaleString('vi-VN')} VND`;
            }
            return value.toString();
        };

        return (
            <VStack space="xs" className="mt-1">
                {Object.entries(payload).map(([key, value]) => {
                    if (value === undefined || value === null) return null;
                    return (
                        <HStack key={key} space="sm" className="items-start">
                            <Text className={`w-28 font-medium ${isRead ? 'text-gray-500' : 'text-gray-600'}`}>{formatKey(key)}:</Text>
                            <Text className={`flex-1 ${isRead ? 'text-gray-600' : 'text-gray-800'}`}>{formatValue(key, value)}</Text>
                        </HStack>
                    );
                })}
            </VStack>
        );
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        const isRead = item.is_read;
        const timeAgo = item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: vi }) : '';

        return (
            <Pressable onPress={() => handleMarkAsRead(item)}>
                <Box className={`p-4 rounded-lg flex-row items-center gap-4 ${isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
                    <Box className={`w-2 h-2 rounded-full ${isRead ? 'bg-transparent' : 'bg-blue-500'}`} />
                    <VStack className="flex-1">
                        <Text className={`font-bold ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>{item.type}</Text>
                        <NotificationPayload payload={item.payload} isRead={isRead} />
                        <Text className="text-xs text-gray-400 mt-1">{timeAgo}</Text>
                    </VStack>
                </Box>
            </Pressable>
        );
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View className="flex-row items-center p-4">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Feather name="arrow-left" size={24} color="black" />
                </Pressable>
                <Heading size="xl" className="font-bold ml-4">Thông báo</Heading>
            </View>
            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<View style={styles.center}><Text>Bạn không có thông báo nào.</Text></View>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingHorizontal: 16, gap: 12, paddingBottom: 20 },
});