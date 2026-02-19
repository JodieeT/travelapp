import { Link } from "expo-router";
import { TouchableOpacity, Image } from "react-native";

type Props = {
  hotels?: HotelBanner[];
};

export default function Banner({ hotels }: Props) {
  
  return (
    hotels?.map((hotel) => (
      <Link href={`/hotels/${hotel.id}`} asChild key={hotel.id}>
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full px-4 mt-4"
        >
          <Image
            source={{ 
              uri: hotel.images && hotel.images.length > 0 ? hotel.images[0] : '' 
            }}
            resizeMode="cover"
            className="w-full h-40 rounded-2xl"
          />
        </TouchableOpacity>
      </Link>
    ))
  );
}