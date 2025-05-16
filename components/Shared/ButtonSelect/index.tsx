import { ThemedText } from "@/components/ThemedText";
import { MarginStyle, TextStyle } from "@/constants/StyleComponents";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LoadingView from "../LoadingView";
import { ThemeColorsSthetic } from "@/constants/Colors";

type buttonSelectProps = {
  isLoadingData: boolean;
  label: string;
  value: string | undefined;
  handleOpenModal: () => void;
};

export const ButtonSelect = ({
  isLoadingData,
  label,
  value,
  handleOpenModal,
}: buttonSelectProps) => {
  return (
    <View>
      <ThemedText style={TextStyle.label}>{label}</ThemedText>
      <TouchableOpacity style={localStyle.select} onPress={handleOpenModal}>
        {isLoadingData ? (
          <LoadingView />
        ) : (
          <ThemedText style={TextStyle.valueSelect}>
            {!value ? "Seleccione una opcion" : value}
          </ThemedText>
        )}
      </TouchableOpacity>
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
