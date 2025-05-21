import { ThemedText } from "@/components/ThemedText";
import { GridStyle, MarginStyle, TextStyle } from "@/constants/StyleComponents";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import LoadingView from "../LoadingView";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { SimpleLineIcons } from "@expo/vector-icons";

type buttonSelectProps = {
  isLoadingData: boolean;
  label: string;
  value: string | undefined;
  handleOpenModal: () => void;
  clearData?: () => void;
};

export const ButtonSelect = ({
  isLoadingData,
  label,
  value,
  handleOpenModal,
  clearData,
}: buttonSelectProps) => {
  const handleClearSelect = () => clearData?.();
  return (
    <View>
      <ThemedText style={TextStyle.label}>{label}</ThemedText>
      <View style={localStyle.select}>
        {isLoadingData ? (
          <LoadingView />
        ) : (
          <View
            style={{
              ...GridStyle.rowSpaceBetween,
              ...GridStyle.rowItemsVerticalCenter,
            }}
          >
            <TouchableOpacity onPress={handleOpenModal}>
              <ThemedText style={TextStyle.valueSelect}>
                {!value ? "Seleccione una opcion" : value}
              </ThemedText>
            </TouchableOpacity>
            <Pressable onPress={handleClearSelect}>
              <SimpleLineIcons
                name="close"
                size={20}
                color={ThemeColorsSthetic.accentReverse}
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  select: {
    ...MarginStyle.marginT10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: ThemeColorsSthetic.backgroundStrong,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
});

export default ButtonSelect;
