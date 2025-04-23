import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { convertCurrency } from "@/utils/GeneralUtils";
import { Image, StyleSheet, View } from "react-native";
import GeneralButton from "../GeneralButton";
import { ProjectType } from "@/constants/GeneralTypes";

type previeCardProps = {
  element: ProjectType;
  handleShowGallery: (element: ProjectType) => void;
};

export const PreviewCard = ({
  element,
  handleShowGallery,
}: previeCardProps) => {
  const handleShowMore = () => {
    handleShowGallery(element);
  };
  return (
    <View style={localStyle.previewCard}>
      <Image
        style={localStyle.previewCardImage}
        source={{ uri: element?.catalogUserServiceDetailDTO?.fileBase64 }}
      />
      <ThemedText style={localStyle.titlePreviewCard}>
        {element.nameService}
      </ThemedText>
      <View style={localStyle.rowAttributes}>
        <View>
          <ThemedText style={localStyle.label}>Archivos:</ThemedText>
          <ThemedText style={localStyle.value}>
            {element.totalElement}
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyle.label}>Rango de precios:</ThemedText>
          <ThemedText style={localStyle.value}>
            {element.minPrice && convertCurrency(element.minPrice)} -{" "}
            {element.maxPrice && convertCurrency(element.maxPrice)}
          </ThemedText>
        </View>
      </View>
      <GeneralButton
        styleBtn={localStyle.btnEdit}
        textBtn="Ver mas"
        styleText={TextStyle.fontBoldWhite}
        handleOnPress={handleShowMore}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  previewCard: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "white",
    paddingBottom: 15,
  },
  previewCardImage: { width: "100%", height: 250, marginBottom: 7 },
  titlePreviewCard: {
    color: ThemeColorsSthetic.text,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  label: {
    ...TextStyle.bold,
    color: ThemeColorsSthetic.textLabels,
  },
  value: {
    color: ThemeColorsSthetic.text,
    textAlign: "center",
  },
  btnEdit: {
    ...ButtonGeneralStyle.btnActionSthetic,
    width: "60%",
    marginTop: 10,
    marginHorizontal: "auto",
  },
  rowAttributes: {
    ...GridStyle.rowSpaceBetween,
    paddingHorizontal: 10,
  },
});

export default PreviewCard;
