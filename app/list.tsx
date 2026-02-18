import { View, FlatList } from "react-native";
import HeaderBar from "@/components/HeaderBar";
import FilterTabs from "@/components/FilterTabs";
import HotelCard from "@/components/HotelCard";

const mockData = [
  {
    id: "1",
    name: "上海陆家嘴禧玥酒店",
    enName: "SSAW Boutique Hotel",
    address: "近外滩 · 东方明珠",
    rating: 4.8,
    price: 936,
    tags: ["免费停车", "新中式风", "江景"],
  },
  {
    id: "2",
    name: "艺龙安悦酒店",
    enName: "Elong Hotel",
    address: "浦东大道 · 地铁站",
    rating: 4.7,
    price: 199,
    tags: ["免费洗衣", "机器人服务"],
  },
];

export default function ListPage() {
  return (
    <View className="flex-1 bg-gray-100 mt-5">
      <HeaderBar />
      <FilterTabs />
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HotelCard item={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}
