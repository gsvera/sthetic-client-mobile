import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import apiUserConfig from "@/api/UserConfig";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import StateAndMunicipalitySelect from "@/components/Shared/StateAndMunicipalitySelect";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
import { DefaultLocationType } from "@/constants/GeneralTypes";
import { ButtonGeneralStyle } from "@/constants/StyleComponents";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { useSessionProvider } from "@/provider/SessionProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

type myLocationFormProps = {
  idUser: string;
  handleClose?: () => void; // Solo para cuando se anida a un modal
  auxModal?: boolean;
};

export const MyLocationForm = ({
  idUser,
  handleClose,
  auxModal,
}: myLocationFormProps) => {
  const queryClient = useQueryClient();
  const { height } = useWindowDimensions();
  const { handleNotification } = useNotificationProvider();
  const { storeSessionProvider, setDefaultLocationStore } =
    useSessionProvider();
  const [defaultLocation, setDefaultLocation] = useState<DefaultLocationType>({
    defaultState: storeSessionProvider?.defaultState,
    defaultMunicipality: storeSessionProvider?.defaultMunicipality,
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
    setDefaultLocationStore(defaultLocation);
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.provider.searchProvider("search-provider")],
      });
    }, 1000);
    handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
    handleClose?.();
  };

  const onSelectOption = (data: DefaultLocationType) => {
    setDefaultLocation(data);
  };

  const handleSaveDefaultLocation = () => {
    saveDefaultLocation({
      idUser,
      defaultState: defaultLocation?.defaultState,
      defaultMunicipality: defaultLocation?.defaultMunicipality,
    });
  };

  return (
    <View
      style={!auxModal ? localStyle.contentBodyFlex : localStyle.contentBody}
    >
      <View
        style={
          !auxModal
            ? {
                height:
                  height * (Platform.OS === PLATFORM_TYPE.IOS ? 0.6 : 0.5),
              }
            : { height: height * 0.4 }
        }
      >
        <ScrollView style={{ flexGrow: 1 }}>
          <ThemedText style={localStyle.textDescription}>
            Estos configuración sirven para realizar busquedas mas precisas
            cerca de su ubicación
          </ThemedText>
          <StateAndMunicipalitySelect
            handleSelectData={onSelectOption}
            defaultValues={defaultLocation}
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
        </ScrollView>
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  containt: {
    flex: 1,
  },
  contentBodyFlex: { width: "auto", padding: 10, flex: 1 },
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
  none: {},
});

export default MyLocationForm;
