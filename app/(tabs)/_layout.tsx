import { Tabs, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getStoreSession, KEY_STORE } from "@/hooks/StoreDataSecure";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useApiProvider } from "@/provider/InterceptorProvider";

export default function TabLayout() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { token, setToken } = useApiProvider();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getStoreSession({ key: KEY_STORE.userToken }).then((value) => {
      if (!value) return navigation.navigate("login" as never);
      else setToken(value);
    });
  }, [token]);

  return (
    <View
      style={{
        ...localStyle.container,
        paddingTop: insets.top,
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
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: "absolute",
              },
              default: {},
            }),
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
    </View>
  );
}

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
});
