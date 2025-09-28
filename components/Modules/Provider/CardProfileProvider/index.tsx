import { ThemedText } from "@/components/ThemedText";
import { InfoCompanyType } from "@/constants/GeneralTypes";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Image, StyleSheet, View } from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useMemo, useState } from "react";
import Badge from "@/components/Shared/Badge";
import GeneralButton from "@/components/Shared/GeneralButton";
import ButtonShowMore from "@/components/Shared/ButtonShowMore";
import GlobalRating from "@/components/Shared/GlobalRating";

type cardProfileProviderProps = {
  infoCompany: InfoCompanyType;
  handleSelectProfile: (id: string) => void;
  handleMakeSchedule: (id: string) => void;
};
export const CardProfileProvider = ({
  infoCompany,
  handleSelectProfile,
  handleMakeSchedule,
}: cardProfileProviderProps) => {
  const [showText, setShowText] = useState(false);
  const typeServicesArr = useMemo(
    () => infoCompany.typesServices?.split(","),
    [infoCompany.typesServices]
  );

  return (
    <View style={localStyle.card}>
      <ThemedText style={localStyle.title}>
        {infoCompany.companyName}
      </ThemedText>
      <View style={localStyle.contentImg}>
        <Image
          style={localStyle.image}
          source={{ uri: infoCompany.companyPictureUrl }}
        />
      </View>
      <View>
        <>
          {!!infoCompany?.auxRating && infoCompany?.auxRating > 0 && (
            <ThemedText
              style={{
                flexDirection: "row",
                alignItems: "center",
                ...localStyle.contentDescription,
              }}
            >
              <GlobalRating rating={infoCompany?.auxRating} />
            </ThemedText>
          )}
        </>
      </View>
      <View style={localStyle.contentDescription}>
        <ThemedText
          style={localStyle.description}
          numberOfLines={showText ? undefined : 2}
        >
          {infoCompany.generalDescription}
        </ThemedText>
        <ButtonShowMore
          show={showText}
          handlePress={() => setShowText((v) => !v)}
        />
      </View>
      <View style={localStyle.contentBadge}>
        {typeServicesArr?.map((item, index: number) => (
          <Badge key={index} text={item} />
        ))}
      </View>
      <View style={{ paddingHorizontal: 7 }}>
        <ThemedText style={TextStyle.fontBoldDark}>Ubicación:</ThemedText>
        <ThemedText style={TextStyle.value}>
          {infoCompany.auxState}{" "}
          {infoCompany?.auxMunicipality && `, ` + infoCompany?.auxMunicipality}
        </ThemedText>
      </View>
      <View style={localStyle.contentBtn}>
        <GeneralButton
          textBtn="Agendar cita"
          styleText={{ ...TextStyle.fontBoldWhite, ...localStyle.btnText }}
          styleBtn={{
            ...ButtonGeneralStyle.btnSaveSthetic,
            ...localStyle.btn,
          }}
          handleOnPress={() => handleMakeSchedule(infoCompany.idUser)}
        />
        <GeneralButton
          textBtn="Ver más"
          styleText={{ ...TextStyle.fontBoldWhite, ...localStyle.btnText }}
          styleBtn={{
            ...ButtonGeneralStyle.btnActionSthetic,
            ...localStyle.btn,
          }}
          handleOnPress={() => handleSelectProfile(infoCompany.idUser)}
        />
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: ThemeColorsSthetic.textLight,
    marginBottom: 10,
    paddingVertical: 10,
  },
  title: {
    ...TextStyle.fontBoldDark,
    fontSize: 25,
    paddingTop: 10,
    marginLeft: 7,
    marginBottom: 7,
  },
  contentDescription: {
    marginHorizontal: 7,
    marginBottom: 7,
  },
  description: {
    color: ThemeColorsSthetic.text,
    fontSize: 15,
  },
  contentImg: {
    width: "100%",
    height: 300,
    marginBottom: 7,
  },
  contentBadge: { flexDirection: "row", flexWrap: "wrap", marginLeft: 3 },
  image: {
    width: "100%",
    height: "100%",
  },
  contentBtn: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  btn: {
    width: "47%",
  },
  btnText: {
    fontSize: 17,
  },
  toggleText: {
    color: ThemeColorsSthetic.accentReverse,
    fontWeight: "bold",
  },
});
export default CardProfileProvider;
