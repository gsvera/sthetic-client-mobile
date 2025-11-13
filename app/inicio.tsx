import { ThemedText } from "@/components/ThemedText";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { TextStyle } from "@/constants/StyleComponents";
import GeneralButton from "@/components/Shared/GeneralButton";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import {
  PLATFORM_TYPE,
  VERSION_ANDROID,
  VERSION_IOS,
} from "@/constants/Constants";
import { Platform } from "react-native";

export default function Login() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const imageBg = require("@/assets/images/background.webp");
  const { token } = useApiProvider();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" as never }],
      });
    }
  }, [token]);

  const nextWithoutLogin = () => {
    navigation.navigate("preview" as never);
  };

  const nextToLogin = () => {
    navigation.navigate("login" as never);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor:
          colorScheme === "dark"
            ? ThemeColorsSthetic.backgroundStrong
            : ThemeColorsSthetic.backgroundLight,
      }}
    >
      <ImageBackground source={imageBg} style={styles.imgBg}>
        <View style={styles.withoutKeyboard}>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <View style={styles.imgContainer}>
                <Image
                  source={require("@/assets/images/meredith-aesthetic-logo-icon.png")}
                  style={styles.logo}
                />
              </View>
              <View style={{ marginTop: 70 }}>
                <View>
                  <GeneralButton
                    textBtn="Continuar sin registrarme"
                    styleText={styles.textNextWithoueLogin}
                    styleBtn={styles.nextWithoutLogin}
                    handleOnPress={nextWithoutLogin}
                  />
                </View>
                <View style={{ marginVertical: 20 }}>
                  <ThemedText
                    style={{
                      color: ThemeColorsSthetic.textTitle,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    O
                  </ThemedText>
                </View>
                <View>
                  <GeneralButton
                    textBtn="Iniciar sesión / Registrarme"
                    styleText={styles.textNextWithoueLogin}
                    styleBtn={styles.nextLogin}
                    handleOnPress={nextToLogin}
                  />
                </View>
              </View>
              <View style={{ marginTop: 100 }}>
                <ThemedText
                  style={{
                    ...TextStyle.fontBoldCancel,
                    ...TextStyle.center,
                  }}
                >
                  {Platform.OS === PLATFORM_TYPE.IOS
                    ? VERSION_IOS
                    : VERSION_ANDROID}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  textNextWithoueLogin: {
    color: ThemeColorsSthetic.textLight,
    fontWeight: "bold",
  },
  nextWithoutLogin: {
    backgroundColor: ThemeColorsSthetic.updateNotification,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nextLogin: {
    backgroundColor: ThemeColorsSthetic.accent,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imgContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imgBg: {
    width: "100%",
    height: "100%",
  },
  logo: {
    height: 180,
    width: 180,
    marginTop: 70,
  },
  title: {
    paddingTop: 20,
    marginBottom: 60,
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    color: ThemeColorsSthetic.primary,
  },
  label: {
    color: ThemeColorsSthetic.textTitle,
    textAlign: "center",
    marginBottom: 5,
  },
  centerInput: {
    justifyContent: "center",
    marginTop: 15,
  },
  icon: {
    position: "absolute",
    marginVertical: "auto",
    top: 5,
    right: 10,
  },
  textInteraction: {
    textAlign: "center",
    color: ThemeColorsSthetic.primary,
    marginBottom: 10,
  },
  withoutKeyboard: { flex: 1 },
});
