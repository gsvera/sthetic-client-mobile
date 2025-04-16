import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiUser } from "@/api/User";
import CardProfileProvider from "@/components/Modules/Provider/CardProfileProvider";
import { ThemedText } from "@/components/ThemedText";

import { Container } from "@/constants/Colors";
import { InfoCompanyType } from "@/constants/GeneralTypes";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { data: listProvider = [], refetch: refetchListprovider } = useQuery({
    queryKey: [REACT_QUERY_KEYS.provider.searchProvider("search-provider")],
    queryFn: () => apiUser.searchProvider(),
    ...{
      select: (data: ResponseAPi) => data.data.items,
    },
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      refetchListprovider();
      setRefreshing(false);
    }, 1500);
  }, []);
  return (
    <SafeAreaView style={Container.container}>
      <ThemedText style={{ color: "black" }}>Bienvenido</ThemedText>
      <ScrollView
        style={{ backgroundColor: "#a2a2a2" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {listProvider?.map((item: InfoCompanyType) => (
          <CardProfileProvider
            key={item.id}
            id={item.id}
            idUser={item.idUser}
            companyName={item.companyName}
            generalDescription={item.generalDescription}
            companyPicture={item.companyPicture}
            typesServices={item.typesServices}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
