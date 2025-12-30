import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/store/useAuthStore";
import { Tables } from "@/types/database.types";
import { supabase } from "@/utils/supabase";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View, ActivityIndicator } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from 'toastify-react-native';

type VenueRatingWithVenue = Tables<'venue_ratings'> & {
    venues: Pick<Tables<'venues'>, 'name'> | null
};

export default function Setting() {
    const { signOut, profile, session, setProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);

    // States for settings page
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    // States for editing profile
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // States for reviews
    const [userReviews, setUserReviews] = useState<VenueRatingWithVenue[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [selectedReview, setSelectedReview] = useState<VenueRatingWithVenue | null>(null);
    const [editingRating, setEditingRating] = useState(0);
    const [editingContent, setEditingContent] = useState('');
    const editReviewSheetRef = useRef<ActionSheetRef>(null);
    const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

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


    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setPhone(profile.phone || '');
            setAvatarUrl(profile.avatar_url || null);
        }
    }, [profile]);

    const handlePickAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatarUrl(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = async () => {
        if (!session?.user) {
            Toast.error("Không tìm thấy phiên đăng nhập.");
            return;
        }
        setLoading(true);

        let newAvatarPath: string | null = profile?.avatar_url || null;

        if (avatarUrl && avatarUrl.startsWith('file://')) {
            try {
                const response = await fetch(avatarUrl);
                const blob = await response.blob();
                const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
                    reader.onerror = (e) => reject(e);
                    reader.readAsArrayBuffer(blob);
                });
                const fileExt = avatarUrl.split('.').pop()?.toLowerCase() || 'jpg';
                const contentType = `image/${fileExt}`;
                const fileName = `${session.user.id}.${fileExt}`;
                const filePath = `avatar/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('Data').upload(filePath, arrayBuffer, {
                    cacheControl: '3600',
                    upsert: true,
                    contentType: contentType,
                });
                if (uploadError) console.log(uploadError) ;
                const { data: urlData } = supabase.storage.from('Data').getPublicUrl(filePath);
                newAvatarPath = `${urlData.publicUrl}?t=${new Date().getTime()}`;
            } catch (uploadError: any) {
                Toast.error(`Lỗi tải ảnh lên: ${uploadError.message}`);
                setLoading(false);
                return;
            }
        }

        const updates = {
            id: session.user.id,
            username,
            phone,
            avatar_url: newAvatarPath,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('profiles').upsert(updates).select().single();

        if (error) {
            Toast.error(`Lỗi cập nhật: ${error.message}`);
        } else if (data) {
            await setProfile(data);
            Toast.success("Hồ sơ của bạn đã được cập nhật.");
            setIsEditing(false);
        }
        setLoading(false);
    };

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


    if (isEditing) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <VStack space="lg" className="p-4">
                        <HStack className="justify-between items-center">
                            <Pressable onPress={() => setIsEditing(false)}>
                                <Feather name="arrow-left" size={24} color="black" />
                            </Pressable>
                            <Text className="text-xl font-bold">Chỉnh sửa hồ sơ</Text>
                            <Button variant="link" onPress={handleUpdateProfile} disabled={loading}>
                                {loading ? <ButtonSpinner /> : <ButtonText>Lưu</ButtonText>}
                            </Button>
                        </HStack>
                        <VStack space="xl" className="items-center pt-8">
                            <Pressable onPress={handlePickAvatar}>
                                <Avatar size="2xl">
                                    <AvatarFallbackText>{username.charAt(0).toUpperCase()}</AvatarFallbackText>
                                    {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
                                </Avatar>
                            </Pressable>
                        </VStack>
                        <VStack space="lg" className="pt-4">
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Email</FormControlLabelText></FormControlLabel>
                                <Input isReadOnly><InputField value={profile?.email || ""} /></Input>
                            </FormControl>
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Tên hiển thị</FormControlLabelText></FormControlLabel>
                                <Input><InputField value={username} onChangeText={setUsername} placeholder="Nhập tên của bạn" /></Input>
                            </FormControl>
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Số điện thoại</FormControlLabelText></FormControlLabel>
                                <Input><InputField value={phone} onChangeText={setPhone} placeholder="Nhập số điện thoại" keyboardType="phone-pad" /></Input>
                            </FormControl>
                        </VStack>
                    </VStack>
                </ScrollView>
            </SafeAreaView>
        );
    }

    const fallbackName = profile?.username?.charAt(0).toUpperCase() || 'A';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <VStack space="lg" className="p-4">
                    <Text className="text-xl font-bold text-typography-900">Tài khoản</Text>
                    <Pressable onPress={() => setIsEditing(true)}>
                        <HStack space="md" className="items-center bg-background-0 p-4 rounded-lg shadow-sm">
                            <Avatar size="lg">
                                <AvatarFallbackText>{fallbackName}</AvatarFallbackText>
                                {profile?.avatar_url && <AvatarImage source={{ uri: profile.avatar_url }} />}
                            </Avatar>
                            <VStack>
                                <Text className="text-lg font-bold">{profile?.username || 'Chưa có tên'}</Text>
                                <Text className="text-typography-500">{profile?.email || 'Chưa có email'}</Text>
                            </VStack>
                            <Box className="flex-1 items-end"><Feather name="chevron-right" size={24} color="black" /></Box>
                        </HStack>
                    </Pressable>
                    <Text className="text-xl font-bold text-typography-900 pt-4">Cài đặt</Text>
                    <VStack space="sm" className="bg-background-0 rounded-lg shadow-sm">
                        <HStack space="md" className="justify-between items-center p-4 border-b border-outline-100">
                            <HStack space="md" className="items-center"><Feather name="bell" size={24} color="black" /><Text className="text-base">Thông báo</Text></HStack>
                            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
                        </HStack>
                        <Pressable onPress={() => setIsReviewsExpanded(!isReviewsExpanded)}>
                            <HStack space="md" className="justify-between items-center p-4">
                                <HStack space="md" className="items-center"><Feather name="message-square" size={24} color="black" /><Text className="text-base">Bình luận</Text></HStack>
                                <Feather name={isReviewsExpanded ? "chevron-down" : "chevron-right"} size={24} color="black" />
                            </HStack>
                        </Pressable>
                        {isReviewsExpanded && (
                            <VStack className="p-4 pt-0">
                                {loadingReviews ? <ActivityIndicator /> : (
                                    userReviews.length > 0 ? userReviews.map(item => (
                                        <Box key={item.id} className="bg-gray-50 p-3 my-2 rounded-lg">
                                            <VStack>
                                                <Text className="font-bold text-base">{item.venues?.name || 'Địa điểm không xác định'}</Text>
                                                <HStack className="items-center my-1">
                                                    {[1, 2, 3, 4, 5].map(star => <AntDesign key={star} name="star" size={18} color={star <= item.rating ? '#facc15' : '#e5e7eb'} />)}
                                                </HStack>
                                                <Text className="text-gray-600">{item.content}</Text>
                                                <HStack className="justify-end mt-3 gap-3">
                                                    <Pressable onPress={() => handleEditReview(item)} className="p-1"><Feather name="edit" size={18} color="blue" /></Pressable>
                                                    <Pressable onPress={() => handleDeleteReview(item.id)} className="p-1"><Feather name="trash-2" size={18} color="red" /></Pressable>
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    )) : <Text className="text-center text-gray-500 py-4">Bạn chưa có đánh giá nào.</Text>
                                )}
                            </VStack>
                        )}
                    </VStack>
                    <Box className="pt-8"><Button action="negative" variant="solid" onPress={signOut}><ButtonText>Đăng xuất</ButtonText></Button></Box>
                </VStack>
            </ScrollView>
            <ActionSheet ref={editReviewSheetRef} gestureEnabled containerStyle={{ paddingBottom: 20 }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <VStack className="p-6 space-y-5 items-center">
                        <Text className="text-xl font-bold">Chỉnh sửa đánh giá</Text>
                        <Text className="text-center text-gray-500">{selectedReview?.venues?.name}</Text>
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
                        <TextInput placeholder="Viết đánh giá của bạn (không bắt buộc)" value={editingContent} onChangeText={setEditingContent} multiline style={styles.textInput} />
                        <Button onPress={handleSubmitReviewUpdate} disabled={loading} className="w-full">
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
        height: 100,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top'
    }
});