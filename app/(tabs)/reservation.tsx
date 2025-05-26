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
          source={require("@/assets/images/me-text-logo.png")}
          style={localStyle.logo}
        />
      </View>
      <ThemedText style={{ ...TextStyle.titleModal, marginTop: 10 }}>
        Mis reservaciones
      </ThemedText>
      <View style={GridStyle.rowContentCenter}>
        <TouchableOpacity
          style={localStyle.contentDate}
          onPress={() => setOpenDatePicker(true)}
        >
          <ThemedText style={localStyle.labelDate}>{dateSearch}</ThemedText>
        </TouchableOpacity>
      </View>
      <View
        style={{ height: Platform.OS === PLATFORM_TYPE.IOS ? "70%" : "74%" }}
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
    width: 150,
    height: 50,
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
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  labelDate: {
    ...TextStyle.label,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
  },
});
