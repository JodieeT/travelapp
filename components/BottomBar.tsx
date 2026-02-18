import { View, Text, TouchableOpacity } from "react-native";

export default function BottomBar() {
  return (
    <View className="absolute bottom-0 left-0 right-0
                     bg-white p-4 flex-row items-center justify-between
                     border-t border-gray-200">
      
      <Text className="text-blue-500 text-xl font-bold">
        ¥936 起
      </Text>

      <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-xl">
        <Text className="text-white font-semibold">
          查看房型
        </Text>
      </TouchableOpacity>
    </View>
  );
}
