import Banner from "@/components/Banner";
import SearchCard from "@/components/SearchCard";
import { images } from "@/constants/images";
import { Text, Image,View } from "react-native";



export default function Index() {
  return (
    <View className="flex-1 bg-white">
      <View className="mt-2">
          <Banner image={images.hotel} hotelID={1} />
          <SearchCard />
      </View>
    </View>
  );
}
