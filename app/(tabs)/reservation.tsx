import { ReservationList } from "@/components/Modules/ReservationsList";
import { ThemedText } from "@/components/ThemedText";
import { Container, ThemeColorsSthetic } from "@/constants/Colors";
import { FORMAT_DATE, PLATFORM_TYPE } from "@/constants/Constants";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { useSessionProvider } from "@/provider/SessionProvider";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Reservation() {
  const { storeSessionProvider } = useSessionProvider();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [dateSearch, setDateSearch] = useState(
    dayjs().format(FORMAT_DATE.GENERAL_EN)
  );

  const handleChageDate = (date: Date) => {
    setDateSearch(dayjs(date).format(FORMAT_DATE.GENERAL_EN));
    setOpenDatePicker(false);
  };

  return (
    <View style={Container.container}>
      <View style={localStyle.header}>
        <Image
          source={require("@/assets/images/me-logo-header.png")}
          style={localStyle.logo}
        />
      </View>
      <View style={localStyle.headerTitle}>
        <ThemedText
          style={{
            ...TextStyle.titleModal,
            fontSize: Platform.OS === PLATFORM_TYPE.IOS ? 17 : 19,
          }}
        >
          Mis reservaciones del día:
        </ThemedText>
        <TouchableOpacity
          style={localStyle.contentDate}
          onPress={() => setOpenDatePicker(true)}
        >
          <ThemedText style={localStyle.labelDate}>{dateSearch}</ThemedText>
        </TouchableOpacity>
      </View>
      <View
        style={{ height: Platform.OS === PLATFORM_TYPE.IOS ? "75%" : "80%" }}
      >
        {storeSessionProvider?.idUser && (
          <ReservationList
            idUser={storeSessionProvider?.idUser}
            day={dateSearch}
          />
        )}
      </View>
      <DateTimePickerModal
        isVisible={openDatePicker}
        mode="date"
        onConfirm={handleChageDate}
        onCancel={() => setOpenDatePicker(false)}
      />
    </View>
  );
}

const localStyle = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
  },
  contentDate: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  labelDate: {
    ...TextStyle.label,
    fontSize: Platform.OS === PLATFORM_TYPE.IOS ? 15 : 17,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
  },
  headerTitle: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
    marginTop: 10,
    width: "90%",
    marginHorizontal: "auto",
    marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 10,
  },
});
