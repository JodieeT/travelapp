import { View, FlatList } from "react-native";
import HeaderBar from "@/components/HeaderBar";
import FilterTabs from "@/components/FilterTabs";
import HotelCard from "@/components/HotelCard";
import useFetch from "@/services/useFetch";
import { fetchHotels } from "@/services/api";


export default function ListPage() {
  const {data: hotelList, loading, error, refetch} = useFetch(()=> fetchHotels())
  console.log("hotelList")
  console.log(hotelList)
  return (
    <View className="flex-1 bg-gray-100 mt-5">
      <HeaderBar />
      <FilterTabs />
      <FlatList
        data={hotelList?.list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HotelCard item={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}