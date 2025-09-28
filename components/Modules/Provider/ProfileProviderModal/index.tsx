import apiCatalogUserService from "@/api/CatalogUserService";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiUser } from "@/api/User";
import GeneralButton from "@/components/Shared/GeneralButton";
import LoadingView from "@/components/Shared/LoadingView";
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
import { PLATFORM_TYPE, TAB_PROVIDER_SELECTED } from "@/constants/Constants";
import Schedule from "../../Schedule";
import { openLink } from "@/utils/GeneralUtils";
import TabInfoProvider from "./TabInfoProvider";
import TabCommentsProvider from "./TabCommentsProvider";

const msnWhatsApp =
  "Hola! Te encontre en la app de Meredith Care, me gustaria más informacion acerca de tus servicios";

export const ProfileProviderModal = ({
  open,
  handleCloseModal,
  idProvider,
}: modalCustomProps) => {
  const insets = useSafeAreaInsets();
  const platform = Platform.OS;
  const [openModalGalery, setOpenModalGalery] = useState(false);
  const [gallerySelected, setgallerySelected] = useState({
    id: 0,
    nameService: "",
  });
  const [openMakeSchedule, setOpenMakeSchedule] = useState(false);
  const [tabSelected, setTabSelected] = useState<TAB_PROVIDER_SELECTED>(
    TAB_PROVIDER_SELECTED.INFO
  );

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
                source={{ uri: dataInfo?.infoCompanyDTO?.companyPictureUrl }}
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
                    !dataInfo?.profilePicture
                      ? require("@/assets/images/me-logo.png")
                      : {
                          uri: dataInfo?.profilePicture,
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
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
                marginBottom: 7,
                backgroundColor: ThemeColorsSthetic.backgroundLight,
                ...GridStyle.rowSpaceBetween,
              }}
            >
              <GeneralButton
                styleBtn={
                  tabSelected === TAB_PROVIDER_SELECTED.INFO
                    ? localStyle.tabSelected
                    : localStyle.tab
                }
                styleText={TextStyle.fontBoldWhite}
                textBtn="Información"
                handleOnPress={() => setTabSelected(TAB_PROVIDER_SELECTED.INFO)}
              />
              <GeneralButton
                styleBtn={
                  tabSelected === TAB_PROVIDER_SELECTED.COMMENTS
                    ? localStyle.tabSelected
                    : localStyle.tab
                }
                styleText={TextStyle.fontBoldWhite}
                textBtn="Calificación"
                handleOnPress={() =>
                  setTabSelected(TAB_PROVIDER_SELECTED.COMMENTS)
                }
              />
            </View>
            {dataInfo &&
              idProvider &&
              tabSelected === TAB_PROVIDER_SELECTED.INFO && (
                <TabInfoProvider
                  idProvider={idProvider}
                  infoProvider={dataInfo}
                  listProjects={dataListProyects}
                  onSelect={handleSelectGallery}
                />
              )}
            {idProvider && tabSelected === TAB_PROVIDER_SELECTED.COMMENTS && (
              <TabCommentsProvider idProvider={idProvider} />
            )}
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
  tabSelected: {
    ...ButtonGeneralStyle.tabButton,
    width: "49%",
  },
  tab: {
    ...ButtonGeneralStyle.tabButtonDisabled,
    width: "49%",
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
