import { ThemeColorsSthetic } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type returnArrowProps = {
  handleReturn: () => void;
};

export const ReturnArrow = ({ handleReturn }: returnArrowProps) => {
  const handleOnPress = () => handleReturn();
  return (
    <View style={localStyle.contentHeader}>
      <Pressable onPress={handleOnPress}>
        <Ionicons
          name="arrow-back-sharp"
          size={30}
          color={ThemeColorsSthetic.accentReverse}
        />
      </Pressable>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 15,
    marginBottom: 5,
    paddingLeft: 10,
  },
});

export default ReturnArrow;
