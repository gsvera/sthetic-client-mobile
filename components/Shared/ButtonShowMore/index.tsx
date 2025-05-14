import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity } from "react-native";

type buttonShowMoreProps = {
  show: boolean;
  handlePress: () => void;
};

export const ButtonShowMore = ({ show, handlePress }: buttonShowMoreProps) => {
  return (
    <TouchableOpacity onPress={handlePress}>
      <ThemedText style={localStyle.toggleText}>
        {show ? "Ver menos ▲" : "Ver más ▼"}
      </ThemedText>
    </TouchableOpacity>
  );
};

const localStyle = StyleSheet.create({
  toggleText: {
    color: ThemeColorsSthetic.accentReverse,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ButtonShowMore;
