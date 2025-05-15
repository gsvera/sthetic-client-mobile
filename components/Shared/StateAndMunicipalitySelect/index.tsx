import apiCatalogs from "@/api/Catalogs";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import {
  CatalogGeoMunicipalityType,
  CatalogGeoStateType,
  DefaultLocationType,
} from "@/constants/GeneralTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SelectMunicipalityModal } from "./SelectMunicipalityModal";
import { SelectStateModal } from "./SelectStateModal";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { ThemeColorsSthetic } from "@/constants/Colors";
import LoadingView from "../LoadingView";
import GeneralButton from "../GeneralButton";
import apiUserConfig from "@/api/UserConfig";
import { ErrorAlertMessage } from "../Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";

type stateAndMunicipalitySelectProps = {
  idUser: string;
};

export const StateAndMunicipalitySelect = ({
  idUser,
}: stateAndMunicipalitySelectProps) => {
  const { handleNotification } = useNotificationProvider();
  const [openStateModal, setOpenStateModal] = useState(false);
  const [openMunicipalityModal, setOpenMunicipalityModal] = useState(false);
  const [localState, setLocalState] = useState<CatalogGeoStateType>();
  const [localMunicipality, setLocalMunicipality] =
    useState<CatalogGeoMunicipalityType>();

  const { data: dataDefaultLocation } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getDefaultLocationByUser(idUser)],
    queryFn: () => apiUserConfig.getLocationByUser(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as DefaultLocationType,
      enabled: Boolean(idUser),
    },
  });

  useEffect(() => {
    if (dataDefaultLocation?.defaultState)
      setLocalState({ id: 0, stateName: dataDefaultLocation.defaultState });
    if (dataDefaultLocation?.defaultMunicipality)
      setLocalMunicipality({
        id: 0,
        municipalityName: dataDefaultLocation.defaultMunicipality,
      });
  }, [dataDefaultLocation]);

  const { data: listState = [], isLoading: isLoadingStates } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.geo.getAllState("select-state-modal")],
    queryFn: () => apiCatalogs.getAllGeoState(),
    ...{
      select: (data: ResponseApi) =>
        data.data.items as Array<CatalogGeoStateType>,
    },
  });

  const { data: listMunicipality = [], isLoading: isLoadingMunicipalities } =
    useQuery({
      queryKey: [
        REACT_QUERY_KEYS.catalogs.geo.getMunicipalityByState(localState?.id),
      ],
      queryFn: () => apiCatalogs.getMunicipalityByState(localState?.id),
      ...{
        select: (data: ResponseApi) =>
          data.data.items as Array<CatalogGeoMunicipalityType>,
        enabled: Boolean(localState?.id),
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

  const onSelectState = (item: CatalogGeoStateType) => {
    setLocalState(item);
    setLocalMunicipality(undefined);
    setOpenStateModal(false);
  };

  const onSelectMunicipality = (item: CatalogGeoMunicipalityType) => {
    setLocalMunicipality(item);
    setOpenMunicipalityModal(false);
  };

  const handleSaveDefaultLocation = () => {
    saveDefaultLocation({
      idUser,
      defaultState: localState?.stateName,
      defaultMunicipality: localMunicipality?.municipalityName,
    });
  };

  return (
    <View>
      <View>
        <ThemedText style={TextStyle.label}>Seleccione un estado</ThemedText>
        <TouchableOpacity
          style={localStyle.select}
          onPress={() => setOpenStateModal(true)}
        >
          {isLoadingStates ? (
            <LoadingView />
          ) : (
            <ThemedText style={TextStyle.valueSelect}>
              {!localState?.stateName
                ? "Seleccione una opcion"
                : localState.stateName}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
      <View style={MarginStyle.marginT10}>
        <ThemedText style={TextStyle.label}>Seleccione un municipio</ThemedText>
        <TouchableOpacity
          style={localStyle.select}
          onPress={() => setOpenMunicipalityModal(true)}
        >
          {isLoadingMunicipalities ? (
            <LoadingView />
          ) : (
            <ThemedText style={TextStyle.valueSelect}>
              {!localMunicipality?.municipalityName
                ? "Seleccione una opcion"
                : localMunicipality.municipalityName}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 20, width: "90%", marginHorizontal: "auto" }}>
        <GeneralButton
          styleBtn={ButtonGeneralStyle.btnUpdateSthetic}
          textBtn="Guardar mi ubicación"
          styleText={{
            color: ThemeColorsSthetic.textLight,
          }}
          handleOnPress={handleSaveDefaultLocation}
        />
      </View>
      <SelectStateModal
        open={openStateModal}
        handleCloseModal={() => setOpenStateModal(false)}
        listState={listState}
        handleSelect={onSelectState}
      />
      <SelectMunicipalityModal
        open={openMunicipalityModal}
        handleCloseModal={() => setOpenMunicipalityModal(false)}
        listMunicipality={listMunicipality}
        handleSelect={onSelectMunicipality}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  select: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: ThemeColorsSthetic.backgroundStrong,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginTop: 10,
  },
});
export default StateAndMunicipalitySelect;
