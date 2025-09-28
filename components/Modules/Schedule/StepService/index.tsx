import { apiCalendar } from "@/api/Calendar";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ThemedText } from "@/components/ThemedText";
import { TextStyle } from "@/constants/StyleComponents";
import { useQuery } from "@tanstack/react-query";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import OptionService from "./OptionService";
import { MenuServiceType } from "@/constants/GeneralTypes";
import LoadingView from "@/components/Shared/LoadingView";
import { ResponseApi } from "@/api/responseApi";
import { PLATFORM_TYPE } from "@/constants/Constants";
import EmptyView from "@/components/Shared/EmptyView";

type stepServiceProps = {
  idProvider: string;
  onSelect: (obj: MenuServiceType) => void;
};

export const StepService = ({ idProvider, onSelect }: stepServiceProps) => {
  const { data: listServices = [], isLoading: isLoadingListServices } =
    useQuery({
      queryKey: [REACT_QUERY_KEYS.provider.getServicesByProvider(idProvider)],
      queryFn: () => apiCalendar.getServicesByProvider(idProvider),
      ...{
        select: (data: ResponseApi) => data.data.items,
        enabled: !!idProvider,
      },
    });

  const handleSelectService = (service: MenuServiceType) => {
    onSelect(service);
  };

  return (
    <View>
      <View>
        <ThemedText style={localStyle.title}>Seleccione un servicio</ThemedText>
        <View style={{ width: "90%", marginHorizontal: "auto" }}>
          <ThemedText style={localStyle.textWarning}>
            Los precios son aproximados, sirven como referencia y podrían
            variar, Meredith Aesthetic no realiza cobros por el momento, los
            servicios se pagan directamente con el proveedor del servicio.
          </ThemedText>
        </View>
      </View>
      {isLoadingListServices ? (
        <LoadingView />
      ) : (
        <ScrollView
          style={{ height: Platform.OS === PLATFORM_TYPE.IOS ? "74%" : "75%" }}
        >
          {listServices.length > 0 ? (
            listServices?.map((item: MenuServiceType, index: number) => (
              <OptionService
                key={index}
                service={item}
                onSelect={handleSelectService}
              />
            ))
          ) : (
            <View style={{ marginTop: 100 }}>
              <EmptyView />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  title: {
    ...TextStyle.label,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  textWarning: {
    ...TextStyle.fontBoldCancel,
    textAlign: "justify",
    fontSize: 14,
  },
});

export default StepService;
