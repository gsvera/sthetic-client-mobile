import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import StateAndMunicipalitySelect from "@/components/Shared/StateAndMunicipalitySelect";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ButtonGeneralStyle } from "@/constants/StyleComponents";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiUserConfig from "@/api/UserConfig";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import { useState } from "react";
import { DefaultLocationType } from "@/constants/GeneralTypes";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";

type myLocationProps = {
  idUser: string;
  returnBack: () => void;
};

export const MyLocation = ({ idUser, returnBack }: myLocationProps) => {
  const { handleNotification } = useNotificationProvider();
  const [defaultLocation, setDefaultLocation] = useState<DefaultLocationType>();

  const { data: dataDefaultLocation } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getDefaultLocationByUser(idUser)],
    queryFn: () => apiUserConfig.getLocationByUser(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as DefaultLocationType,
      enabled: Boolean(idUser),
    },
  });

  const { mutate: saveDefaultLocation } = useMutation({
    mutationFn: (data: any) => apiUserConfig.saveDefaultLocation(data),
    onSuccess: (data: ResponseApi) =>
      handleSuccessSaveDefaultLocation(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveDefaultLocation = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
  };

  const handleSaveDefaultLocation = () => {
    saveDefaultLocation({
      idUser,
      defaultState: defaultLocation?.defaultState,
      defaultMunicipality: defaultLocation?.defaultMunicipality,
    });
  };

  const onSelectOption = (data: DefaultLocationType) => {
    setDefaultLocation(data);
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Mi Ubicación" handleReturn={returnBack} />
      <View style={localStyle.contentBody}>
        <ThemedText style={localStyle.textDescription}>
          Estos configuración sirven para realizar busquedas mas precisas cerca
          de su ubicación
        </ThemedText>
        <StateAndMunicipalitySelect
          handleSelectData={onSelectOption}
          defaultValues={dataDefaultLocation}
        />
        <View style={localStyle.contentBtn}>
          <GeneralButton
            styleBtn={ButtonGeneralStyle.btnUpdateSthetic}
            textBtn="Guardar mi ubicación"
            styleText={{
              color: ThemeColorsSthetic.textLight,
            }}
            handleOnPress={handleSaveDefaultLocation}
          />
        </View>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  contentBody: { width: "auto", padding: 10 },
  textDescription: {
    textAlign: "center",
    marginBottom: 10,
    color: ThemeColorsSthetic.text,
  },
  contentBtn: {
    marginTop: 20,
    width: "90%",
    marginHorizontal: "auto",
  },
});

export default MyLocation;
