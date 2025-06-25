import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { GridStyle } from "@/constants/StyleComponents";
import { Ionicons } from "@expo/vector-icons";

type startRatingProps = {
  maxStars?: number;
  rating: number;
  sizeStart?: number;
  onRaitingChange?: (value: number) => void;
  enabled?: boolean;
};

export const StartRating = ({
  maxStars = 5,
  rating,
  sizeStart = 32,
  onRaitingChange,
  enabled,
}: startRatingProps) => {
  const [localRating, setLocalRating] = useState(rating ?? 0);

  const handlePress = (value: number) => {
    if (enabled) {
      setLocalRating(value);
      onRaitingChange?.(value);
    }
  };
  return (
    <View
      style={{
        ...GridStyle.rowSpaceBetween,
      }}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        let res = localRating - starValue;

        let iconName: "star-outline" | "star" | "star-half-outline" =
          "star-outline";
        if (localRating >= starValue) {
          iconName = "star";
        } else if (localRating + 0.5 >= starValue) {
          iconName = "star-half-outline";
        } else if (res > -1 && res < 0) {
          iconName = "star-half-outline";
        }

        return (
          <Pressable key={starValue} onPress={() => handlePress(starValue)}>
            <Ionicons
              name={iconName}
              size={sizeStart}
              style={localStyle.star}
            />
          </Pressable>
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
