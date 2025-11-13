import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import apiTypeService from "@/api/TypeService";
import { apiUser } from "@/api/User";
import ListProvider from "@/components/Modules/Provider/ListProvider";
import SearchModal from "@/components/Modules/Provider/SearchModal";
import ModalRequiredLogin from "@/components/Shared/ModalRequiredLogin";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  FilterSearchParamsType,
  TypesServicesType,
} from "@/constants/GeneralTypes";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Preview() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [requiredLogin, setRequiredLogin] = useState(false);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [page, setPage] = useState(0);
  const [force, setForce] = useState(false); // auxiliar para refrescar useEffect para rellenar items
  const [dataListProvider, setDataListProvider] = useState<any[]>([]);
  const [filterParams, setFilterParams] = useState<FilterSearchParamsType>({
    page: 0,
    word: "",
    typeService: "",
    defaultState: "",
    defaultMunicipality: "",
  });

  const { data: listType = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.typeServices.getAll("get-all")],
    queryFn: () => apiTypeService.getAll(),
    ...{
      select: (data: ResponseApi) => data.data.items as TypesServicesType[],
    },
  });

  const {
    data: listProvider = [],
    refetch: refetchListprovider,
    isFetching: isFetchingListProvider,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.provider.searchProvider("search-provider")],
    queryFn: () => apiUser.searchProvider({ ...filterParams }),
    ...{
      select: (data: ResponseApi) => data.data.items,
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (listProvider?.items && Array.isArray(listProvider?.items)) {
      if (listProvider?.pageNumber === 0) {
        setDataListProvider(listProvider?.items);
        setPage(1);
      } else {
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
    }
  }, [listProvider?.pageNumber, listProvider?.totalElements, force]);

  const handleSearch = (data: any) => {
    setFilterParams({
      ...data,
      page: 0,
      typeService: data?.typeService && data?.typeService.join(","),
    });
    setPage(0);
    setForce((v) => !v);
    setTimeout(() => {
      refetchListprovider();
    }, 1000);
    setOpenSearchModal(false);
  };

  const handleClearFilter = (data: any) => {
    handleSearch(data);
  };

  const fetchData = () => {
    setFilterParams((prev) => ({ ...prev, page }));
    setTimeout(() => {
      refetchListprovider();
    }, 1000);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "dark"
            ? ThemeColorsSthetic.backgroundStrong
            : ThemeColorsSthetic.backgroundLight,
      }}
    >
      <View style={localStyle.header}>
        <Image
          source={require("@/assets/images/me-logo-header.png")}
          style={localStyle.logo}
        />
        <View style={GridStyle.rowSpaceBetween}>
          <TouchableOpacity
            style={localStyle.inputSearch}
            onPress={() => setOpenSearchModal((v) => !v)}
          >
            <Feather
              name="search"
              size={25}
              color={ThemeColorsSthetic.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{ backgroundColor: ThemeColorsSthetic.backgroundLight, flex: 1 }}
      >
        <ListProvider
          dataListProvider={dataListProvider}
          selectProfile={() => setRequiredLogin(true)}
          makeSchedule={() => setRequiredLogin(true)}
          isFetchingList={isFetchingListProvider}
          fetchData={fetchData}
          listKeysFavorite={[""]}
          requiredLogin={() => setRequiredLogin(true)}
        />
      </View>
      <SearchModal
        open={openSearchModal}
        handleCloseModal={() => setOpenSearchModal((v) => !v)}
        listType={listType}
        handleFilter={handleSearch}
        handleClearFilter={handleClearFilter}
      />
      {requiredLogin && (
        <ModalRequiredLogin
          open={requiredLogin}
          handleClose={() => setRequiredLogin(false)}
        />
      )}
    </SafeAreaView>
  );
}

const localStyle = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  loader: {
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  textEmpty: {
    ...TextStyle.textMuted,
    textAlign: "center",
  },
});
