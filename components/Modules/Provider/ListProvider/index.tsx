import { Dimensions, FlatList, Platform, View } from "react-native";
import CardProfileProvider from "../CardProfileProvider";
import EmptyView from "@/components/Shared/EmptyView";
import { PLATFORM_TYPE } from "@/constants/Constants";

type listProviderProps = {
  dataListProvider: any[];
  selectProfile: (idUser: string) => void;
  makeSchedule: (idUser: string) => void;
  fetchData: () => void;
  isFetchingList: boolean;
  listKeysFavorite: string[];
};

export const ListProvider = ({
  dataListProvider,
  selectProfile,
  makeSchedule,
  fetchData,
  isFetchingList,
  listKeysFavorite,
}: listProviderProps) => {
  const { height } = Dimensions.get("window");
  return (
    <View
      style={{
        flex: 1,
        marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? height * 0.06 : 0,
      }}
    >
      {dataListProvider.length > 0 ? (
        <FlatList
          style={{ flexGrow: 1 }}
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
                handleSelectProfile={selectProfile}
                handleMakeSchedule={makeSchedule}
                listKeysFavorite={listKeysFavorite}
              />
            );
          }}
          onEndReached={fetchData}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View style={{ marginTop: 100 }}>
          {!isFetchingList && <EmptyView />}
        </View>
      )}
    </View>
  );
};

export default ListProvider;
