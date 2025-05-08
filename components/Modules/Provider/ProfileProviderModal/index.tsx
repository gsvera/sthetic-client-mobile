import apiCatalogUserService from "@/api/CatalogUserService";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiUser } from "@/api/User";
import Badge from "@/components/Shared/Badge";
import GeneralButton from "@/components/Shared/GeneralButton";
import LoadingView from "@/components/Shared/LoadingView";
import { PreviewCard } from "@/components/Shared/PreviewCard";
import ReturnArrow from "@/components/Shared/ReturnArrow";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  modalCustomProps,
  ProjectType,
  ProviderType,
} from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import GalleryProjectModal from "../GalleryProjectModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponseApi } from "@/api/responseApi";
import { PLATFORM_TYPE } from "@/constants/Constants";

export const ProfileProviderModal = ({
  open,
  handleCloseModal,
  idUser,
}: modalCustomProps) => {
  const insets = useSafeAreaInsets();
  const platform = Platform.OS;
  const [showTextDescription, setShowTextDescription] = useState(false);
  const [openModalGalery, setOpenModalGalery] = useState(false);
  const [gallerySelected, setgallerySelected] = useState({
    id: 0,
    nameService: "",
  });

  const { data: dataInfo, isFetching: isFetchingDataInfo } = useQuery({
    queryKey: [REACT_QUERY_KEYS.provider.findProviderByUserId(idUser)],
    queryFn: () => apiUser.findProviderByUser(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items as ProviderType,
      enabled: !!idUser,
    },
  });

  const { data: dataListProyects = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.services.getByUserId(idUser)],
    queryFn: () => apiCatalogUserService.getCatalogServicesByUserId(idUser),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: !!idUser,
    },
  });

  const isLoading = useMemo(() => isFetchingDataInfo, [isFetchingDataInfo]);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleSelectGallery = (data: ProjectType) => {
    setgallerySelected(data);
    setOpenModalGalery(true);
  };

  const handleCloseModalGallery = () => {
    setgallerySelected({ id: 0, nameService: "" });
    setOpenModalGalery(false);
  };
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View
        style={{
          ...localStyle.modal,
          marginTop: platform === PLATFORM_TYPE.ANDROID ? 0 : insets.top,
        }}
      >
        <ReturnArrow handleReturn={handleCloseModal} />
        {isLoading ? (
          <LoadingView />
        ) : (
          <View>
            <View style={localStyle.contentBanner}>
              <Image
                style={{ width: "100%", height: 200 }}
                source={{ uri: dataInfo?.infoCompanyDTO?.companyPicture }}
              />
              <View style={localStyle.contentImgProfile}>
                <Image
                  style={localStyle.profilePicture}
                  source={
                    !dataInfo?.profilePictureB64
                      ? require("@/assets/images/me-logo.png")
                      : {
                          uri: dataInfo?.profilePictureB64,
                        }
                  }
                />
              </View>
            </View>
            <View
              style={{
                ...localStyle.contentInfoCompany,
                ...GridStyle.rowSpaceBetween,
              }}
            >
              <View>
                <GeneralButton
                  textBtn="Agendar cita"
                  styleText={TextStyle.fontBoldWhite}
                  styleBtn={localStyle.btnSchedule}
                  handleOnPress={() => {}}
                />
              </View>
              <View style={localStyle.contentSocialMedia}>
                {dataInfo?.infoCompanyDTO.facebook && (
                  <TouchableOpacity
                    style={localStyle.touchIcon}
                    onPress={() =>
                      openLink(dataInfo?.infoCompanyDTO?.facebook ?? "")
                    }
                  >
                    <Entypo
                      name="facebook"
                      style={localStyle.iconSocialMedia}
                    />
                  </TouchableOpacity>
                )}
                {dataInfo?.infoCompanyDTO.instagram && (
                  <TouchableOpacity
                    style={localStyle.touchIcon}
                    onPress={() =>
                      openLink(dataInfo.infoCompanyDTO.instagram ?? "")
                    }
                  >
                    <Entypo
                      name="instagram"
                      style={localStyle.iconSocialMedia}
                    />
                  </TouchableOpacity>
                )}
                {dataInfo?.infoCompanyDTO.webPage && (
                  <TouchableOpacity
                    style={localStyle.touchIcon}
                    onPress={() =>
                      openLink(dataInfo.infoCompanyDTO.webPage ?? "")
                    }
                  >
                    <MaterialCommunityIcons
                      name="web-check"
                      style={localStyle.iconSocialMedia}
                    />
                  </TouchableOpacity>
                )}
                {dataInfo?.phone && (
                  <TouchableOpacity
                    onPress={() =>
                      openLink(
                        `https://wa.me/${dataInfo.lada.substring(0, 1)}${
                          dataInfo.phone
                        }?text=Hola!%20Te%20encontre%20en%20la%20app%20de%20personal%20care,%20me%20gustaria%20más%20informacion%20acerca%20de%20tus%20servicios`
                      )
                    }
                  >
                    <MaterialCommunityIcons
                      name="whatsapp"
                      style={localStyle.iconSocialMedia}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView style={{ height: "52%" }}>
              <View style={localStyle.contentInfoCompany}>
                <ThemedText style={localStyle.titleCompany}>
                  {dataInfo?.infoCompanyDTO.companyName}
                </ThemedText>
                <ThemedText
                  style={localStyle.description}
                  numberOfLines={showTextDescription ? undefined : 2}
                >
                  {dataInfo?.infoCompanyDTO.generalDescription}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setShowTextDescription((v) => !v)}
                >
                  <ThemedText style={localStyle.toggleText}>
                    {showTextDescription ? "Ver menos ▲" : "Ver más ▼"}
                  </ThemedText>
                </TouchableOpacity>
                <View style={localStyle.contentBadge}>
                  {dataInfo?.typeServices
                    ?.split(",")
                    .map((item, index: number) => (
                      <Badge key={index} text={item} />
                    ))}
                </View>
              </View>
              <View style={localStyle.contentInfoCompany}>
                {dataListProyects?.map((item: ProjectType) => (
                  <PreviewCard
                    key={item.id}
                    element={{ ...item }}
                    handleShowGallery={handleSelectGallery}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
      {gallerySelected && (
        <GalleryProjectModal
          open={openModalGalery}
          handleCloseModal={handleCloseModalGallery}
          project={gallerySelected}
        />
      )}
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    height: "100%",
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 15,
    marginBottom: 5,
    paddingLeft: 10,
  },
  contentBanner: {
    marginBottom: 7,
  },
  contentImgProfile: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  profilePicture: {
    width: 80,
    height: 80,
    zIndex: 1000,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "white",
  },
  contentInfoCompany: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 7,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
  },
  titleCompany: {
    fontSize: 30,
    paddingTop: 10,
    color: ThemeColorsSthetic.textOre,
    fontWeight: "bold",
    marginBottom: 5,
  },
  toggleText: {
    color: ThemeColorsSthetic.accentReverse,
    fontWeight: "bold",
  },
  description: {
    color: ThemeColorsSthetic.muted,
    fontSize: 17,
    fontWeight: "bold",
  },
  contentBadge: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: -3,
    marginTop: 5,
  },
  contentSocialMedia: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  touchIcon: {
    marginRight: 12,
  },
  iconSocialMedia: {
    fontSize: 25,
    color: ThemeColorsSthetic.accentReverse,
  },
  btnSchedule: {
    ...ButtonGeneralStyle.btnSaveSthetic,
    width: 150,
  },
});
export default ProfileProviderModal;
