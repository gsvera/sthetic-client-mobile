import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import apiUserConfig from "@/api/UserConfig";
import ButtonShowMore from "@/components/Shared/ButtonShowMore";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { PLATFORM_TYPE } from "@/constants/Constants";
import { UserLocationType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";

type addressProviderProps = {
  idProvider: string;
};

export const AddressProvider = ({ idProvider }: addressProviderProps) => {
  const [showTextAddress, setShowTextAddress] = useState(false);
  const { data: dataLocation } = useQuery({
    queryKey: [REACT_QUERY_KEYS.provider.getServicesByProvider(idProvider)],
    queryFn: () => apiUserConfig.getLocationByProvider(idProvider),
    ...{
      select: (data: ResponseApi) => data.data.items as UserLocationType,
      enabled: Boolean(idProvider),
    },
  });

  const openMap = (
    latitude: number,
    longitude: number,
    label = "Ubicación"
  ) => {
    const latLng = `${latitude},${longitude}`;

    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latLng}&q=${label}`,
      android: `geo:${latLng}?q=${latLng}(${label})`,
    });

    Linking.openURL(url!).catch((err) =>
      console.error("Error abriendo mapa", err)
    );
  };

  return (
    <View style={MarginStyle.marginT10}>
      <ThemedText style={TextStyle.label}>Dirección:</ThemedText>
      {dataLocation && (
        <View style={localStyle.content}>
          <View style={localStyle.address}>
            <ThemedText
              style={localStyle.textAddress}
              numberOfLines={showTextAddress ? undefined : 2}
            >
              {dataLocation.auxState}, {dataLocation.auxMunicipality},{" "}
              {dataLocation.reference}
            </ThemedText>
            <ButtonShowMore
              show={showTextAddress}
              handlePress={() => setShowTextAddress((v) => !v)}
            />
          </View>
          <View style={localStyle.iconMap}>
            <GeneralButton
              textBtn={
                <View style={localStyle.contentBtn}>
                  <ThemedText style={localStyle.textMap}>Mapa</ThemedText>
                  <Entypo name="location" style={localStyle.iconItem} />
                </View>
              }
              styleBtn={localStyle.btnMap}
              styleText={undefined}
              handleOnPress={() =>
                openMap(dataLocation.latitude, dataLocation.longitude)
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  address: { width: "80%" },
  textAddress: {
    ...TextStyle.descript,
    textAlign: "justify",
  },
  iconItem: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
  },
  content: { ...GridStyle.rowSpaceBetween, width: "100%" },
  iconMap: {
    width: "17%",
  },
  textMap: {
    marginTop: -5,
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  btnMap: {
    ...ButtonGeneralStyle.btnActionSthetic,
    paddingHorizontal: 0,
    height: Platform.OS === PLATFORM_TYPE.IOS ? 55 : 50,
  },
  contentBtn: { width: "100%" },
});

export default AddressProvider;
