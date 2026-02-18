import { View, Text, TouchableOpacity } from "react-native";

export default function DateBanner() {
  return (
    <TouchableOpacity className="bg-white mt-3 p-4">
      <Text className="font-semibold">
        1月9日 → 1月10日 · 1晚
      </Text>
      <Text className="text-gray-400 text-xs mt-1">
        点击修改入住日期
      </Text>
    </TouchableOpacity>
  );
}
