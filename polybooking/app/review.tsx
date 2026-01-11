import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/useAuthStore";
import { Tables } from "@/types/database.types";
import { supabase } from "@/utils/supabase";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View, ActivityIndicator } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from 'toastify-react-native';

type VenueRatingWithVenue = Tables<'venue_ratings'> & {
    venues: Pick<Tables<'venues'>, 'name'> | null
};

export default function ReviewScreen() {
    const router = useRouter();
    const { profile } = useAuthStore();
    
    // States for reviews
    const [userReviews, setUserReviews] = useState<VenueRatingWithVenue[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [selectedReview, setSelectedReview] = useState<VenueRatingWithVenue | null>(null);
    const [editingRating, setEditingRating] = useState(0);
    const [editingContent, setEditingContent] = useState('');
    const [loading, setLoading] = useState(false);
    const editReviewSheetRef = useRef<ActionSheetRef>(null);

    const fetchUserReviews = async () => {
        if (!profile) return;
        setLoadingReviews(true);
        try {
            const { data, error } = await supabase
                .from('venue_ratings')
                .select(`*, venues(name)`)
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setUserReviews(data as VenueRatingWithVenue[]);
        } catch (error: any) {
            Toast.error(`Lỗi tải đánh giá: ${error.message}`);
        } finally {
            setLoadingReviews(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserReviews();
        }, [profile])
    );

    const handleEditReview = (review: VenueRatingWithVenue) => {
        setSelectedReview(review);
        setEditingRating(review.rating);
        setEditingContent(review.content || '');
        editReviewSheetRef.current?.show();
    };

    const handleDeleteReview = (reviewId: number) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa đánh giá này không?",
            [
                { text: "Hủy" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        const { error } = await supabase.from('venue_ratings').delete().eq('id', reviewId);
                        if (error) {
                            Toast.error(`Lỗi xóa đánh giá: ${error.message}`);
                        } else {
                            Toast.success("Đã xóa đánh giá.");
                            fetchUserReviews(); // Tải lại danh sách
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleSubmitReviewUpdate = async () => {
        if (!selectedReview) return;
        setLoading(true);
        const { error } = await supabase
            .from('venue_ratings')
            .update({ rating: editingRating, content: editingContent })
            .eq('id', selectedReview.id);

        if (error) {
            Toast.error(`Lỗi cập nhật đánh giá: ${error.message}`);
        } else {
            Toast.success("Đã cập nhật đánh giá.");
            editReviewSheetRef.current?.hide();
            fetchUserReviews();
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <VStack space="md" className="p-4 border-b border-gray-200 bg-white">
                <HStack className="items-center space-x-4">
                    <Pressable onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="black" />
                    </Pressable>
                    <Text className="text-xl font-bold">Đánh giá của tôi</Text>
                </HStack>
            </VStack>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <VStack className="p-4">
                    {loadingReviews ? <ActivityIndicator size="large" color="#0000ff" /> : (
                        userReviews.length > 0 ? userReviews.map(item => (
                            <Box key={item.id} className="bg-white p-4 my-2 rounded-lg shadow-sm border border-gray-100">
                                <VStack>
                                    <Text className="font-bold text-lg">{item.venues?.name || 'Địa điểm không xác định'}</Text>
                                    <HStack className="items-center my-2">
                                        {[1, 2, 3, 4, 5].map(star => <AntDesign key={star} name="star" size={18} color={star <= item.rating ? '#facc15' : '#e5e7eb'} />)}
                                    </HStack>
                                    <Text className="text-gray-600 text-base">{item.content}</Text>
                                    <HStack className="justify-end mt-4 gap-4">
                                        <Pressable onPress={() => handleEditReview(item)} className="p-2 bg-blue-50 rounded-full">
                                            <Feather name="edit" size={20} color="blue" />
                                        </Pressable>
                                        <Pressable onPress={() => handleDeleteReview(item.id)} className="p-2 bg-red-50 rounded-full">
                                            <Feather name="trash-2" size={20} color="red" />
                                        </Pressable>
                                    </HStack>
                                </VStack>
                            </Box>
                        )) : <Text className="text-center text-gray-500 py-10 text-lg">Bạn chưa có đánh giá nào.</Text>
                    )}
                </VStack>
            </ScrollView>

            <ActionSheet ref={editReviewSheetRef} gestureEnabled containerStyle={{ paddingBottom: 20 }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <VStack className="p-6 space-y-5 items-center">
                        <Text className="text-xl font-bold">Chỉnh sửa đánh giá</Text>
                        <Text className="text-center text-gray-500 text-lg">{selectedReview?.venues?.name}</Text>
                        <View className="flex-row space-x-2 py-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Pressable key={star} onPress={() => setEditingRating(star)}>
                                    {star <= editingRating ? (
                                        <AntDesign name="star" size={36} color="#facc15" />
                                    ) : (
                                        <MaterialCommunityIcons name="star-outline" size={36} color="gray" />
                                    )}
                                </Pressable>
                            ))}
                        </View>
                        <TextInput 
                            placeholder="Viết đánh giá của bạn (không bắt buộc)" 
                            value={editingContent} 
                            onChangeText={setEditingContent} 
                            multiline 
                            style={styles.textInput} 
                        />
                        <Button onPress={handleSubmitReviewUpdate} disabled={loading} className="w-full mt-4">
                            {loading ? <ButtonSpinner /> : <ButtonText>Lưu thay đổi</ButtonText>}
                        </Button>
                    </VStack>
                </ScrollView>
            </ActionSheet>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    textInput: {
        width: '100%',
        height: 120,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        textAlignVertical: 'top',
        fontSize: 16,
    }
});