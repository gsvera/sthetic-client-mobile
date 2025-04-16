import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { StyleSheet, View } from "react-native";

type badgeProps = {
  text: string;
};

export const Badge = ({ text }: badgeProps) => {
  return (
    <View style={localStyle.badge}>
      <ThemedText style={localStyle.text}>{text}</ThemedText>
    </View>
  );
};

const localStyle = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: ThemeColorsSthetic.accent,
    borderRadius: 5,
    margin: 3,
  },
  text: {
    color: ThemeColorsSthetic.textLight,
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default Badge;
