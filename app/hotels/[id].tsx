import BottomBar from "@/components/BottomBar";
import TopNav from "@/components/TopNav";
import useFetch from "@/services/useFetch";
import { fetchHotelDetail } from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import { View, ScrollView, FlatList, Image, Text, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function HotelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: hotel, loading, error } = useFetch(() => fetchHotelDetail(id || ''));

  // 渲染图片轮播
  const renderImageSwiper = () => {
    if (!hotel?.images || hotel.images.length === 0) return null;
    
    return (
      <FlatList
        data={hotel.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: 250 }}
          />
        )}
      />
    );
  };

  // 渲染酒店信息区域
  const renderHotelInfo = () => {
    if (!hotel) return null;
    
    return (
      <View className="bg-white p-4">
        <Text className="text-lg font-semibold">
          {hotel.name_cn} {hotel.name_en ? `· ${hotel.name_en}` : ''}
        </Text>
        
        <View className="flex-row items-center mt-1">
          <Text className="text-yellow-500">
            {'⭐'.repeat(hotel.star_level)}
          </Text>
          <Text className="text-blue-500 ml-2">
            {hotel.star_level}.0 分
          </Text>
        </View>

        <Text className="text-gray-500 text-sm mt-2">
          {hotel.address}
        </Text>

        {hotel.tags && hotel.tags.length > 0 && (
          <View className="flex-row flex-wrap mt-3">
            {hotel.tags.map((tag: string, i: number) => (
              <Text
                key={i}
                className="text-xs bg-gray-100 px-2 py-1 rounded mr-2 mt-1"
              >
                {tag}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  // 渲染日期选择横幅
  const renderDateBanner = () => (
    <TouchableOpacity className="bg-white mt-3 p-4">
      <Text className="font-semibold">
        1月9日 → 1月10日 · 1晚
      </Text>
      <Text className="text-gray-400 text-xs mt-1">
        点击修改入住日期
      </Text>
    </TouchableOpacity>
  );

  // 渲染房间列表
  const renderRoomList = () => {
    if (!hotel?.rooms || hotel.rooms.length === 0) return null;
    
    return (
      <View className="mt-3 bg-white p-4">
        {hotel.rooms.map((room) => (
          <View key={room.id} className="flex-row mb-4">
            <Image
              source={{ uri: hotel.images?.[0] || "https://via.placeholder.com/100" }}
              className="w-24 h-24 rounded-lg"
            />

            <View className="flex-1 ml-3 justify-between">
              <Text className="font-semibold">
                {room.type_name}
              </Text>

              <View className="items-end">
                <Text className="text-blue-500 font-bold text-lg">
                  ¥{room.base_price}
                </Text>

                <TouchableOpacity className="bg-blue-500 px-4 py-1 rounded-lg mt-1">
                  <Text className="text-white text-sm">
                    预订
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // 处理预订按钮点击
  const handleBookPress = () => {
    console.log('预订按钮点击');
    // 这里可以添加预订逻辑
  };

  // 加载状态
  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <Text>加载中...</Text>
      </View>
    );
  }

  // 错误状态
  if (error) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-red-500">加载失败: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <TopNav hotelName={hotel?.name_cn || "酒店详情"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageSwiper()}
        {renderHotelInfo()}
        {renderDateBanner()}
        {renderRoomList()}
      </ScrollView>

      <BottomBar 
        minPrice={hotel?.min_price} 
        onBookPress={handleBookPress}
      />
    </View>
  );
}
