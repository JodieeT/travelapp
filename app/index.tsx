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
      {/* Banner区域 - 确保位于最上方，占据全宽 */}
      <View className="w-full mt-0 pt-0">
        <Banner hotels={bannerHotels ?? undefined} />
      </View>
      
      {/* SearchCard区域 - 在下方，与Banner产生自然重叠 */}
      <View className="relative -mt-16 z-10 mx-4">
        <SearchCard />
      </View>
    </View>
  );
}