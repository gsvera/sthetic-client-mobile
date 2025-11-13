import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { Modal, StyleSheet, View } from "react-native";
import ButtonCloseModal from "../ButtonCloseModal";
import GeneralButton from "../GeneralButton";
import { TextStyle } from "@/constants/StyleComponents";
import { useNavigation } from "expo-router";

type modalRequiredLogin = {
  open: boolean;
  handleClose: () => void;
};

export const ModalRequiredLogin = ({
  open,
  handleClose,
}: modalRequiredLogin) => {
  const navigation = useNavigation();
  const goToLogin = () => {
    handleClose();
    navigation.navigate("login" as never);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={localStyle.overlay}
        onStartShouldSetResponder={() => {
          handleClose();
          return false;
        }}
      >
        <View style={localStyle.contentModal}>
          <ButtonCloseModal handleOnPress={handleClose} />
          <ThemedText style={localStyle.titleModal}>
            Inicia sesión para continuar
          </ThemedText>
          <ThemedText style={localStyle.text}>
            Para agendar una cita o contactar al proveedor, necesitas iniciar
            sesión o crear una cuenta.
          </ThemedText>
          <GeneralButton
            textBtn="Iniciar sesión / Registrarme"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={localStyle.btnToGoLogin}
            handleOnPress={goToLogin}
          />
        </View>
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: ThemeColorsSthetic.shadowBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  contentModal: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    width: "80%",
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  titleModal: {
    color: ThemeColorsSthetic.textTitle,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  text: {
    color: ThemeColorsSthetic.text,
    textAlign: "justify",
    marginBottom: 15,
  },
  btnToGoLogin: {
    backgroundColor: ThemeColorsSthetic.updateNotification,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ModalRequiredLogin;
