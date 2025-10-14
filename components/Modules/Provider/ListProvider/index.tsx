import { FlatList, View } from "react-native";
import CardProfileProvider from "../CardProfileProvider";
import EmptyView from "@/components/Shared/EmptyView";

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
  return (
    <View>
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
