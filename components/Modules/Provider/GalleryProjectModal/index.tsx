import apiCatalogUserService from "@/api/CatalogUserService";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import LoadingView from "@/components/Shared/LoadingView";
import ReturnArrow from "@/components/Shared/ReturnArrow";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  DetailProjectType,
  modalCustomProps,
  ProjectType,
} from "@/constants/GeneralTypes";
import { useQuery } from "@tanstack/react-query";
import { Image, Modal, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type galleryProjectModalProps = modalCustomProps & {
  project: ProjectType;
};

export const GalleryProjectModal = ({
  open,
  handleCloseModal,
  project,
}: galleryProjectModalProps) => {
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleCloseModal}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView
        style={{
          ...localStyle.modal,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: ThemeColorsSthetic.backgroundLight,
          }}
        >
          <ReturnArrow handleReturn={handleCloseModal} />
          <View>
            <ThemedText style={localStyle.title}>
              {project.nameService}
            </ThemedText>
          </View>
          <View style={localStyle.contentImgList}>
            {isFetchingListImg ? (
              <LoadingView />
            ) : (
              <ScrollView style={{ flexGrow: 1 }}>
                {listImg.map((item, index: number) => (
                  <View key={index} style={localStyle.contentImg}>
                    <Image
                      style={localStyle.imgDetail}
                      source={{ uri: item.fileUrl }}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  modal: {
    backgroundColor: ThemeColorsSthetic.shadowBackground,
    flex: 1,
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
    flex: 1,
  },
  contentImg: {
    width: "100%",
    maxHeight: 500,
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
