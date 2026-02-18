import { View, Text } from "react-native";

export default function HotelInfoSection() {
  return (
    <View className="bg-white p-4">
      
      <Text className="text-lg font-semibold">
        上海陆家嘴禧玥酒店 ⭐⭐⭐⭐
      </Text>

      <Text className="text-blue-500 mt-1">
        4.8 超棒 · 4695条点评
      </Text>

      <Text className="text-gray-500 text-sm mt-2">
        浦东新区源深路868号
      </Text>

      <View className="flex-row flex-wrap mt-3">
        {["免费停车", "江景房", "2020开业"].map((tag, i) => (
          <Text
            key={i}
            className="text-xs bg-gray-100 px-2 py-1 rounded mr-2 mt-1"
          >
            {tag}
          </Text>
        ))}
      </View>
    </View>
  );
}
