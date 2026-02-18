import { Link } from "expo-router";
import { TouchableOpacity, Image } from "react-native";

type Props = {
  image: any;
  hotelID?: any;
};

export default function Banner({ image, hotelID }: Props) {
  return (
    <Link href={`/hotels/${hotelID}`} asChild>
        <TouchableOpacity
        activeOpacity={0.8}
        className="w-full px-4 mt-4"
        >
        <Image
            source={image}
            resizeMode="cover"
            className="w-full h-40 rounded-2xl"
        />
        </TouchableOpacity>
    </Link>

  );
}
