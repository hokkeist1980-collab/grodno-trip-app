import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, type ColorValue } from "react-native";
import * as Notifications from "expo-notifications";
import { colors } from "../theme";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

function TabIcon({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={[styles.icon, { color }]}>{glyph}</Text>;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: "#0f1f19",
            borderTopColor: colors.line,
            height: 64,
            paddingTop: 6,
            paddingBottom: 8,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
          sceneStyle: { backgroundColor: colors.bg },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Маршрут",
            tabBarIcon: ({ color }) => <TabIcon glyph="🗺" color={color} />,
          }}
        />
        <Tabs.Screen
          name="stay"
          options={{
            title: "Жильё",
            tabBarIcon: ({ color }) => <TabIcon glyph="🏠" color={color} />,
          }}
        />
        <Tabs.Screen
          name="food"
          options={{
            title: "Еда",
            tabBarIcon: ({ color }) => <TabIcon glyph="🍽" color={color} />,
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: "Бюджет",
            tabBarIcon: ({ color }) => <TabIcon glyph="💰" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 17, lineHeight: 20 },
});
