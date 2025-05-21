import { modalCustomProps } from "@/constants/GeneralTypes";
import { Modal, View } from "react-native";
import MyLocationForm from "../MyLocationForm";
import { ModalStyle } from "@/constants/StyleComponents";
import { ThemeColorsSthetic } from "@/constants/Colors";
import ButtonCloseModal from "@/components/Shared/ButtonCloseModal";

export const MyLocationModal = ({
  idUser,
  open,
  handleCloseModal,
}: modalCustomProps) => {
  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={ModalStyle.modalView}>
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
          />
        </View>
      </View>
    </Modal>
  );
};
