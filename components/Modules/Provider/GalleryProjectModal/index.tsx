import apiCatalogUserService from "@/api/CatalogUserService";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import LoadingView from "@/components/Shared/LoadingView";
import ReturnArrow from "@/components/Shared/ReturnArrow";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE } from "@/constants/Constants";
import {
  DetailProjectType,
  modalCustomProps,
  ProjectType,
} from "@/constants/GeneralTypes";
import { useQuery } from "@tanstack/react-query";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type galleryProjectModalProps = modalCustomProps & {
  project: ProjectType;
};

export const GalleryProjectModal = ({
  open,
  handleCloseModal,
  project,
}: galleryProjectModalProps) => {
  const insets = useSafeAreaInsets();
  const platform = Platform.OS;
  const { data: listImg = [], isFetching: isFetchingListImg } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.services.getById],
    queryFn: () =>
      apiCatalogUserService.getCatalogServiceDetailByIdPorject(project.id),
    ...{
      select: (data: ResponseApi) => data.data.items as DetailProjectType[],
      enabled: !!project.id,
    },
  });
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <View
        style={{
          ...localStyle.modal,
          marginTop: platform === PLATFORM_TYPE.ANDROID ? 0 : insets.top,
        }}
      >
        <ReturnArrow handleReturn={handleCloseModal} />
        <View>
          <ThemedText style={localStyle.title}>
            {project.nameService}
          </ThemedText>
        </View>
        {isFetchingListImg ? (
          <LoadingView />
        ) : (
          <ScrollView style={localStyle.contentImgList}>
            {listImg.map((item, index: number) => (
              <View key={index} style={localStyle.contentImg}>
                <Image
                  style={localStyle.imgDetail}
                  source={{ uri: item.fileBase64 }}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modal: {
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    height: "100%",
  },
  title: {
    paddingTop: 5,
    marginBottom: 10,
    textAlign: "center",
    color: ThemeColorsSthetic.textOre,
    fontWeight: "bold",
    fontSize: 30,
  },
  contentImgList: {
    height: "80%",
  },
  contentImg: {
    width: "100%",
    height: 350,
    marginVertical: 7,
    alignItems: "center",
    backgroundColor: ThemeColorsSthetic.backgroundLight,
    padding: 5,
  },
  imgDetail: {
    width: "100%",
    height: "100%",
  },
});

export default GalleryProjectModal;
