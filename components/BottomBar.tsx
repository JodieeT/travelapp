import { View, Text, TouchableOpacity } from "react-native";

interface BottomBarProps {
  minPrice?: number;
  onBookPress?: () => void;
}

export default function BottomBar({ minPrice = 0, onBookPress }: BottomBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0
                     bg-white p-4 flex-row items-center justify-between
                     border-t border-gray-200">
      
      <View>
        <Text className="text-blue-500 text-xl font-bold">
          ¥{minPrice > 0 ? minPrice : '--'} 起
        </Text>
        {minPrice > 0 && (
          <Text className="text-gray-500 text-xs mt-1">
            最低房价
          </Text>
        )}
      </View>

      <TouchableOpacity 
        className="bg-blue-500 px-6 py-3 rounded-xl"
        onPress={onBookPress}
      >
        <Text className="text-white font-semibold">
          查看房型
        </Text>
      </TouchableOpacity>
    </View>
  );
}