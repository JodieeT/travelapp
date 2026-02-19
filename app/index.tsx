import Banner from "@/components/Banner";
import SearchCard from "@/components/SearchCard";
import { images } from "@/constants/images";
import { fetchBanners } from "@/services/api";
import useFetch from "@/services/useFetch";
import { use } from "react";
import { Text, Image,View } from "react-native";



export default function Index() {
  const {data:bannerHotels} = useFetch(()=> fetchBanners())
  console.log("bannerHotels")
  console.log(bannerHotels)
  return (
    <View className="flex-1 bg-white">
      <View className="mt-2">
          <Banner hotels={bannerHotels} />
          <SearchCard />
      </View>
    </View>
  );
}