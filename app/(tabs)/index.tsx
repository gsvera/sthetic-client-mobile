import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import apiTypeService from "@/api/TypeService";
import { apiUser } from "@/api/User";
import CardProfileProvider from "@/components/Modules/Provider/CardProfileProvider";
import { ProfileProviderModal } from "@/components/Modules/Provider/ProfileProviderModal";
import SearchModal from "@/components/Modules/Provider/SearchModal";
import Schedule from "@/components/Modules/Schedule";
import LoadingView from "@/components/Shared/LoadingView";
import { ThemedText } from "@/components/ThemedText";

import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE } from "@/constants/Constants";
import { TypesServicesType } from "@/constants/GeneralTypes";
import { TextStyle } from "@/constants/StyleComponents";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, Platform } from "react-native";
import { FlatList } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useSessionProvider } from "@/provider/SessionProvider";
import { MyLocationModal } from "@/components/Modules/Settings/MyLocation/MyLocationModal";
import EmptyView from "@/components/Shared/EmptyView";

type FilterSearchParamsType = {
  page: number;
  word: string;
  typeService: string;
  defaultState: string;
  defaultMunicipality: string;
};

export default function Home() {
  const platform = Platform.OS;
  const { storeSessionProvider } = useSessionProvider();
  const [filterParams, setFilterParams] = useState<FilterSearchParamsType>({
    page: 0,
    word: "",
    typeService: "",
    defaultState: storeSessionProvider?.defaultState,
    defaultMunicipality: storeSessionProvider?.defaultMunicipality,
  });
  const [dataListProvider, setDataListProvider] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openProfileProviderModal, setOpenProfileProviderModal] =
    useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [profileSelected, setProfileSelected] = useState("");
  const [openModalDefaultLocation, setOpenModalDefaultLocation] =
    useState(false);
  const [force, setForce] = useState(false); // auxiliar para refrescar useEffect para rellenar items

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

  const { data: listType = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.typeServices.getAll("get-all")],
    queryFn: () => apiTypeService.getAll(),
    ...{
      select: (data: ResponseApi) => data.data.items as TypesServicesType[],
    },
  });

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
  }, [listProvider?.pageNumber, listProvider.totalElements, force]);

  useEffect(() => {
    if (storeSessionProvider?.defaultState) {
      setTimeout(() => {
        handleSearch({
          defaultState: storeSessionProvider?.defaultState,
          defaultMunicipality: storeSessionProvider?.defaultMunicipality,
        });
      }, 500);
    }
  }, [
    storeSessionProvider?.defaultState,
    storeSessionProvider?.defaultMunicipality,
  ]);

  useEffect(() => {
    setTimeout(() => {
      getStoreSession({ key: KEY_STORE.defaultState }).then((value) => {
        if (!value) setOpenModalDefaultLocation(true);
      });
    }, 3000);
  }, [storeSessionProvider?.idUser]);

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
    setPage(0);
    handleSearch(data);
  };

  const fetchData = () => {
    setFilterParams((prev) => ({ ...prev, page }));
    setTimeout(() => {
      refetchListprovider();
    }, 1000);
  };

  const handleOnSelectProfile = (idUser: string) => {
    setProfileSelected(idUser);
    setOpenProfileProviderModal(true);
  };

  const handleCloseProfileProviderModal = () => {
    setProfileSelected("");
    setOpenProfileProviderModal(false);
  };

  const handleMakeSchedule = (idUser: string) => {
    setProfileSelected(idUser);
    setOpenSchedule(true);
  };

  const handleCloseSchedule = () => {
    setProfileSelected("");
    setOpenSchedule(false);
  };

  const handleRefetchLocationDefault = () => {
    setOpenModalDefaultLocation(false);
  };

  return (
    <View>
      <View style={localStyle.header}>
        <Image
          source={require("@/assets/images/me-text-logo.png")}
          style={localStyle.logo}
        />
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
      <View
        style={{ height: platform === PLATFORM_TYPE.ANDROID ? "90%" : "87%" }}
      >
        {dataListProvider.length > 0 ? (
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
                  infoCompany={item}
                  handleSelectProfile={handleOnSelectProfile}
                  handleMakeSchedule={handleMakeSchedule}
                />
              );
            }}
            onEndReached={fetchData}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={{ marginTop: 100 }}>
            {!isFetchingListProvider && <EmptyView />}
          </View>
        )}
        {isFetchingListProvider && (
          <LoadingView
            styleProps={{
              ...localStyle.loader,
              bottom: platform === PLATFORM_TYPE.ANDROID ? 50 : 120,
            }}
          />
        )}
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
        idProvider={profileSelected}
      />
      {!!profileSelected && (
        <Schedule
          open={openSchedule}
          handleCloseModal={handleCloseSchedule}
          idProvider={profileSelected}
        />
      )}
      {openModalDefaultLocation && storeSessionProvider?.idUser && (
        <MyLocationModal
          idUser={storeSessionProvider?.idUser as string}
          open={openModalDefaultLocation}
          handleCloseModal={handleRefetchLocationDefault}
        />
      )}
    </View>
  );
}

const localStyle = StyleSheet.create({
  logo: {
    width: 150,
    height: 50,
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
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 30,
    width: 100,
    backgroundColor: ThemeColorsSthetic.backgroundLight,
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
