import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { PLATFORM_TYPE, REGEX } from "@/constants/Constants";
import { ButtonGeneralStyle, TextStyle } from "@/constants/StyleComponents";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiLada } from "@/api/Lada";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import * as yup from "yup";
import { apiUser } from "@/api/User";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import GeneralButton from "@/components/Shared/GeneralButton";
import { ThemedText } from "@/components/ThemedText";
import Checkbox from "expo-checkbox";
import { ThemeColorsSthetic } from "@/constants/Colors";
import PoliticsAndConditionsModal from "../PoliticsAndConditions";
import { ResponseApi } from "@/api/responseApi";
import { LadaType } from "@/constants/GeneralTypes";
import LadaOptionModal from "./LadaOptionModal";
import LoadingView from "@/components/Shared/LoadingView";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Campo obligatorio")
    .matches(REGEX.ONLY_TEXT, "Solo puede agregar letras"),
  lastName: yup
    .string()
    .required("Campo obligatorio")
    .matches(REGEX.ONLY_TEXT, "Solo puede agregar letras"),
  phone: yup
    .string()
    .required("El numero telefonico es obligatorio")
    .matches(REGEX.ONLY_NUMBER, "Solo puede agregar numeros")
    .min(10, "Debe ser al menos 10 digitos"),
  email: yup
    .string()
    .required("Campo obligatorio")
    .email("Ingrese un correo valido"),
  password: yup
    .string()
    .required("Campo obligatorio")
    .matches(
      REGEX.PASSWORD,
      "La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial"
    ),
  confirmPassword: yup
    .string()
    .required("Campo obligatorio")
    .matches(
      REGEX.PASSWORD,
      "La contraseña debe incluir minimo 8 caracteres,  al menos una letra mayúscula una minuscula, un número y un carácter especial"
    )
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
});

