import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ResponseApi } from "@/api/responseApi";
import { apiScheduleService } from "@/api/ScheduleService";
import { ThemedText } from "@/components/ThemedText";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ItemCommentsProvider from "./ItemCommentsProvider";
import { QualificationType } from "@/constants/GeneralTypes";
import GlobalRating from "@/components/Shared/GlobalRating";
import { TextStyle } from "@/constants/StyleComponents";
import LoadingView from "@/components/Shared/LoadingView";
import EmptyView from "@/components/Shared/EmptyView";

type tabCommentsProviderProps = {
  idProvider: string;
};

export const TabCommentsProvider = ({
  idProvider,
}: tabCommentsProviderProps) => {
  const [qualification, setQualification] = useState({
    rating: 0,
    listComments: [],
  });
  const { data: listQualifications, isLoading: isLoadingQualifications } =
    useQuery({
      queryKey: [REACT_QUERY_KEYS.provider.getRatingsByProvider(idProvider)],
      queryFn: () => apiScheduleService.getRatingsByProvider(idProvider),
      ...{
        select: (data: ResponseApi) => data.data.items,
        enabled: Boolean(idProvider),
      },
    });

  useEffect(() => {
    if (listQualifications?.length > 0) {
      let rating = 0;
      for (let i = 0; i < listQualifications?.length; i++) {
        rating = rating + listQualifications[i]?.rating;
      }
      setQualification({
        rating: rating / listQualifications.length,
        listComments: listQualifications,
      });
    }
  }, [listQualifications]);

  return (
    <>
      {isLoadingQualifications ? (
        <LoadingView />
      ) : (
        <>
          {qualification.listComments.length === 0 ? (
            <View style={{ marginTop: 100 }}>
              <EmptyView message="No ha recibido calificaciones por el momento" />
            </View>
          ) : (
            <View style={localStyle.tabComments}>
              <ThemedText style={TextStyle.value}>
                Opiniones del servicio
              </ThemedText>
              <ThemedText
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <GlobalRating rating={qualification.rating} />
              </ThemedText>
              <ThemedText style={localStyle.qualifications}>
                {qualification.listComments?.length} calificaciones
              </ThemedText>
              <View style={localStyle.contentQualifications}>
                <ScrollView style={{ height: "57%" }}>
                  {qualification.listComments.map(
                    (item: QualificationType) =>
                      !!item.comment && (
                        <ItemCommentsProvider key={item.id} item={item} />
                      )
                  )}
                </ScrollView>
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};

const localStyle = StyleSheet.create({
  tabComments: {
    width: "95%",
    marginHorizontal: "auto",
  },
  qualifications: {
    ...TextStyle.textMuted,
    fontSize: 12,
    marginTop: -5,
  },
  contentQualifications: {
    marginTop: 10,
  },
});

export default TabCommentsProvider;
