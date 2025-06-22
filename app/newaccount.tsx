import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { Container, ThemeColorsSthetic } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import FormRegister, {
  FormInputs,
} from "@/components/Modules/Register/FormRegister";
import { useMutation } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import SuccessNotification from "@/components/Shared/Notifications/SuccessNotification";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { parsePasswordEncrypt } from "@/utils/GeneralUtils";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";

const defaultValues = {
  firstName: "",
  lastName: "",
  lada: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function newAccount() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { setToken } = useApiProvider();
  const [showMessageSucces, setShowMessageSuccess] = useState(false);
  const [agreeConditions, setAgreeconditions] = useState(false);
  const [personalInformation, setPersonalInformation] = useState<FormInputs>();
  const [isLoading, setIsLoading] = useState(false);

  const copyDefaultValues = () => ({ ...defaultValues });

  useEffect(() => {
    setPersonalInformation(copyDefaultValues);
  }, []);

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  const { mutate: createUser } = useMutation({
    mutationFn: (data: any) => apiUser.saveUser(data),
    onSuccess: (data: ResponseApi) => handleSuccessSaveUser(data?.data),
    onError: (err) => ErrorAlertMessage,
  });

  const handleSuccessSaveUser = (data: ObjectResponse) => {
    setIsLoading(false);
    if (data.error) {
      ErrorAlertMessage({ message: data.message });
      return;
    }
    setShowMessageSuccess(true);
    setTimeout(() => {
      setStoreSession({ key: KEY_STORE.idUser, value: data.items.idUser });
      setStoreSession({ key: KEY_STORE.userToken, value: data.items.token });
      setToken(data.items.token);
      setShowMessageSuccess(false);
    }, 4500);
  };

  const handleSaveNewUser = (personalInformation: FormInputs) => {
    setIsLoading(true);
    createUser({
      ...personalInformation,
      password: parsePasswordEncrypt(personalInformation?.password as string),
    });
  };

  const handleCancel = () => {
    const cleanData = copyDefaultValues();
    setPersonalInformation(cleanData);
    setAgreeconditions(false);
    navigation.navigate("login" as never);
  };

  return (
    <View
      style={{
        ...Container.container,
        backgroundColor: ThemeColorsSthetic.backgroundStrong,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {showMessageSucces ? (
        <SuccessNotification
          message="Su cuenta ha sido creada con éxito"
          subMessage="Se ha enviado un correo electrónico de verificación de cuenta, si no verifica su cuenta en las proximas 24 horas, su cuenta podria ser eliminada."
        />
      ) : (
        <View
          style={{
            backgroundColor: ThemeColorsSthetic.backgroundLight,
            height: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 20,
              marginTop: 20,
            }}
          >
            <AntDesign
              onPress={() => handleCancel()}
              name="close"
              size={24}
              color={ThemeColorsSthetic.accentReverse}
            />
          </View>
          <ThemedText style={localStyles.title}>Crear cuenta nueva</ThemedText>
          {personalInformation && (
            <FormRegister
              agreeConditions={agreeConditions}
              handleAgreeConditions={() => setAgreeconditions((v) => !v)}
              handlePersonalInformation={handleSaveNewUser}
              personalInformation={personalInformation}
              isLoading={isLoading}
            />
          )}
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    height: 50,
    paddingTop: 10,
    color: ThemeColorsSthetic.textTitle,
  },
});
