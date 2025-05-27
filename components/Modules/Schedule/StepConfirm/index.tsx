import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import { apiUser } from "@/api/User";
import apiUserConfig from "@/api/UserConfig";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE } from "@/constants/Constants";
import {
  ScheduleServiceType,
  UserLocationType,
  UserType,
} from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertCurrency, convertHourToAMorPM } from "@/utils/GeneralUtils";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

type stepConfirmProps = {
  idProvider: string;
  scheduleService: ScheduleServiceType;
  disableBtnSave: boolean;
  onSave: () => void;
};

export const StepConfirm = ({
  idProvider,
  scheduleService,
  disableBtnSave,
  onSave,
}: stepConfirmProps) => {
  const platform = Platform.OS;
  const { data: dataUser } = useQuery({
    queryKey: [REACT_QUERY_KEYS.user.getDataUser("personal-information")],
    queryFn: () => apiUser.getDataUser(),
    ...{
      select: (data: ResponseApi) => data.data.items as UserType,
    },
  });

  const { data: infoLocation } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getLocationByProvider(idProvider)],
    queryFn: () => apiUserConfig.getLocationByProvider(idProvider),
    ...{
      select: (data: ResponseApi) => data.data.items as UserLocationType,
      enabled: !!idProvider,
    },
  });

  return (
    <View style={{ height: "98%" }}>
      <ScrollView>
        <View style={localStyle.section}>
          <View style={localStyle.titleContent}>
            <ThemedText style={TextStyle.titleRegister}>
              Información personal
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Nomber:</ThemedText>
            <ThemedText style={localStyle.value}>
              {dataUser?.firstName} {dataUser?.lastName}
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Email:</ThemedText>
            <ThemedText style={localStyle.value}>{dataUser?.email}</ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Telefono:</ThemedText>
            <ThemedText style={localStyle.value}>{dataUser?.phone}</ThemedText>
          </View>
        </View>
        <View style={localStyle.section}>
          <View style={localStyle.titleContent}>
            <ThemedText style={TextStyle.titleRegister}>
              Información de reserva
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Fecha de reserva:</ThemedText>
            <ThemedText style={localStyle.value}>
              {scheduleService.scheduleDate}
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Hora inicio:</ThemedText>
            <ThemedText style={localStyle.value}>
              {convertHourToAMorPM(scheduleService.startTime)}
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Hora fin:</ThemedText>
            <ThemedText style={localStyle.value}>
              {convertHourToAMorPM(scheduleService.endTime)}
            </ThemedText>
          </View>
          <View
            style={{
              ...localStyle.row,
              marginRight: platform === PLATFORM_TYPE.ANDROID ? 15 : 35,
            }}
          >
            <ThemedText style={TextStyle.label}>Lugar:</ThemedText>
            <ThemedText style={{ ...localStyle.value, marginLeft: 7 }}>
              <Entypo
                name="location"
                size={24}
                color={ThemeColorsSthetic.accentReverse}
              />{" "}
              {infoLocation?.auxState}, {infoLocation?.auxMunicipality},{" "}
              {infoLocation?.reference}
            </ThemedText>
          </View>
        </View>
        <View style={localStyle.section}>
          <View style={localStyle.titleContent}>
            <ThemedText style={TextStyle.titleRegister}>
              Información de servicio
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Servicio:</ThemedText>
            <ThemedText style={localStyle.value}>
              {scheduleService.nameService}
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>
              Cantidad de personas:
            </ThemedText>
            <ThemedText style={localStyle.value}>
              {scheduleService.people}
            </ThemedText>
          </View>
          <View style={localStyle.row}>
            <ThemedText style={TextStyle.label}>Costo:</ThemedText>
            <ThemedText style={localStyle.value}>
              {convertCurrency(scheduleService.amount)}
            </ThemedText>
          </View>
        </View>
        <View style={localStyle.contentBtn}>
          <GeneralButton
            styleText={TextStyle.fontBoldWhite}
            textBtn="Confirmar"
            styleBtn={ButtonGeneralStyle.btnSaveSthetic}
            handleOnPress={onSave}
            disabledBtn={disableBtnSave}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const localStyle = StyleSheet.create({
  section: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    padding: 15,
    marginTop: 15,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: ThemeColorsSthetic.backgroundStrong,
  },
  row: {
    ...GridStyle.rowSpaceBetween,
    marginBottom: 5,
  },
  titleContent: {
    marginBottom: 10,
  },
  value: {
    ...TextStyle.value,
    fontWeight: "bold",
  },

  contentBtn: {
    width: "90%",
    marginHorizontal: "auto",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default StepConfirm;
