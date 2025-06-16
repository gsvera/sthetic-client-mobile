import StartRating from "@/components/Shared/ModalQualification/StartRating";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { QualificationType } from "@/constants/GeneralTypes";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { convertDateToGeneralFormat } from "@/utils/GeneralUtils";
import { StyleSheet, View } from "react-native";

type itemCommentsProvider = {
  item: QualificationType;
};

export const ItemCommentsProvider = ({ item }: itemCommentsProvider) => {
  return (
    <View style={localStyle.itemComment}>
      <View style={localStyle.contentStart}>
        <ThemedText style={localStyle.textDate}>
          {convertDateToGeneralFormat(item.createdAt)}
        </ThemedText>
        <StartRating rating={item.rating} sizeStart={15} />
      </View>
      <ThemedText style={localStyle.nameClient}>{item.nameClient}</ThemedText>
      <ThemedText style={TextStyle.value}>{item.comment}</ThemedText>
    </View>
  );
};

const localStyle = StyleSheet.create({
  itemComment: {
    marginBottom: 10,
    marginHorizontal: "auto",
    width: "100%",
    padding: 5,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  contentStart: {
    ...GridStyle.rowSpaceBetween,
  },
  textDate: {
    ...TextStyle.value,
    fontSize: 14,
  },
  nameClient: {
    ...TextStyle.textMuted,
    fontSize: 13,
  },
});

export default ItemCommentsProvider;
