import ReturnArrow from "@/components/Shared/ReturnArrow";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import {
  FORMAT_DATE,
  PLATFORM_TYPE,
  STEP_RESERVATION,
  TYPE_STATUS,
} from "@/constants/Constants";
import {
  MenuServiceType,
  modalCustomProps,
  ScheduleServiceType,
  SelectedDateCalendarType,
} from "@/constants/GeneralTypes";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import StepCalendar from "./StepCalendar";
import StepService from "./StepService";
import StepConfirm from "./StepConfirm";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { useMutation } from "@tanstack/react-query";
import { apiScheduleService } from "@/api/ScheduleService";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import SuccessNotification from "@/components/Shared/Notifications/SuccessNotification";
import { convertDateToGeneralFormat } from "@/utils/GeneralUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MiniNotification from "@/components/Shared/Notifications/MiniNotification";

type scheduleProps = Omit<modalCustomProps, "idProvider"> & {
  idProvider: string;
};

export const Schedule = ({
  open,
  handleCloseModal,
  idProvider,
}: scheduleProps) => {
  const insets = useSafeAreaInsets();
  const [openSuccessNotification, setOpenSuccessNotification] = useState(false);
  const [miniNotificationState, setMiniNotificationState] = useState({
    open: false,
    type: TYPE_STATUS.SUCCESS,
    message: "",
  });
  const [makeScheduleService, setMakeScheduleService] =
    useState<ScheduleServiceType>({
      idProviderAux: idProvider,
      idClientAux: "",
      scheduleDate: "",
      startTime: "",
      endTime: "",
      nameService: "",
      people: 0,
      amount: 0,
    });
  const [stepSelected, setStepSelected] = useState<STEP_RESERVATION>(
    STEP_RESERVATION.SELECT_DATE
  );

  const { mutate: saveScheduleService, isPending } = useMutation({
    mutationFn: (data: ScheduleServiceType) => apiScheduleService.save(data),
    onSuccess: (data: ResponseApi) =>
      handleSuccessSaveScheduleService(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveScheduleService = (data: ObjectResponse) => {
    if (data.error) {
      return setMiniNotificationState({
        open: true,
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    }
    setOpenSuccessNotification(true);
  };

  useEffect(() => {
    /**
     * Existe un provider de notificaciones pero por temas de super posicion del modal no se ve cuando ya hay un modal abierto por eso se hizo esta excepcion
     */
    if (miniNotificationState.open)
      setTimeout(() => {
        setMiniNotificationState((prev) => ({ ...prev, open: false }));
      }, 2000);
  }, [miniNotificationState.open]);

  useEffect(() => {
    getStoreSession({ key: KEY_STORE.idUser }).then((value) => {
      if (value) {
        setMakeScheduleService((prev) => ({
          ...prev,
          idClientAux: value,
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (openSuccessNotification) {
      setTimeout(() => {
        onPressCloseModal();
        setOpenSuccessNotification(false);
      }, 1500);
    }
  }, [openSuccessNotification]);

  const handleSelectAvailable = (dateAvailable: SelectedDateCalendarType) => {
    setMakeScheduleService((prev) => ({
      ...prev,
      scheduleDate: dateAvailable.dateString,
      startTime: dateAvailable.time.start,
      endTime: dateAvailable.time.end,
    }));
    setStepSelected(STEP_RESERVATION.SELECT_SERVICE);
  };

  const handleSelectService = (service: MenuServiceType) => {
    setMakeScheduleService((prev) => ({
      ...prev,
      nameService: service.nameService,
      people: service.people,
      amount: service.price,
    }));
    setStepSelected(STEP_RESERVATION.CONFIRM_RESERVATION);
  };

  const handleSave = () => {
    const dateWithFormat = convertDateToGeneralFormat(
      makeScheduleService.scheduleDate,
      FORMAT_DATE.TIME_STAMP
    );

    if (dateWithFormat)
      saveScheduleService({
        ...makeScheduleService,
        scheduleDate: dateWithFormat,
      });
    else
      setMiniNotificationState({
        open: true,
        type: TYPE_STATUS.ERROR,
        message: "Formato de fecha invalido",
      });
  };

  const onPressCloseModal = () => {
    setMakeScheduleService((prev) => ({
      idProviderAux: "",
      idClientAux: prev.idClientAux,
      scheduleDate: "",
      startTime: "",
      endTime: "",
      nameService: "",
      people: 0,
      amount: 0,
    }));
    setStepSelected(STEP_RESERVATION.SELECT_DATE);
    handleCloseModal();
  };

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={onPressCloseModal}
    >
      <View
        style={{
          backgroundColor: ThemeColorsSthetic.backgroundStrong,
          height: "100%",
        }}
      >
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: ThemeColorsSthetic.backgroundLight,
            zIndex: 1500,
          }}
        >
          {openSuccessNotification && (
            <SuccessNotification message="Se ha generado su reservación con éxito" />
          )}
          <ReturnArrow handleReturn={onPressCloseModal} />
          <View>
            <ThemedText style={localStyle.title}>Solcitar cita</ThemedText>
          </View>
          <View style={localStyle.contentTab}>
            <TouchableOpacity
              onPress={() => setStepSelected(STEP_RESERVATION.SELECT_DATE)}
              style={
                stepSelected >= STEP_RESERVATION.SELECT_DATE
                  ? localStyle.tabSelected
                  : localStyle.tab
              }
            >
              <ThemedText style={localStyle.textTab}>Disponibilidad</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                makeScheduleService.startTime &&
                makeScheduleService.endTime &&
                setStepSelected(STEP_RESERVATION.SELECT_SERVICE)
              }
              style={
                stepSelected >= STEP_RESERVATION.SELECT_SERVICE
                  ? localStyle.tabSelected
                  : localStyle.tab
              }
            >
              <ThemedText style={localStyle.textTab}>Servicio</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                stepSelected >= STEP_RESERVATION.CONFIRM_RESERVATION
                  ? localStyle.tabSelected
                  : localStyle.tab
              }
            >
              <ThemedText style={localStyle.textTab}>Confirmación</ThemedText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: Platform.OS === PLATFORM_TYPE.ANDROID ? "90%" : "87%",
            }}
          >
            {stepSelected === STEP_RESERVATION.SELECT_DATE && (
              <StepCalendar
                idProvider={idProvider as string}
                handleSelectAvailableTime={handleSelectAvailable}
              />
            )}
            {stepSelected === STEP_RESERVATION.SELECT_SERVICE && (
              <StepService
                idProvider={idProvider as string}
                onSelect={handleSelectService}
              />
            )}
            {stepSelected === STEP_RESERVATION.CONFIRM_RESERVATION && (
              <StepConfirm
                idProvider={idProvider as string}
                scheduleService={makeScheduleService}
                onSave={handleSave}
                disableBtnSave={isPending}
              />
            )}
          </View>
        </View>
      </View>
      {miniNotificationState.open && (
        <MiniNotification
          open={miniNotificationState.open}
          type={miniNotificationState.type}
          message={miniNotificationState.message}
        />
      )}
    </Modal>
  );
};

const localStyle = StyleSheet.create({
  title: {
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25,
    marginTop: -20,
    marginBottom: 15,
  },
  contentTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tabSelected: {
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.backgroundStrong,
    backgroundColor: ThemeColorsSthetic.accentReverse,
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
  },
  tab: {
    borderWidth: 0.5,
    borderColor: ThemeColorsSthetic.backgroundStrong,
    backgroundColor: ThemeColorsSthetic.muted,
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
  },
  textTab: {
    color: ThemeColorsSthetic.textLight,
    fontWeight: 600,
    fontSize: 15,
  },
});

export default Schedule;
