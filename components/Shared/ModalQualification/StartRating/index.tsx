import { StyleSheet, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { GridStyle } from "@/constants/StyleComponents";

type startRatingProps = {
  maxStars?: number;
  rating: number;
  onRaitingChange: (value: number) => void;
};

export const StartRating = ({
  maxStars = 5,
  rating,
  onRaitingChange,
}: startRatingProps) => {
  const [localRating, setLocalRating] = useState(rating | 0);

  const handlePress = (value: number) => {
    setLocalRating(value);
    onRaitingChange(value);
  };
  return (
    <View style={GridStyle.rowSpaceBetween}>
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <TouchableOpacity
            key={starValue}
            onPress={() => handlePress(starValue)}
          >
            <AntDesign
              name={starValue <= localRating ? "star" : "staro"}
              size={32}
              style={localStyle.star}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const localStyle = StyleSheet.create({
  star: {
    marginHorizontal: 4,
    color: ThemeColorsSthetic.accent,
  },
});

export default StartRating;
