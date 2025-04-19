import { ThemedText } from "@/components/ThemedText";
import { InfoCompanyType } from "@/constants/GeneralTypes";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useMemo, useState } from "react";
import Badge from "@/components/Shared/Badge";
import GeneralButton from "@/components/Shared/GeneralButton";

export const CardProfileProvider = ({
  id,
  idUser,
  companyName,
  companyPicture,
  generalDescription,
  typesServices,
}: InfoCompanyType) => {
  const [showTex, setShowText] = useState(false);
  const typeServicesArr = useMemo(
    () => typesServices?.split(","),
    [typesServices]
  );

  return (
    <View style={localStyle.card}>
      <ThemedText style={localStyle.title}>{companyName}</ThemedText>
      <View style={localStyle.contentImg}>
        <Image style={localStyle.image} source={{ uri: companyPicture }} />
      </View>
      <View>
        {/* <AntDesign name="hearto" size={24} color="black" /> */}
        {/* <AntDesign name="heart" size={24} color="black" /> */}
      </View>
      <View style={localStyle.contentDescription}>
        <ThemedText
          style={localStyle.description}
          numberOfLines={showTex ? undefined : 2}
        >
          {generalDescription}
        </ThemedText>
        <TouchableOpacity onPress={() => setShowText((v) => !v)}>
          <ThemedText style={localStyle.toggleText}>
            {showTex ? "Ver menos ▲" : "Ver más ▼"}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={localStyle.contentBadge}>
        {typeServicesArr?.map((item, index: number) => (
          <Badge key={index} text={item} />
        ))}
      </View>
      <View style={localStyle.contentBtn}>
        <GeneralButton
          textBtn="Agendar cita"
          styleText={{ ...TextStyle.fontBoldWhite, ...localStyle.btnText }}
          styleBtn={{
            ...ButtonGeneralStyle.btnUpdateSthetic,
            ...localStyle.btn,
          }}
          handleOnPress={() => {}}
        />
        <GeneralButton
          textBtn="Ver más"
          styleText={{ ...TextStyle.fontBoldWhite, ...localStyle.btnText }}
          styleBtn={{
            ...ButtonGeneralStyle.btnActionSthetic,
            ...localStyle.btn,
          }}
          handleOnPress={() => {}}
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
    color: ThemeColorsSthetic.muted,
    fontSize: 17,
    fontWeight: "bold",
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
    marginTop: 8,
    color: ThemeColorsSthetic.accentReverse,
    fontWeight: "bold",
  },
});
export default CardProfileProvider;
