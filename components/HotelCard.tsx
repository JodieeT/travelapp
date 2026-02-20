import { images } from "@/constants/images";
import { Link } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function HotelCard({ item }: { item: Hotel }) {
  return (
    <Link href={`/hotels/${item.id}`} asChild>
            <TouchableOpacity className="bg-white rounded-2xl p-3 mb-4">
            
            <View className="flex-row">
                
                {/* 图片 */}
                <Image
                source={{uri: item.images && item.images.length > 0 ? item.images[0] : '' }}
                className="w-24 h-24 rounded-xl"
                />

                {/* 信息 */}
                <View className="flex-1 ml-3">
                
                {/* 名字 */}
                <Text className="font-semibold text-base">
                    {item.name_cn}
                </Text>
                <Text className="text-gray-400 text-xs">
                    {item.name_en}
                </Text>

                {/* 评分 */}
                <Text className="text-blue-500 mt-1">
                    {item.star_level} 分
                </Text>

                {/* 地址 */}
                <Text className="text-gray-500 text-xs mt-1">
                    {item.address}
                </Text>

                {/* 标签 */}
                <View className="flex-row flex-wrap mt-2">
                    {/* 处理tags为字符串或数组的情况 */}
                    {typeof item.tags === 'string' ? (
                        <Text className="text-xs bg-gray-100 px-2 py-1 rounded mr-2 mt-1">
                            {item.tags}
                        </Text>
                    ) : Array.isArray(item.tags) ? (
                        item.tags.map((tag: string, i: number) => (
                            <Text
                                key={i}
                                className="text-xs bg-gray-100 px-2 py-1 rounded mr-2 mt-1"
                            >
                                {tag}
                            </Text>
                        ))
                    ) : null}
                </View>
                </View>
            </View>

            {/* 价格 */}
            <View className="items-end mt-2">
                <Text className="text-blue-500 text-lg font-bold">
                ¥{item.min_price}
                </Text>
            </View>
            </TouchableOpacity>
    </Link>
  );
}