import { Link } from "expo-router";
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  hotels?: HotelBanner[];
};

export default function Banner({ hotels }: Props) {
  if (!hotels || hotels.length === 0) return null;

  const renderHotelItem = ({ item: hotel }: { item: HotelBanner }) => (
    <Link href={`/hotels/${hotel.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.9}
        className="relative"
        style={{ width: width, height: height * 0.4 }}
      >
        {/* 背景图片 - 确保占据全部空间 */}
        <Image
          source={{ 
            uri: hotel.images && hotel.images.length > 0 ? hotel.images[0] : '' 
          }}
          resizeMode="cover"
          className="w-full h-full"
        />
        
        {/* 渐变遮罩层 - 移除圆角，占据全部空间 */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-none" />
        
        {/* 顶部信息区域 */}
        <View className="absolute top-10 left-4 right-4">
          <View className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Text className="text-white font-bold text-xl" numberOfLines={1}>
              {hotel.name_cn}
            </Text>
            
            {hotel.name_en && (
              <Text className="text-white/80 text-sm mt-1" numberOfLines={1}>
                {hotel.name_en}
              </Text>
            )}
            
            <View className="flex-row items-center mt-2">
              <Text className="text-yellow-400 text-lg">
                {'⭐'.repeat(hotel.star_level)}
              </Text>
              <Text className="text-white text-sm ml-2">
                {hotel.star_level}星级
              </Text>
            </View>
          </View>
        </View>
        
      </TouchableOpacity>
    </Link>
  );

  return (
    <View className="w-full">
      <FlatList
        data={hotels}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHotelItem}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        snapToInterval={width}
        decelerationRate="fast"
      />
    </View>
  );
}