import { View, Text, TextInput } from "react-native";

export default function HeaderBar() {
  return (
    <View className="bg-white px-4 pt-4 pb-3">
      
      {/* 城市 + 日期 */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-semibold text-blue-500">上海</Text>

        <Text className="text-gray-500 text-sm">
          01-09 → 01-10 · 1晚
        </Text>
      </View>

      {/* 搜索框 */}
      <TextInput
        placeholder="位置/品牌/酒店"
        className="bg-gray-100 px-3 py-2 rounded-xl"
      />
    </View>
  );
}
