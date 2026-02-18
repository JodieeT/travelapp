import BottomBar from "@/components/BottomBar";
import DateBanner from "@/components/DateBanner";
import HotelInfoSection from "@/components/HotelInfoSelection";
import ImageSwiper from "@/components/ImageSwiper";
import RoomList from "@/components/RoomList";
import TopNav from "@/components/TopNav";
import { View, ScrollView } from "react-native";

export default function HotelDetail() {
  return (
    <View className="flex-1 bg-gray-100">
      
      <TopNav />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageSwiper />
        <HotelInfoSection />
        <DateBanner />
        <RoomList />
      </ScrollView>

      <BottomBar />
    </View>
  );
}
