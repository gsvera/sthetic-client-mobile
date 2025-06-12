import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { modalCustomProps, ProviderRatings } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  ModalStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import {
  Image,
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import StartRating from "./StartRating";
import { useState } from "react";
import GeneralButton from "../GeneralButton";
import ButtonCloseModal from "../ButtonCloseModal";
import { useMutation } from "@tanstack/react-query";
import { apiScheduleService } from "@/api/ScheduleService";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ErrorAlertMessage } from "../Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";

type modalQualificationProps = modalCustomProps & {
  providerRatings: ProviderRatings;
};

export const ModalQualification = ({
  open,
  handleCloseModal,
  providerRatings,
}: modalQualificationProps) => {
  const { handleNotification } = useNotificationProvider();
  const [rating, setRaiting] = useState(0);
  const [comment, setCommet] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { mutate: makeQualification } = useMutation({
    mutationFn: (data: any) => apiScheduleService.makeRatingByService(data),
    onSuccess: (data: ResponseApi) => handleSuccessMakeQualification(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: deleteQualification } = useMutation({
    mutationFn: (id: number) => apiScheduleService.deleteRatingByService(id),
    onSuccess: (data: ResponseApi) =>
      handleSuccessDeleteQualification(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessMakeQualification = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
    handleCloseModal();
  };

  const handleSuccessDeleteQualification = (data: ObjectResponse) => {
    handleCloseModal();
  };

  const handleUpdateCalification = () => {
    setLoading(true);
    makeQualification({
      id: providerRatings.id,
      rating,
      comment,
    });
  };

  const handleDeleteQualification = () => {
    setLoading(true);
    deleteQualification(providerRatings.id);
  };

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={ModalStyle.modalView}>
          <View style={localStyle.modalContent}>
            <ButtonCloseModal
              handleOnPress={handleCloseModal}
              styleContentHeader={localStyle.btnClose}
            />
            <View>
              <Image
                style={localStyle.imgProvider}
                source={{
                  uri: providerRatings?.idProvider?.infoCompanyDTO
                    ?.companyPicture,
                }}
              />
            </View>
            <ThemedText style={{ ...TextStyle.value, ...TextStyle.center }}>
              Califica el servicio de
            </ThemedText>
            <ThemedText
              style={{ ...TextStyle.fontBoldDark, ...TextStyle.center }}
            >
              {providerRatings?.idProvider?.infoCompanyDTO?.companyName}{" "}
            </ThemedText>
            <View style={localStyle.contentStart}>
              <StartRating rating={rating} onRaitingChange={setRaiting} />
            </View>
            <View>
              <TextInput
                style={localStyle.inputComments}
                multiline
                maxLength={350}
                onChangeText={(e) => setCommet(e)}
              />
            </View>
            <View>
              <GeneralButton
                styleText={TextStyle.fontBoldWhite}
                textBtn="Calificar"
                styleBtn={{
                  ...ButtonGeneralStyle.btnSaveSthetic,
                  marginTop: 20,
                }}
                styleBtndisable={{
                  ...ButtonGeneralStyle.btnDisabledSthetic,
                  marginTop: 20,
                }}
                handleOnPress={handleUpdateCalification}
                disabledBtn={loading}
              />
              <GeneralButton
                styleText={TextStyle.fontBoldWhite}
                textBtn="En otro momento"
                styleBtn={{
                  ...ButtonGeneralStyle.btnCancelSthetic,
                  marginTop: 15,
                  marginBottom: 5,
                }}
                styleBtndisable={{
                  ...ButtonGeneralStyle.btnDisabledSthetic,
                  marginTop: 15,
                  marginBottom: 5,
                }}
                handleOnPress={handleDeleteQualification}
                disabledBtn={loading}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modalContent: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    paddingBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
    borderRadius: 5,
  },
  contentStart: {
    marginHorizontal: "auto",
    width: "80%",
    marginTop: 10,
  },
  inputComments: {
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    marginTop: 15,
    height: 80,
    padding: 10,
  },
  btnClose: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 5,
    paddingRight: 10,
  },
  imgProvider: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
});

export default ModalQualification;
