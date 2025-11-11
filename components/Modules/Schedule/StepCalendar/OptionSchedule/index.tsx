import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TimeScheduleType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertHourToAMorPM } from "@/utils/GeneralUtils";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type optionScheduleProps = {
  optionSchedule: TimeScheduleType;
  onSelect: (obj: TimeScheduleType) => void;
};

export const OptionSchedule = ({
  optionSchedule,
  onSelect,
}: optionScheduleProps) => {
  return (
    <View style={localStyle.optionSchedule}>
      <TouchableOpacity onPress={() => onSelect(optionSchedule)}>
        <View style={localStyle.content}>
          <View style={GridStyle.rowSpaceBetween}>
            <ThemedText style={TextStyle.value}>
              {convertHourToAMorPM(optionSchedule.start)}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const localStyle = StyleSheet.create({
  optionSchedule: {
    marginVertical: 7,
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 4,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    margin: 7,
  },
  content: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
  },
  selectBtn: {
    ...TextStyle.fontBoldWhite,
    fontSize: 13,
  },
});

export default OptionSchedule;