export type FormInputs = {
  firstName: string;
  lastName: string;
  lada?: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type PropsFormRegister = {
  agreeConditions: boolean;
  handleAgreeConditions: () => void;
  personalInformation: FormInputs | null;
  handlePersonalInformation: (data: FormInputs) => void;
  isLoading: boolean;
};

export const FormRegister = ({
  personalInformation,
  handlePersonalInformation,
  agreeConditions,
  handleAgreeConditions,
  isLoading,
}: PropsFormRegister) => {
  const [hiddenPass, setHiddenPass] = useState(true);
  const [hiddenConfirmPass, setHiddenConfirmPass] = useState(true);
  const [openAgreeContitionsModal, setOpenAgreeConditionsModal] =
    useState(false);
  const [openLadaModal, setOpenLadaModal] = useState(false);
  const [ladaSelected, setLadaSelected] = useState<LadaType>();
  const [showErrorLada, setShowErrorLada] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { data: catalogLada = [] } = useQuery({
    queryKey: [REACT_QUERY_KEYS.lada.getFilterData("registry")],
    queryFn: () => apiLada.getFilterData(),
    ...{
      select: (data: ResponseApi) => data.data.items as Array<LadaType>,
    },
  });

  const handleSavePersonalData = async (data: FormInputs) => {
    try {
      if (!agreeConditions) {
        return ErrorAlertMessage({
          message: "Debe aceptar los terminos y condiciones",
        });
      }
      const searchUser: ResponseApi = await apiUser.findDuplicateUser(
        data.email,
        data.phone
      );

      if (!ladaSelected?.lada) return setShowErrorLada(true);

      if (searchUser.data.error) {
        ErrorAlertMessage({ message: searchUser.data.message });
      } else {
        handlePersonalInformation({ ...data, lada: ladaSelected?.lada });
      }
    } catch (err) {
      ErrorAlertMessage({});
      // console.log(err);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSelectLada = (data: LadaType) => {
    setLadaSelected(data);
    setShowErrorLada(false);
    setOpenLadaModal(false);
  };
  return (
    <View
      style={
        isKeyboardVisible
          ? localStyles.withKeyboard
          : localStyles.withoutKeyboard
      }
    >
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={localStyles.ContentForm}>
          <View style={localStyles.contentInput}>
            <Text style={localStyles.label}>* Nombre(s)</Text>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={localStyles.input}
                  placeholder="Ingrese su nombre"
                  placeholderTextColor={ThemeColorsSthetic.muted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.firstName && (
              <Text style={TextStyle.textError}>
                {errors.firstName.message}
              </Text>
            )}
          </View>
          <View style={localStyles.contentInput}>
            <Text style={localStyles.label}>* Apellido(s)</Text>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={localStyles.input}
                  placeholder="Ingrese su apellido"
                  placeholderTextColor={ThemeColorsSthetic.muted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.lastName && (
              <Text style={TextStyle.textError}>{errors.lastName.message}</Text>
            )}
          </View>
          <View style={localStyles.contentInput}>
            <Text style={localStyles.label}>* Numero de telefono</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                style={localStyles.contentLada}
                onPress={() => setOpenLadaModal((v) => !v)}
              >
                <ThemedText
                  style={
                    !ladaSelected
                      ? localStyles.textLadaPlaceholder
                      : localStyles.textLada
                  }
                >
                  {!ladaSelected
                    ? "Seleccione Lada"
                    : `${ladaSelected.lada} ${ladaSelected.code}`}
                </ThemedText>
              </Pressable>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{ ...localStyles.input, width: "60%" }}
                    placeholder="Ingrese su numero de telefono"
                    placeholderTextColor={ThemeColorsSthetic.muted}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    maxLength={13}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            {showErrorLada && (
              <Text style={TextStyle.textError}>La lada es requerida</Text>
            )}
            {errors.phone && (
              <Text style={TextStyle.textError}>{errors.phone.message}</Text>
            )}
          </View>
          <View style={localStyles.contentInput}>
            <Text style={localStyles.label}>* Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={localStyles.input}
                  placeholder="Ingrese su email"
                  placeholderTextColor={ThemeColorsSthetic.muted}
                  keyboardType="email-address"
                  onChangeText={(e) => onChange(e.toLowerCase())}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.email && (
              <Text style={TextStyle.textError}>{errors.email.message}</Text>
            )}
          </View>
          <View style={localStyles.contentInput}>
            <Text style={localStyles.label}>* Contraseña</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={localStyles.input}>
                  <TextInput
                    style={{ ...TextStyle.value, width: "80%" }}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={hiddenPass}
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor={ThemeColorsSthetic.muted}
                  />
                  <TouchableOpacity
                    style={localStyles.icon}
                    onPress={() => setHiddenPass((prev) => !prev)}
                  >
                    <Ionicons
                      name={hiddenPass ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={TextStyle.textError}>{errors.password.message}</Text>
            )}
          </View>
          <View style={localStyles.contentInput}>
            <Text style={localStyles.label}>* Confirmar Contraseña</Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={localStyles.input}>
                  <TextInput
                    style={{ ...TextStyle.value, width: "80%" }}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={hiddenConfirmPass}
                    placeholder="Ingrese nuevamente su contraseña"
                    placeholderTextColor={ThemeColorsSthetic.muted}
                  />
                  <TouchableOpacity
                    style={localStyles.icon}
                    onPress={() => setHiddenConfirmPass((prev) => !prev)}
                  >
                    <Ionicons
                      name={hiddenConfirmPass ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text style={TextStyle.textError}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>
          <View style={localStyles.contentCheck}>
            <Checkbox
              value={agreeConditions}
              onValueChange={handleAgreeConditions}
            />
            <Pressable onPress={() => setOpenAgreeConditionsModal((v) => !v)}>
              <ThemedText style={localStyles.textAgree}>
                Aceptar terminos y condiciones
              </ThemedText>
            </Pressable>
          </View>
          <View style={localStyles.contentButton}>
            <GeneralButton
              textBtn="Confirmar datos"
              styleText={TextStyle.fontBoldWhite}
              styleBtn={ButtonGeneralStyle.btnSaveSthetic}
              handleOnPress={handleSubmit(handleSavePersonalData)}
              disabledBtn={isLoading}
            />
            {isLoading && (
              <View style={{ marginTop: 10 }}>
                <LoadingView />
              </View>
            )}
          </View>
        </View>
        {openAgreeContitionsModal && (
          <PoliticsAndConditionsModal
            open={openAgreeContitionsModal}
            handleCloseModal={() => setOpenAgreeConditionsModal((v) => !v)}
          />
        )}
        <LadaOptionModal
          open={openLadaModal}
          handleCloseModal={() => setOpenLadaModal((v) => !v)}
          listLada={catalogLada}
          handleSelect={handleSelectLada}
        />
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  ContentForm: {
    alignItems: "center",
    marginTop: 5,
  },
  contentInput: {
    justifyContent: "center",
    width: "80%",
    height: 70,
    marginBottom: 10,
  },
  label: {
    ...TextStyle.label,
    marginBottom: 10,
  },
  input: {
    ...TextStyle.value,
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    textAlignVertical: "center", // Android
    paddingVertical: Platform.OS === PLATFORM_TYPE.IOS ? 10 : 0,
  },
  contentLada: {
    ...TextStyle.textNote,
    width: "35%",
    height: 40,
    borderWidth: 1,
    borderColor: ThemeColorsSthetic.muted,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textLadaPlaceholder: {
    ...TextStyle.textNote,
    height: 40,
    lineHeight: Platform.OS === PLATFORM_TYPE.ANDROID ? 50 : 40,
  },
  textLada: {
    ...TextStyle.value,
    height: 40,
    lineHeight: Platform.OS === PLATFORM_TYPE.ANDROID ? 50 : 40,
  },
  inputSelect: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
    position: "absolute",
    right: 10,
    marginTop: 6,
  },
  contentButton: {
    marginVertical: 15,
    width: "80%",
  },
  textAgree: {
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentCheck: {
    marginVertical: 10,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginHorizontal: "auto",
  },
  withKeyboard: { height: Platform.OS === PLATFORM_TYPE.IOS ? "50%" : "50%" },
  withoutKeyboard: { flex: 1 },
});

export default FormRegister;
