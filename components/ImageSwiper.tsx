import { FlatList, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const images = [
  "https://via.placeholder.com/400",
  "https://via.placeholder.com/400/0000FF",
  "https://via.placeholder.com/400/FF0000",
];

export default function ImageSwiper() {
  return (
    <FlatList
      data={images}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={{ width, height: 250 }}
        />
      )}
    />
  );
}
