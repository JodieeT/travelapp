import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function TopNav() {
  return (
    <View className="absolute top-0 left-0 right-0 z-50 
                     flex-row items-center justify-between
                     px-4 pt-12 pb-3 bg-white/80 backdrop-blur">
      
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-lg">←</Text>
      </TouchableOpacity>

      <Text className="font-semibold text-base">
        上海陆家嘴禧玥酒店
      </Text>

      <View className="w-6" />
    </View>
  );
}
