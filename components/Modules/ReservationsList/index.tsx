import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { apiScheduleService } from "@/api/ScheduleService";
import { ScheduleServiceType } from "@/constants/GeneralTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import { ReservationListItem } from "./ReservationListItem";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { STATUS_SERVICE, TYPE_STATUS } from "@/constants/Constants";
import LoadingView from "@/components/Shared/LoadingView";
import EmptyView from "@/components/Shared/EmptyView";

type reservationListProps = {
  idUser: string;
  day: string;
};

export const ReservationList = ({ idUser, day }: reservationListProps) => {
  const { handleNotification } = useNotificationProvider();

  const {
    data: listSchedule = [],
    refetch: refetchListSchedule,
    isLoading: isLoadingListSchedule,
  } = useQuery({
    queryKey: [REACT_QUERY_KEYS.user.getMyReservation(idUser), day],
    queryFn: () => apiScheduleService.findMyReservations(idUser, day),
    ...{
      select: (data: ResponseApi) =>
        data.data.items as Array<ScheduleServiceType>,
    },
  });

  const { mutate: rejectService } = useMutation({
    mutationFn: (data: any) => apiScheduleService.changeStatusSchedule(data),
    onSuccess: (data: ResponseApi) => handleSuccessRejectService(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessRejectService = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });

    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: "Se cancelo su reserva con éxito",
    });
    refetchListSchedule();
  };

  const handleRejectSchedule = (idSchedule: number) => {
    rejectService({
      idSchedule,
      statusSchedule: STATUS_SERVICE.CANCEL,
      textComments: "Cancelado por cliente",
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoadingListSchedule ? (
        <View style={{ marginTop: 100 }}>
          <LoadingView />
        </View>
      ) : (
        <ScrollView style={{ flexGrow: 1 }}>
          {listSchedule?.length > 0 ? (
            listSchedule?.map((item) => (
              <ReservationListItem
                key={item.id}
                item={item}
                handleRejectSchedule={handleRejectSchedule}
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

export default ReservationList;
