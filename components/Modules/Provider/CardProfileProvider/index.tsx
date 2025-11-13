import { ThemedText } from "@/components/ThemedText";
import {
  FavoriteProviderType,
  InfoCompanyType,
} from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useEffect, useMemo, useState } from "react";
import Badge from "@/components/Shared/Badge";
import GeneralButton from "@/components/Shared/GeneralButton";
import ButtonShowMore from "@/components/Shared/ButtonShowMore";
import GlobalRating from "@/components/Shared/GlobalRating";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import { useSessionProvider } from "@/provider/SessionProvider";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";

type cardProfileProviderProps = {
  infoCompany: InfoCompanyType;
  handleSelectProfile: (id: string) => void;
  handleMakeSchedule: (id: string) => void;
  listKeysFavorite: string[];
  requiredLogin?: () => void;
};
export const CardProfileProvider = ({
  infoCompany,
  handleSelectProfile,
  handleMakeSchedule,
  listKeysFavorite,
  requiredLogin,
}: cardProfileProviderProps) => {
  const queryClient = useQueryClient();
  const { storeSessionProvider } = useSessionProvider();
  const { handleNotification } = useNotificationProvider();
  const [showText, setShowText] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { mutate: saveFavoriteProvider } = useMutation({
    mutationFn: (data: FavoriteProviderType) =>
      apiUser.saveFavoriteProvider(data),
    onSuccess: (data: ResponseApi) => handleSaveFavoriteProdider(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: deleteFavoriteProvider } = useMutation({
    mutationFn: (data: FavoriteProviderType) =>
      apiUser.deleteFavoriteProvider(data),
    onSuccess: (data: ResponseApi) => handleSaveFavoriteProdider(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSaveFavoriteProdider = (data: ObjectResponse) => {
    if (!data.error) {
      queryClient.invalidateQueries({
        queryKey: [
          REACT_QUERY_KEYS.provider.getListKeysFavoritesProvider(
            storeSessionProvider?.idUser
          ),
        ],
      });
      handleNotification({ type: TYPE_STATUS.INFO, message: data.message });
    }
  };

  useEffect(() => {
    const keyFavorite = listKeysFavorite.filter(
      (key) => key === infoCompany.idUser
    );
    if (keyFavorite.length > 0) setIsFavorite(true);
  }, []);

  const typeServicesArr = useMemo(
    () => infoCompany.typesServices?.split(","),
    [infoCompany.typesServices]
  );

  const handleSaveFavorite = () => {
    if (requiredLogin) return requiredLogin();

    const myFavorite = {
      id: 0,
      idClient: storeSessionProvider?.idUser,
      idProvider: infoCompany.idUser,
    };
    if (storeSessionProvider?.idUser) {
      if (!isFavorite) saveFavoriteProvider(myFavorite);
      else deleteFavoriteProvider(myFavorite);
      setIsFavorite((v) => !v);
    }
  };

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
      <View style={{ ...GridStyle.rowSpaceBetween, paddingRight: 15 }}>
        <>
          {!!infoCompany?.auxRating && infoCompany?.auxRating > 0 ? (
            <ThemedText
              style={{
                flexDirection: "row",
                alignItems: "center",
                ...localStyle.contentDescription,
              }}
            >
              <GlobalRating rating={infoCompany?.auxRating} />
            </ThemedText>
          ) : (
            <View></View>
          )}
        </>
        <View style={{ paddingLeft: 10 }}>
          <TouchableOpacity onPress={handleSaveFavorite}>
            <Fontisto
              name="favorite"
              style={{
                color: isFavorite
                  ? ThemeColorsSthetic.accent
                  : ThemeColorsSthetic.accentReverse,
                fontSize: 35,
              }}
            />
          </TouchableOpacity>
        </View>
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
