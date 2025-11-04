import { ThemedText } from "@/components/ThemedText";
import { TextStyle } from "@/constants/StyleComponents";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { ThemeColorsSthetic } from "@/constants/Colors";
import "dayjs/locale/es";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiCalendar } from "@/api/Calendar";
import {
  SelectedDateCalendarType,
  TimeScheduleType,
} from "@/constants/GeneralTypes";
import OptionSchedule from "./OptionSchedule";
import LoadingView from "@/components/Shared/LoadingView";
import { ResponseApi } from "@/api/responseApi";
import EmptyView from "@/components/Shared/EmptyView";
import { FORMAT_DATE } from "@/constants/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

dayjs.locale("es"); // Esta config se debera establecer a futuro para ingles tambien

type stepCalendarProps = {
  idProvider: string;
  handleSelectAvailableTime: (obj: SelectedDateCalendarType) => void;
};

export const StepCalendar = ({
  idProvider,
  handleSelectAvailableTime,
}: stepCalendarProps) => {
  const insets = useSafeAreaInsets();
  const [showCalendar, setShowCalendar] = useState(true);
  const [blockTime, setBlockTime] = useState<TimeScheduleType[]>([]);
  const [selectedDate, setSelectedDate] = useState<SelectedDateCalendarType>({
    dateString: dayjs().add(1, "days").format(FORMAT_DATE.GENERAL_EN),
    nameDay: dayjs().add(1, "days").format("dddd"),
    time: { start: "", end: "" },
  });

  const { data: listTimes, isLoading: isLoadingListTime } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.calendar.calendarByUser.getTimeCalendarByProvider(
        idProvider
      ),
      selectedDate.nameDay,
    ],
    queryFn: () =>
      apiCalendar.getTimeCalendarByPovider(
        idProvider,
        selectedDate.nameDay,
        selectedDate.dateString
      ),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: !!selectedDate.nameDay,
    },
  });

  useEffect(() => {
    if (listTimes) {
      setBlockTime(listTimes);
    }
  }, [listTimes]);

  const handleSelectedDate = (day: string) => {
    setSelectedDate({
      dateString: day,
      nameDay: dayjs(day).format("dddd"),
      time: { start: "", end: "" },
    });
    setShowCalendar(false);
  };

  const handleSelectTime = (time: TimeScheduleType) => {
    setSelectedDate((prev) => ({ ...prev, time }));
    handleSelectAvailableTime({ ...selectedDate, time });
  };

  return (
    <View
      style={{
        ...localStyle.stepCalendar,
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={localStyle.dateLabel}
          onPress={() => setShowCalendar((v) => !v)}
        >
          <ThemedText style={TextStyle.label}>
            Seleccione una fecha:{" "}
          </ThemedText>
          <ThemedText style={localStyle.dateSelected}>
            {selectedDate.dateString}
          </ThemedText>
        </Pressable>
        {isLoadingListTime ? (
          <LoadingView />
        ) : (
          <ScrollView style={localStyle.contentScheduleTime}>
            {showCalendar && (
              <Calendar
                onDayPress={(day: any) => handleSelectedDate(day.dateString)}
                minDate={dayjs().add(1, "day").format(FORMAT_DATE.GENERAL_EN)}
                markedDates={{
                  [selectedDate.dateString]: {
                    selected: true,
                    selectedColor: ThemeColorsSthetic.accent,
                  },
                }}
              />
            )}
            <View>
              {blockTime.length > 0
                ? blockTime?.map((time, index: number) => (
                    <OptionSchedule
                      key={index}
                      optionSchedule={time}
                      onSelect={handleSelectTime}
                    />
                  ))
                : selectedDate.dateString !== "" && (
                    <View style={{ marginTop: 100 }}>
                      <EmptyView message="No hay disponibilidad en esta fecha" />
                    </View>
                  )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export const localStyle = StyleSheet.create({
  stepCalendar: {
    marginTop: 15,
    flex: 1,
  },
  dateLabel: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  dateSelected: {
    ...TextStyle.value,
    fontWeight: "bold",
  },
  contentScheduleTime: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
});

export default StepCalendar;
