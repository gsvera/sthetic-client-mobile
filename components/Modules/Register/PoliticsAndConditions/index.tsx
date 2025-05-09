import { ThemedText } from "@/components/ThemedText";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { modalCustomProps } from "@/constants/GeneralTypes";
import { SimpleLineIcons } from "@expo/vector-icons";
import { PLATFORM_TYPE } from "@/constants/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PoliticsAndConditionsModal({
  open,
  handleCloseModal,
}: modalCustomProps) {
  const insets = useSafeAreaInsets();
  const platform = Platform.OS;
  return (
    <Modal
      style={localStyles.contentPolitics}
      animationType="slide"
      transparent={false}
      visible={open}
    >
      <View
        style={{
          ...localStyles.contentBtnClose,
          top: platform === PLATFORM_TYPE.ANDROID ? 0 : insets.top,
        }}
      >
        <Pressable onPress={handleCloseModal}>
          <SimpleLineIcons
            name="close"
            size={24}
            color={ThemeColorsSthetic.accentReverse}
          />
        </Pressable>
      </View>
      <View style={localStyles.contentSubtitle}>
        <ThemedText type="title" style={localStyles.subtitle}>
          Terminos y condiciones
        </ThemedText>
      </View>
      <ScrollView style={localStyles.contentText}>
        {/* ESTO DEBE CAMBIARSE POR LOS TEXTO REALES */}
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
        <ThemedText style={localStyles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex id odit
          doloribus rem, delectus ea voluptatibus quibusdam adipisci
          accusantium? Optio voluptas voluptatem libero minus explicabo rem
          accusamus suscipit dolorem quaerat.
        </ThemedText>
      </ScrollView>
    </Modal>
  );
}

export const localStyles = StyleSheet.create({
  contentPolitics: {
    paddingTop: 15,
  },
  contentSubtitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
  },
  text: {
    color: ThemeColorsSthetic.text,
    marginBottom: 15,
    textAlign: "justify",
  },
  textAgree: {
    color: ThemeColorsSthetic.textLabels,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentText: {
    width: "85%",
    height: "75%",
    marginHorizontal: "auto",
    marginBottom: 15,
  },
  contentCheck: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginHorizontal: "auto",
  },
  contentBtnClose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 15,
  },
});
