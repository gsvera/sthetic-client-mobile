import { ThemeColorsSthetic } from "@/constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

type buttonCloseModalProps = {
  styleContentHeader?: {};
  handleOnPress: () => void;
};

export const ButtonCloseModal = ({
  styleContentHeader,
  handleOnPress,
}: buttonCloseModalProps) => {
  return (
    <View style={styleContentHeader || localStyle.contentHeader}>
      <Pressable onPress={handleOnPress}>
        <SimpleLineIcons
          name="close"
          size={24}
          color={ThemeColorsSthetic.accentReverse}
        />
      </Pressable>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    marginBottom: 5,
    paddingRight: 10,
  },
});
export default ButtonCloseModal;
