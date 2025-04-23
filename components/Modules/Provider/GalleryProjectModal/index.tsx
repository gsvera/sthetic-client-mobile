import apiCatalogUserService from "@/api/CatalogUserService";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
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
      select: (data: ResponseAPi) => data.data.items as DetailProjectType[],
      enabled: !!project.id,
    },
  });
  return (
    <Modal animationType="slide" transparent={false} visible={open}>
      <ReturnArrow handleReturn={handleCloseModal} />
      <View>
        <ThemedText style={localStyle.title}>{project.nameService}</ThemedText>
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
    </Modal>
  );
};

const localStyle = StyleSheet.create({
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
    backgroundColor: ThemeColorsSthetic.backgroundLigth,
    padding: 5,
  },
  imgDetail: {
    width: "100%",
    height: "100%",
  },
});

export default GalleryProjectModal;
