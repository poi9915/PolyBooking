import {Box} from '@/components/ui/box';
import {Card} from '@/components/ui/card';
import {Heading} from '@/components/ui/heading';
import {Image} from '@/components/ui/image';
import {Text} from '@/components/ui/text';
import {VStack} from '@/components/ui/vstack';
import {Venue} from '@/types/store.type';
import {Pressable, StyleSheet} from 'react-native';
import {StarRatingDisplay} from 'react-native-star-rating-widget';

interface ItemCardProps {
    item: Venue;
    onPress: (item: Venue) => void;
}

export default function ItemCard({item, onPress}: ItemCardProps) {
    const imageURL =
        item.images && item.images.length > 0
            ? {uri: item.images[0]}
            : require('../assets/images/Spinner.gif');
    const rating = item.rating || 0;
    const rawPrice = item.price;
    const price = Number(rawPrice).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <Pressable onPress={() => onPress(item)} style={{flex: 1}}>
            <Card className="flex-1 shadow" style={style.fabCard}>
                <VStack>
                    <Image
                        source={imageURL}
                        alt={item.name}
                        className="w-full h-[120px] rounded-t-md"
                    />
                    <VStack className="p-3 flex-1 justify-between space-y-2">
                        <VStack className="space-y-1">
                            <Heading isTruncated size="sm">{item.name}</Heading>
                            <Text isTruncated size="xs">{item.address}</Text>
                        </VStack>
                        <VStack className="space-y-1 mt-2">
                            <Text className="text-base font-bold">{price}</Text>
                            <Box className="mt-0.5">
                                <StarRatingDisplay rating={rating} starSize={16}/>
                            </Box>
                        </VStack>
                    </VStack>
                </VStack>
            </Card>
        </Pressable>
    );
}
const style = StyleSheet.create(
    {
        fabCard: {
            padding: 10,
            borderRadius: 10,
            backgroundColor: 'white',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -4},
            shadowOpacity: 0.1,
            shadowRadius: 1,
        },
    }
)