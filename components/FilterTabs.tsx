import { View, Text } from "react-native";

export default function FilterTabs() {
  const tabs = ["推荐排序", "距离", "价格/星级", "筛选"];

  return (
    <View className=" bg-white py-3 border-t border-gray-100">
        <View className="flex-row justify-around bg-white py-3 border-t border-gray-100">
        {tabs.map((tab, index) => (
            <Text key={index} className="text-gray-600">
            {tab} ▾
            </Text>
        ))}
        
        </View>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {["免费停车", "亲子", "机场附近"].map((item, index) => (
          <View
            key={index}
            className="px-3 py-1 bg-gray-100 rounded-full"
          >
            <Text className="text-sm">{item}</Text>
          </View>
        ))}
      </View>
    </View>


    
  );
}
