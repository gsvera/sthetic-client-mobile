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
import { makeAvailablePerDay } from "@/utils/GeneralUtils";
import {
  SelectedDateCalendarType,
  TimeScheduleType,
} from "@/constants/GeneralTypes";
import OptionSchedule from "./OptionSchedule";
import LoadingView from "@/components/Shared/LoadingView";
import { ResponseApi } from "@/api/responseApi";

dayjs.locale("es"); // Esta config se debera establecer a futuro para ingles tambien

type stepCalendarProps = {
  idProvider: string;
  handleSelectAvailableTime: (obj: SelectedDateCalendarType) => void;
};

export const StepCalendar = ({
  idProvider,
  handleSelectAvailableTime,
}: stepCalendarProps) => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [blockTime, setBlockTime] = useState<TimeScheduleType[]>();
  const [selectedDate, setSelectedDate] = useState<SelectedDateCalendarType>({
    dateString: "",
    nameDay: "",
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
      apiCalendar.getTimeCalendarByPovider(idProvider, selectedDate.nameDay),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: !!selectedDate.nameDay,
    },
  });

  useEffect(() => {
    if (listTimes) {
      setBlockTime(
        makeAvailablePerDay(
          listTimes.startTime,
          listTimes.endTime,
          listTimes.duration
        )
      );
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
    <View style={localStyle.stepCalendar}>
      <View>
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
                minDate={dayjs().format("YYYY-MM-DD")}
                markedDates={{
                  [selectedDate.dateString]: {
                    selected: true,
                    selectedColor: ThemeColorsSthetic.accent,
                  },
                }}
              />
            )}
            <View>
              {blockTime?.map((time, index: number) => (
                <OptionSchedule
                  key={index}
                  optionSchedule={time}
                  onSelect={handleSelectTime}
                />
              ))}
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
    height: "100%",
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
    paddingHorizontal: 15,
    height: "84%",
  },
});

export default StepCalendar;
