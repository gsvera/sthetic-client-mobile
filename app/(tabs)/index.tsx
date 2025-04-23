import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import apiTypeService from "@/api/TypeService";
import { apiUser } from "@/api/User";
import CardProfileProvider from "@/components/Modules/Provider/CardProfileProvider";
import { ProfileProviderModal } from "@/components/Modules/Provider/ProfileProviderModal";
import SearchModal from "@/components/Modules/Provider/SearchModal";
import LoadingView from "@/components/Shared/LoadingView";
import { ThemedText } from "@/components/ThemedText";

import { ThemeColorsSthetic } from "@/constants/Colors";
import { TypesServicesType } from "@/constants/GeneralTypes";
import { TextStyle } from "@/constants/StyleComponents";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";

export default function Home() {
  const [filterParams, setFilterParams] = useState({
    page: 0,
    word: "",
    typeService: "",
  });
  const [dataListProvider, setDataListProvider] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openProfileProviderModal, setOpenProfileProviderModal] =
    useState(false);
  const [profileSelected, setProfileSelected] = useState("");

  const {
    data: listProvider = [],
    refetch: refetchListprovider,
    isFetching: isFetchingListProvider,
  } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.provider.searchProvider("search-provider"),
      filterParams,
    ],
    queryFn: () => apiUser.searchProvider({ ...filterParams, page }),
    ...{
      select: (data: ResponseAPi) => data.data.items,
    },
  });

  const { data: listType = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.typeServices.getAll("get-all")],
    queryFn: () => apiTypeService.getAll(),
    ...{
      select: (data: ResponseAPi) => data.data.items as TypesServicesType[],
    },
  });

  useEffect(() => {
    if (listProvider?.items && Array.isArray(listProvider?.items)) {
      setDataListProvider((prev: any) => {
        const existingIds = new Set(prev.map((item: any) => item.id));
        const filteredNew = listProvider?.items.filter(
          (item: any) => !existingIds.has(item.id)
        );
        return [...prev, ...filteredNew];
      });

      if (listProvider.totalPages >= page + 1) {
        setPage((n) => n + 1);
      }
    }
  }, [listProvider]);

  const handleSearch = (data: any) => {
    if (
      filterParams.typeService !== data?.typeService?.join(",") ||
      filterParams.word !== data.word
    ) {
      setDataListProvider([]);
      setFilterParams({
        ...data,
        typeService: data?.typeService && data?.typeService.join(","),
      });
      setPage(0);
    }
    setOpenSearchModal(false);
  };

  const handleClearFilter = (data: any) => {
    setDataListProvider([]);
    setPage(0);
    setFilterParams(data);
    setOpenSearchModal(false);
  };

  const fetchData = () => {
    refetchListprovider();
  };

  const handleOnSelectProfile = (idUser: string) => {
    setProfileSelected(idUser);
    setOpenProfileProviderModal(true);
  };

  const handleCloseProfileProviderModal = () => {
    setProfileSelected("");
    setOpenProfileProviderModal(false);
  };

  return (
    <View>
      <View style={localStyle.header}>
        <ThemedText style={localStyle.title}>Personal Care</ThemedText>
        <Pressable
          style={localStyle.inputSearch}
          onPress={() => setOpenSearchModal((v) => !v)}
        >
          <ThemedText style={{ color: ThemeColorsSthetic.text }}>
            Buscar
          </ThemedText>
          <Feather
            name="search"
            size={20}
            color={ThemeColorsSthetic.accentReverse}
          />
        </Pressable>
      </View>
      <View style={{ height: "92%" }}>
        {isFetchingListProvider && (
          <LoadingView styleProps={localStyle.loader} />
        )}
        <FlatList
          data={Array.isArray(dataListProvider) ? dataListProvider : []}
          keyExtractor={(item, index) =>
            item?.id?.toString?.() || index.toString()
          }
          renderItem={({ item }) => {
            if (!item) return null;
            return (
              <CardProfileProvider
                key={item.id}
                id={item.id}
                idUser={item.userDTO.id}
                companyName={item.companyName}
                generalDescription={item.generalDescription}
                companyPicture={item.companyPicture}
                typesServices={item.typesServices}
                handleSelectProfile={handleOnSelectProfile}
              />
            );
          }}
          onEndReached={fetchData}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<ThemedText>No hay datos disponibles</ThemedText>}
        />
      </View>
      <SearchModal
        open={openSearchModal}
        handleCloseModal={() => setOpenSearchModal((v) => !v)}
        listType={listType}
        handleFilter={handleSearch}
        handleClearFilter={handleClearFilter}
      />
      <ProfileProviderModal
        open={openProfileProviderModal}
        handleCloseModal={handleCloseProfileProviderModal}
        idUser={profileSelected}
      />
    </View>
  );
}

const localStyle = StyleSheet.create({
  header: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    color: ThemeColorsSthetic.textOre,
    fontSize: 30,
    fontWeight: "bold",
    paddingTop: 5,
    marginLeft: 5,
  },
  inputSearch: {
    ...TextStyle.value,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 30,
    width: 100,
  },
  loader: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
