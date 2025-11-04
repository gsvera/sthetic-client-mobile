import { modalCustomProps } from "@/constants/GeneralTypes";
import { Modal, View } from "react-native";
import MyLocationForm from "../MyLocationForm";
import { ModalStyle } from "@/constants/StyleComponents";
import { ThemeColorsSthetic } from "@/constants/Colors";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";
import { SafeAreaView } from "react-native-safe-area-context";

export const MyLocationModal = ({
  idUser,
  open,
  handleCloseModal,
}: modalCustomProps) => {
  return (
    <Modal
      style={{ flex: 1 }}
      visible={open}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseModal}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: ThemeColorsSthetic.shadowBackground,
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: ThemeColorsSthetic.backgroundLight,
              marginHorizontal: 10,
              paddingBottom: 10,
            }}
          >
            <ButtonCloseModal handleOnPress={handleCloseModal} />
            <MyLocationForm
              idUser={idUser as string}
              handleClose={handleCloseModal}
              auxModal={true}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
