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
import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from 'toastify-react-native';

export default function Setting() {
    const { signOut, profile, session, setProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    // States for settings page
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    // States for editing profile
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                        <Pressable onPress={() => router.push('/resetPassword')}>
                            <HStack space="md" className="justify-between items-center p-4 border-b border-outline-100">
                                <HStack space="md" className="items-center"><Feather name="lock" size={24} color="black" /><Text className="text-base">Đổi mật khẩu</Text></HStack>
                                <Feather name="chevron-right" size={24} color="black" />
                            </HStack>
                        </Pressable>
                        <Pressable onPress={() => router.push('/review')}>
                            <HStack space="md" className="justify-between items-center p-4">
                                <HStack space="md" className="items-center"><Feather name="message-square" size={24} color="black" /><Text className="text-base">Đánh giá của tôi</Text></HStack>
                                <Feather name="chevron-right" size={24} color="black" />
                            </HStack>
                        </Pressable>
                    </VStack>
                    <Box className="pt-8"><Button action="negative" variant="solid" onPress={signOut}><ButtonText>Đăng xuất</ButtonText></Button></Box>
                </VStack>
            </ScrollView>
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
});