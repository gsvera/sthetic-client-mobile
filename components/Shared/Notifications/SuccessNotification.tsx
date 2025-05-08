import { GlobalColors, ThemeColorsSthetic } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../ThemedText";

type successNotificationProps = {
  message: string;
};

export default function SuccessNotification({
  message,
}: successNotificationProps) {
  return (
    <View style={localStyles.backgroundContent}>
      <View style={localStyles.body}>
        <AntDesign
          name="checkcircle"
          size={60}
          color={ThemeColorsSthetic.textLight}
        />
        <ThemedText type="subtitle" style={localStyles.textSuccess}>
          {message}
        </ThemedText>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  backgroundContent: {
    backgroundColor: ThemeColorsSthetic.successNotification,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: "center",
    alignContent: "center",
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  textSuccess: {
    color: ThemeColorsSthetic.textLight,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
});
