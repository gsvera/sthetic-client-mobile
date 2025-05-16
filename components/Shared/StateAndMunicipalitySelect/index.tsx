import apiCatalogs from "@/api/Catalogs";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import {
  CatalogGeoMunicipalityType,
  CatalogGeoStateType,
  DefaultLocationType,
} from "@/constants/GeneralTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SelectMunicipalityModal } from "./SelectMunicipalityModal";
import { SelectStateModal } from "./SelectStateModal";
import { MarginStyle } from "@/constants/StyleComponents";
import ButtonSelect from "../ButtonSelect";

type stateAndMunicipalitySelectProps = {
  defaultValues: DefaultLocationType | undefined;
  handleSelectData: (data: DefaultLocationType) => void;
  clearData?: boolean;
};

export const StateAndMunicipalitySelect = ({
  defaultValues,
  handleSelectData,
  clearData,
}: stateAndMunicipalitySelectProps) => {
  const [openStateModal, setOpenStateModal] = useState(false);
  const [openMunicipalityModal, setOpenMunicipalityModal] = useState(false);
  const [localState, setLocalState] = useState<CatalogGeoStateType>();
  const [localMunicipality, setLocalMunicipality] =
    useState<CatalogGeoMunicipalityType>();

  useEffect(() => {
    if (defaultValues?.defaultState)
      setLocalState({
        id: defaultValues.idState || 0,
        stateName: defaultValues.defaultState,
      });
    if (defaultValues?.defaultMunicipality)
      setLocalMunicipality({
        id: defaultValues.idMunicipality || 0,
        municipalityName: defaultValues.defaultMunicipality,
      });
  }, []);

  useEffect(() => {
    if (clearData) {
      setLocalState({ id: 0, stateName: "" });
      setLocalMunicipality({ id: 0, municipalityName: "" });
    }
  }, [clearData]);

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

  const onSelectState = (item: CatalogGeoStateType) => {
    setLocalState(item);
    handleSelectData({ idState: item.id, defaultState: item.stateName });
    setLocalMunicipality(undefined);
    setOpenStateModal(false);
  };

  const onSelectMunicipality = (item: CatalogGeoMunicipalityType) => {
    setLocalMunicipality(item);
    if (localState?.stateName)
      handleSelectData({
        idState: localState.id,
        defaultState: localState?.stateName,
        idMunicipality: item.id,
        defaultMunicipality: item.municipalityName,
      });
    setOpenMunicipalityModal(false);
  };

  return (
    <View>
      <View style={MarginStyle.marginT10}>
        <ButtonSelect
          isLoadingData={isLoadingStates}
          label="Seleccione un estado"
          value={localState?.stateName}
          handleOpenModal={() => setOpenStateModal(true)}
        />
      </View>
      <View style={MarginStyle.marginT10}>
        <ButtonSelect
          isLoadingData={isLoadingMunicipalities}
          label="Seleccione un municipio"
          value={localMunicipality?.municipalityName}
          handleOpenModal={() => setOpenMunicipalityModal(true)}
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

export default StateAndMunicipalitySelect;
