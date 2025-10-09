import { Tabs, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  getStoreSession,
  KEY_STORE,
  setStoreSession,
} from "@/hooks/StoreDataSecure";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { SOCKET_CHANNELS_TOPICS } from "@/constants/socket-channels";
import {
  APP_NAME_SLUG,
  PLATFORM_TYPE,
  TYPE_STATUS,
  VERSION,
} from "@/constants/Constants";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { useWebSocketProvider } from "@/provider/WebSocketProvider";
import { useSessionProvider } from "@/provider/SessionProvider";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import apiUserConfig from "@/api/UserConfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiScheduleService } from "@/api/ScheduleService";
import ModalQualification from "@/components/Shared/ModalQualification";
import { CurrentVersionType, ProviderRatings } from "@/constants/GeneralTypes";
import { useAudioPlayer } from "expo-audio";
import ModalConfirm from "@/components/Shared/ModalConfirm";
import { apiUser } from "@/api/User";
import ModalUpdateVersion from "@/components/Shared/ModalUpdateVersion";

export default function TabLayout() {
  const sound = useAudioPlayer(
    require("@/assets/sounds/short-success-sound.mp3")
  );
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { handleNotification } = useNotificationProvider();
  const { subscribeToChannel, unSubscribeToChannelByTopic } =
    useWebSocketProvider();
  const { storeSessionProvider } = useSessionProvider();
  const { token, setToken } = useApiProvider();
  const insets = useSafeAreaInsets();
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const [openQualificationModal, setOpenQualificationModal] = useState(false);
  const [accountVerification, setAccountVerification] = useState(true);
  const [openResendVerification, setOpenResendVerification] = useState(false);
  const [showUpdateVersion, setShowUpdateVersion] = useState(false);

  const { data: currentVersion } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.configVersion("version")],
    queryFn: () => apiUser.getCurrentVersion(APP_NAME_SLUG),
    ...{
      select: (data: ResponseApi) => data.data,
      enabled: !!Boolean(token),
    },
  });

  const { data: pendingRating } = useQuery({
    queryKey: [REACT_QUERY_KEYS.provider.pendingRating("rating")],
    queryFn: () =>
      apiScheduleService.getPendingRatingByUser(storeSessionProvider?.idUser),
    ...{
      select: (data: ResponseApi) => data.data as ObjectResponse,
      enabled: Boolean(token) && Boolean(storeSessionProvider?.idUser),
    },
  });

  const { data: statusAccountVerification } = useQuery({
    queryKey: [
      REACT_QUERY_KEYS.user.getVerificationAccount(
        storeSessionProvider?.idUser
      ),
    ],
    queryFn: () => apiUser.getAccountVerification(storeSessionProvider?.idUser),
    ...{
      select: (data: ResponseApi) => data.data,
      enabled:
        Boolean(token) &&
        Boolean(storeSessionProvider?.idUser) &&
        Boolean(!accountVerification),
    },
  });

  useEffect(() => {
    if (statusAccountVerification && !statusAccountVerification?.error) {
      setAccountVerification(statusAccountVerification?.items);
      setStoreSession({
        key: KEY_STORE.accountVerification,
        value: JSON.stringify(statusAccountVerification?.items),
      });
    }
  }, [statusAccountVerification]);

  const { mutate: saveTokenNotification } = useMutation({
    mutationFn: (data: any) => apiUserConfig.saveTokenNotification(data),
    onSuccess: (data: ResponseApi) =>
      handleSuccessSaveTokenNotification(data.data),
    onError: ErrorAlertMessage,
  });

  const { mutate: resendRequestVerification } = useMutation({
    mutationFn: (id: string) => apiUser.resendRequestVerification(id),
    onSuccess: (data: ResponseApi) =>
      handleSuccessResenRequestVerification(data.data),
    onError: ErrorAlertMessage,
  });

  const handleSuccessSaveTokenNotification = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
  };

  const handleSuccessResenRequestVerification = (data: ObjectResponse) => {
    if (data.error) {
      handleNotification({ type: TYPE_STATUS.ERROR, message: data.message });
    } else {
      handleNotification({ type: TYPE_STATUS.SUCCESS, message: data.message });
    }
  };

  useEffect(() => {
    if (!currentVersion?.error && currentVersion?.items) {
      const dataVersion: CurrentVersionType = currentVersion?.items;
      if (
        Platform.OS === PLATFORM_TYPE.IOS &&
        dataVersion.versionIos !== VERSION
      ) {
        setShowUpdateVersion(true);
      }
      if (
        Platform.OS === PLATFORM_TYPE.ANDROID &&
        dataVersion.versionAndroid !== VERSION
      ) {
        setShowUpdateVersion(true);
      }
    }
  }, [currentVersion]);

  useEffect(() => {
    if (pendingRating?.items) {
      setOpenQualificationModal(true);
    }
  }, [pendingRating]);

  useEffect(() => {
    getStoreSession({ key: KEY_STORE.userToken }).then((value) => {
      if (!value) return navigation.navigate("login" as never);
      else setToken(value);
    });
    getStoreSession({ key: KEY_STORE.accountVerification }).then((value) => {
      if (value) setAccountVerification(JSON.parse(value));
    });
  }, [token]);

  useEffect(() => {
    setOpenResendVerification(!accountVerification);
  }, [accountVerification]);

  useEffect(() => {
    if (token) {
      subscribeToChannel({
        topic: SOCKET_CHANNELS_TOPICS.schedules(),
        handleEvent: (data: any) => handleNotificationWs(data),
      });
      return () => {
        unSubscribeToChannelByTopic(SOCKET_CHANNELS_TOPICS.schedules());
      };
    }
  }, [token]);

  const handleNotificationWs = (data: any) => {
    sound.seekTo(2);
    sound.play();
    handleNotification({
      type: TYPE_STATUS.UPDATE,
      message: data.message,
    });
  };

  // Para noitificaciones push
  useEffect(() => {
    if (token && storeSessionProvider?.idUser) {
      registerForPushNotificationsAsync().then((tokenNotification) => {
        if (tokenNotification) {
          saveTokenNotification({
            id: storeSessionProvider?.idUser,
            tokenNotification,
          });
        }
      });

      // Escucha cuando llega una notificación y la app está en primer plano
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notificación recibida:", notification);
        });

      // Escucha cuando el usuario toca la notificación
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Respuesta a notificación:", response);
        });

      return () => {
        notificationListener.current && notificationListener.current?.remove();
        responseListener.current && responseListener.current?.remove();
      };
    }
  }, [token, storeSessionProvider]);

  const resendConfirmation = () => {
    setOpenResendVerification(false);
    resendRequestVerification(storeSessionProvider?.idUser);
  };

  if (!token) return <></>;

  return (
    <View
      style={{
        ...localStyle.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor:
          colorScheme === "dark"
            ? ThemeColorsSthetic.backgroundStrong
            : ThemeColorsSthetic.backgroundLight,
      }}
    >
      <View style={localStyle.container}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: ThemeColorsSthetic.accent,
            tabBarActiveBackgroundColor: ThemeColorsSthetic.backgroundLight,
            tabBarInactiveBackgroundColor: "white",
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: {
              ...Platform.select({
                ios: {
                  // Use a transparent background on iOS to show the blur effect
                  position: "absolute",
                },
                default: {},
              }),
              height: 50,
              paddingBottom: 0,
              borderTopWidth: 0,
              backgroundColor: ThemeColorsSthetic.backgroundLight,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Inicio",
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarIcon: ({ color, focused }) => (
                <MaterialIcons
                  name="person-search"
                  size={28}
                  color={
                    focused
                      ? ThemeColorsSthetic.accent
                      : ThemeColorsSthetic.muted
                  }
                />
              ),
            }}
          />
          <Tabs.Screen
            name="reservation"
            options={{
              title: "Reservación",
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome
                  name="calendar-check-o"
                  size={28}
                  color={
                    focused
                      ? ThemeColorsSthetic.accent
                      : ThemeColorsSthetic.muted
                  }
                />
              ),
            }}
          />
          <Tabs.Screen
            name="more"
            options={{
              title: "Más",
              tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
              tabBarIcon: ({ color, focused }) => (
                <FontAwesome6
                  name="bars"
                  size={28}
                  color={
                    focused
                      ? ThemeColorsSthetic.accent
                      : ThemeColorsSthetic.muted
                  }
                />
              ),
            }}
          />
        </Tabs>
      </View>
      {openQualificationModal && (
        <ModalQualification
          open={openQualificationModal}
          handleCloseModal={() => setOpenQualificationModal(false)}
          providerRatings={pendingRating?.items as ProviderRatings}
        />
      )}
      {openResendVerification && (
        <ModalConfirm
          open={openResendVerification}
          textBtnConfirm="Enviar"
          message="Aun no ha confirmdo su cuenta, ¿desea reenviar el correo de confirmación?"
          handleClose={() => {
            setOpenResendVerification(false);
          }}
          handleConfirm={resendConfirmation}
          IconModal={
            <AntDesign
              name="warning"
              size={35}
              color={ThemeColorsSthetic.dangerColor}
            />
          }
        />
      )}
      {showUpdateVersion && <ModalUpdateVersion open={showUpdateVersion} />}
    </View>
  );
}

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
});

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert("Debes usar un dispositivo físico para recibir notificaciones push");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("No se otorgaron permisos para notificaciones push");
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();

  return tokenData.data;
}
