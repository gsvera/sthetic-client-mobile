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
  MarginStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
import Schedule from "../../Schedule";
import ButtonShowMore from "@/components/Shared/ButtonShowMore";
import AddressProvider from "../AddressProvider";
import { openLink } from "@/utils/GeneralUtils";

const msnWhatsApp =
  "Hola! Te encontre en la app de Meredith Care, me gustaria más informacion acerca de tus servicios";

export const ProfileProviderModal = ({
  open,
  handleCloseModal,
  idProvider,
}: modalCustomProps) => {
  const insets = useSafeAreaInsets();
  const platform = Platform.OS;
  const [showTextDescription, setShowTextDescription] = useState(false);
  const [openModalGalery, setOpenModalGalery] = useState(false);
  const [gallerySelected, setgallerySelected] = useState({
    id: 0,
    nameService: "",
  });
  const [openMakeSchedule, setOpenMakeSchedule] = useState(false);

  const { data: dataInfo, isFetching: isFetchingDataInfo } = useQuery({
    queryKey: [REACT_QUERY_KEYS.provider.findProviderByUserId(idProvider)],
    queryFn: () => apiUser.findProviderByUser(idProvider),
    ...{
      select: (data: ResponseApi) => data.data.items as ProviderType,
      enabled: Boolean(idProvider),
    },
  });

  const { data: dataListProyects = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.services.getByUserId(idProvider)],
    queryFn: () => apiCatalogUserService.getCatalogServicesByUserId(idProvider),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: Boolean(idProvider),
    },
  });

  const isLoading = useMemo(() => isFetchingDataInfo, [isFetchingDataInfo]);

  const handleSelectGallery = (data: ProjectType) => {
    setgallerySelected(data);
    setOpenModalGalery(true);
  };

  const handleCloseModalGallery = () => {
    setgallerySelected({ id: 0, nameService: "" });
    setOpenModalGalery(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
    >
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
                <View style={localStyle.nameProvider}>
                  <ThemedText
                    style={{ ...TextStyle.fontGoldTitle, fontSize: 14 }}
                  >
                    {dataInfo?.firstName} {dataInfo?.lastName}
                  </ThemedText>
                </View>
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
                  handleOnPress={() => setOpenMakeSchedule(true)}
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
                {dataInfo?.phone && dataInfo.lada && (
                  <TouchableOpacity
                    style={localStyle.touchIcon}
                    onPress={() =>
                      openLink(
                        `https://wa.me/${dataInfo.lada.substring(0, 1)}${
                          dataInfo.phone
                        }?text=${encodeURIComponent(msnWhatsApp)}`
                      )
                    }
                  >
                    <MaterialCommunityIcons
                      name="whatsapp"
                      style={localStyle.iconSocialMedia}
                    />
                  </TouchableOpacity>
                )}
                {dataInfo?.phone && (
                  <TouchableOpacity
                    style={localStyle.touchIcon}
                    onPress={() => openLink(`tel:${dataInfo.phone}`)}
                  >
                    <Feather
                      name="phone-outgoing"
                      style={localStyle.iconSocialMedia}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView style={{ height: "54%" }}>
              <View style={localStyle.contentInfoCompany}>
                <View>
                  <ThemedText style={localStyle.titleCompany}>
                    {dataInfo?.infoCompanyDTO.companyName}
                  </ThemedText>
                  <ThemedText
                    style={localStyle.description}
                    numberOfLines={showTextDescription ? undefined : 2}
                  >
                    {dataInfo?.infoCompanyDTO.generalDescription}
                  </ThemedText>
                  <ButtonShowMore
                    show={showTextDescription}
                    handlePress={() => setShowTextDescription((v) => !v)}
                  />
                </View>
                <View style={MarginStyle.marginT10}>
                  <ThemedText style={TextStyle.label}>Categorias:</ThemedText>
                  <View style={localStyle.contentBadge}>
                    {dataInfo?.typeServices
                      ?.split(",")
                      .map((item, index: number) => (
                        <Badge key={index} text={item} />
                      ))}
                  </View>
                </View>
                {idProvider && <AddressProvider idProvider={idProvider} />}
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
      {!!openMakeSchedule && idProvider && (
        <Schedule
          open={openMakeSchedule}
          handleCloseModal={() => setOpenMakeSchedule(false)}
          idProvider={idProvider}
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
  nameProvider: {
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginRight: 5,
    borderRadius: 5,
    borderColor: ThemeColorsSthetic.accent,
    borderWidth: 0.5,
  },
  contentImgProfile: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 23,
    paddingTop: 10,
    color: ThemeColorsSthetic.textOre,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: ThemeColorsSthetic.text,
    fontSize: 15,
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
    color: ThemeColorsSthetic.action,
  },
  btnSchedule: {
    ...ButtonGeneralStyle.btnSaveSthetic,
    width: 150,
  },
});
export default ProfileProviderModal;
