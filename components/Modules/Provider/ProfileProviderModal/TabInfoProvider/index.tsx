import Badge from "@/components/Shared/Badge";
import ButtonShowMore from "@/components/Shared/ButtonShowMore";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { MarginStyle, TextStyle } from "@/constants/StyleComponents";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AddressProvider from "../../AddressProvider";
import { ProjectType, ProviderType } from "@/constants/GeneralTypes";
import PreviewCard from "@/components/Shared/PreviewCard";

type tabInfoProviderProps = {
  idProvider: string;
  infoProvider: ProviderType;
  listProjects: [];
  onSelect: (data: ProjectType) => void;
};

export const TabInfoProvider = ({
  idProvider,
  infoProvider,
  listProjects,
  onSelect,
}: tabInfoProviderProps) => {
  const [showTextDescription, setShowTextDescription] = useState(false);
  return (
    <ScrollView style={{ height: "49%" }}>
      <View style={localStyle.contentInfoCompany}>
        <View>
          <ThemedText style={localStyle.titleCompany}>
            {infoProvider?.infoCompanyDTO.companyName}
          </ThemedText>
          <ThemedText
            style={localStyle.description}
            numberOfLines={showTextDescription ? undefined : 2}
          >
            {infoProvider?.infoCompanyDTO.generalDescription}
          </ThemedText>
          <ButtonShowMore
            show={showTextDescription}
            handlePress={() => setShowTextDescription((v) => !v)}
          />
        </View>
        <View style={MarginStyle.marginT10}>
          <ThemedText style={TextStyle.label}>Categorias:</ThemedText>
          <View style={localStyle.contentBadge}>
            {infoProvider?.typeServices
              ?.split(",")
              .map((item, index: number) => (
                <Badge key={index} text={item} />
              ))}
          </View>
        </View>
        {idProvider && <AddressProvider idProvider={idProvider} />}
      </View>
      <View style={localStyle.contentInfoCompany}>
        {listProjects?.map((item: ProjectType) => (
          <PreviewCard
            key={item.id}
            element={{ ...item }}
            handleShowGallery={onSelect}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const localStyle = StyleSheet.create({
  contentInfoCompany: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 7,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  description: {
    color: ThemeColorsSthetic.text,
    fontSize: 15,
  },
  titleCompany: {
    fontSize: 23,
    color: ThemeColorsSthetic.textOre,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contentBadge: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: -3,
    marginTop: 5,
  },
});

export default TabInfoProvider;
