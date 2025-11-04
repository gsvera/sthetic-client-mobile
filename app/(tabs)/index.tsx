import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import apiTypeService from "@/api/TypeService";
import { apiUser } from "@/api/User";
import { ProfileProviderModal } from "@/components/Modules/Provider/ProfileProviderModal";
import SearchModal from "@/components/Modules/Provider/SearchModal";
import Schedule from "@/components/Modules/Schedule";
import LoadingView from "@/components/Shared/LoadingView";

import { ThemeColorsSthetic } from "@/constants/Colors";
import { PLATFORM_TYPE } from "@/constants/Constants";
import { TypesServicesType } from "@/constants/GeneralTypes";
import { GridStyle, TextStyle } from "@/constants/StyleComponents";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { Feather, Fontisto } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, Platform, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";
import { useSessionProvider } from "@/provider/SessionProvider";
import { MyLocationModal } from "@/components/Modules/Settings/MyLocation/MyLocationModal";
import ListProvider from "@/components/Modules/Provider/ListProvider";

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
  const [dataListFavoriteProvider, setDataListFavoriteProvider] = useState<
    any[]
  >([]);
  const [page, setPage] = useState(0);
  const [pageFavorite, setPageFavorite] = useState(0);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openProfileProviderModal, setOpenProfileProviderModal] =
    useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [profileSelected, setProfileSelected] = useState("");
  const [openModalDefaultLocation, setOpenModalDefaultLocation] =
    useState(false);
  const [force, setForce] = useState(false); // auxiliar para refrescar useEffect para rellenar items
  const [findFavorite, setFindFavorite] = useState(false);
  const [listKeysFavorites, setListKeyFavorites] = useState<string[]>([]);

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

  const {
    data: listFavoriteProvider,
    refetch: refetchListFavoriteProvider,
    isFetching: isFetchingListFavoriteProvider,
  } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.provider.getFavoriteProvider(
        storeSessionProvider?.idUser
      ),
    ],
    queryFn: () =>
      apiUser.getFavoritesProvider({
        idClient: storeSessionProvider?.idUser,
        page: pageFavorite,
      }),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: findFavorite,
    },
  });

  const { data: keysFavoritesProvider = [] } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.provider.getListKeysFavoritesProvider(
        storeSessionProvider?.idUser
      ),
    ],
    queryFn: () =>
      apiUser.getFavoritesKeysProvider(storeSessionProvider?.idUser),
    ...{
      select: (data: ResponseApi) => data.data.items,
      enabled: Boolean(storeSessionProvider?.idUser),
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
  }, [listProvider?.pageNumber, listProvider?.totalElements, force]);

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

  useEffect(() => {
    if (keysFavoritesProvider.length > 0)
      setListKeyFavorites(keysFavoritesProvider);
    if (findFavorite) {
      setDataListFavoriteProvider((prev: any) => {
        const existingIds = new Set(
          keysFavoritesProvider.map((key: string) => key)
        );

        const filterdUpdate = prev.filter((item: any) =>
          existingIds.has(item.idUser)
        );

        return [...filterdUpdate];
      });
    }
  }, [keysFavoritesProvider]);

  useEffect(() => {
    if (
      findFavorite &&
      listFavoriteProvider?.items &&
      Array.isArray(listFavoriteProvider?.items)
    ) {
      if (listFavoriteProvider?.pageNumber === 0) {
        setDataListFavoriteProvider(listFavoriteProvider?.items);
        setPageFavorite(1);
      } else {
        setDataListFavoriteProvider((prev: any) => {
          const existingIds = new Set(prev.map((item: any) => item.id));

          const filterdNew = listFavoriteProvider?.items.filter(
            (item: any) => !existingIds.has(item.id)
          );
          return [...prev, ...filterdNew];
        });
        if (listFavoriteProvider?.totalPages >= pageFavorite + 1) {
          setPageFavorite((n) => n + 1);
        }
      }
    }
  }, [
    findFavorite,
    listFavoriteProvider?.pageNumber,
    listFavoriteProvider?.totalElements,
  ]);

  useEffect(() => {
    if (!findFavorite) {
      setPageFavorite(0);
      setDataListFavoriteProvider([]);
    }
  }, [findFavorite]);

  const handleSearch = (data: any) => {
    setFindFavorite(false);
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
    setFindFavorite(false);
    handleSearch(data);
  };

  const fetchData = () => {
    setFilterParams((prev) => ({ ...prev, page }));
    setTimeout(() => {
      refetchListprovider();
    }, 1000);
  };

  const fetchDataFavorite = () => {
    setTimeout(() => {
      refetchListFavoriteProvider();
    });
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

  const searchFavorite = () => {
    setFindFavorite((v) => !v);
  };

  return (
    <View style={{ flex: 1 }}>
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
          <TouchableOpacity
            style={localStyle.inputSearch}
            onPress={searchFavorite}
          >
            <Fontisto
              name="favorite"
              style={{
                color: findFavorite
                  ? ThemeColorsSthetic.accent
                  : ThemeColorsSthetic.textLight,
                fontSize: 25,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {findFavorite ? (
          <ListProvider
            dataListProvider={dataListFavoriteProvider}
            selectProfile={handleOnSelectProfile}
            makeSchedule={handleMakeSchedule}
            isFetchingList={isFetchingListFavoriteProvider}
            fetchData={fetchDataFavorite}
            listKeysFavorite={listKeysFavorites}
          />
        ) : (
          <ListProvider
            dataListProvider={dataListProvider}
            selectProfile={handleOnSelectProfile}
            makeSchedule={handleMakeSchedule}
            isFetchingList={isFetchingListProvider}
            fetchData={fetchData}
            listKeysFavorite={listKeysFavorites}
          />
        )}
        {(isFetchingListProvider || isFetchingListFavoriteProvider) && (
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
      {openProfileProviderModal && (
        <ProfileProviderModal
          open={openProfileProviderModal}
          handleCloseModal={handleCloseProfileProviderModal}
          idProvider={profileSelected}
        />
      )}
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
