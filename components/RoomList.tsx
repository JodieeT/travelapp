import { View, Text, Image, TouchableOpacity } from "react-native";

const rooms = [
  {
    id: "1",
    name: "经典双床房",
    price: 936,
  },
];

export default function RoomList() {
  return (
    <View className="mt-3 bg-white p-4">
      
      {rooms.map((room) => (
        <View key={room.id} className="flex-row mb-4">
          
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            className="w-24 h-24 rounded-lg"
          />

          <View className="flex-1 ml-3 justify-between">
            <Text className="font-semibold">
              {room.name}
            </Text>

            <View className="items-end">
              <Text className="text-blue-500 font-bold text-lg">
                ¥{room.price}
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
}
