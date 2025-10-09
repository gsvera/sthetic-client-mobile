import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE, STATUS_SERVICE } from "@/constants/Constants";
import { ScheduleServiceType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import {
  convertHourToAMorPM,
  openLink,
  openMap,
  openWhatsApp,
} from "@/utils/GeneralUtils";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

type reservationListItemProps = {
  item: ScheduleServiceType;
  handleRejectSchedule: (id: number) => void;
};

export const ReservationListItem = ({
  item,
  handleRejectSchedule,
}: reservationListItemProps) => {
  const rejectService = () => item.id && handleRejectSchedule(item.id);

  const textStatus = (statusSchedule: number | undefined) => {
    switch (statusSchedule) {
      case STATUS_SERVICE.PENDIENT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldDark, ...localStyle.textStatus }}
          >
            Pendiente por confirmar
          </ThemedText>
        );
      case STATUS_SERVICE.CANCEL:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldCancel, ...localStyle.textStatus }}
          >
            Cancelado
          </ThemedText>
        );
      case STATUS_SERVICE.REJECT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldError, ...localStyle.textStatus }}
          >
            Rechazado
          </ThemedText>
        );
      case STATUS_SERVICE.ACCEPT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldAccept, ...localStyle.textStatus }}
          >
            Confirmado
          </ThemedText>
        );
      case STATUS_SERVICE.NOPRESENT:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldCancel, ...localStyle.textStatus }}
          >
            No se presento
          </ThemedText>
        );
      case STATUS_SERVICE.FINALIZED:
        return (
          <ThemedText
            style={{ ...TextStyle.fontBoldFinalized, ...localStyle.textStatus }}
          >
            Finalizado
          </ThemedText>
        );
      default:
        return <></>;
    }
  };

  return (
    <View style={localStyle.scheduleItem}>
      <View style={GridStyle.rowContentCenter}>
        {textStatus(item.statusService)}
      </View>
      {item?.comments && (
        <ThemedText style={{ ...TextStyle.textNote, ...TextStyle.center }}>
          {item.comments}
        </ThemedText>
      )}
      <View style={{ ...localStyle.rowInfo, marginTop: 15 }}>
        <View>
          <ThemedText style={TextStyle.label}>Horario de servicio:</ThemedText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <ThemedText style={TextStyle.value}>
            de {convertHourToAMorPM(item?.startTime)}{" "}
          </ThemedText>

          <ThemedText style={TextStyle.value}>
            a {convertHourToAMorPM(item?.endTime)}
          </ThemedText>
        </View>
      </View>
      <View style={localStyle.rowInfo}>
        <ThemedText style={TextStyle.label}>Servicio: </ThemedText>
        <ThemedText style={TextStyle.title}>{item.nameService}</ThemedText>
      </View>
      <View style={localStyle.rowInfo}>
        <ThemedText style={TextStyle.label}>Proveedor:</ThemedText>
        <ThemedText style={TextStyle.value}>
          {item?.idProvider?.firstName} {item?.idProvider?.lastName}
        </ThemedText>
      </View>
      <View style={localStyle.rowInfo}>
        <ThemedText style={TextStyle.label}>Contactar: </ThemedText>
        <View style={GridStyle.rowSpaceBetween}>
          <TouchableOpacity
            onPress={() => openLink(`tel:${item?.idProvider?.phone}`)}
          >
            <Feather name="phone-outgoing" style={localStyle.iconSocialMedia} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openWhatsApp(
                `${item?.idProvider?.lada.replace("+", "")}${
                  item?.idProvider?.phone
                }`
              )
            }
          >
            <MaterialCommunityIcons
              name="whatsapp"
              style={localStyle.iconSocialMedia}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ThemedText style={TextStyle.label}>Dirección:</ThemedText>
        <View style={localStyle.rowInfo}>
          <View style={{ width: "80%" }}>
            <ThemedText style={localStyle.textAddress}>
              {item.userLocationDTO?.auxState},{" "}
              {item.userLocationDTO?.auxMunicipality},{" "}
              {item.userLocationDTO?.reference}
            </ThemedText>
          </View>
          <View style={localStyle.contentBtnMap}>
            {item?.userLocationDTO?.latitude &&
              item?.userLocationDTO?.longitude && (
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
                    openMap(
                      item?.userLocationDTO?.latitude,
                      item?.userLocationDTO?.longitude
                    )
                  }
                />
              )}
          </View>
        </View>
      </View>
      {(item.statusService === STATUS_SERVICE.PENDIENT ||
        item.statusService === STATUS_SERVICE.ACCEPT) && (
        <View style={localStyle.contentBtnAction}>
          <GeneralButton
            textBtn="Cancelar"
            styleText={TextStyle.fontBoldWhite}
            styleBtn={{
              ...ButtonGeneralStyle.btnCancelSthetic,
              ...localStyle.btn,
            }}
            handleOnPress={rejectService}
          />
        </View>
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  scheduleItem: {
    borderWidth: 0.3,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
  },
  rowInfo: {
    ...GridStyle.rowSpaceBetween,
    marginBottom: 10,
  },
  iconSocialMedia: {
    fontSize: 22,
    color: ThemeColorsSthetic.accentReverse,
    marginLeft: 13,
  },
  btn: {
    width: "49%",
  },
  textStatus: {
    fontSize: 20,
    marginTop: 10,
  },
  contentBtn: { width: "100%" },
  contentBtnAction: {
    ...GridStyle.rowContentCenter,
    marginVertical: 10,
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
  iconItem: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
  },
  textAddress: {
    ...TextStyle.value,
    textAlign: "justify",
    paddingRight: 15,
  },
  contentBtnMap: { width: "20%", ...GridStyle.rowItemsVerticalCenter },
});

export default ReservationListItem;
