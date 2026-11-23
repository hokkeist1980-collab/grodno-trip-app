import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

export function BackHomeFab({ style }: { style?: ViewStyle }) {
  const router = useRouter();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="На главную"
      onPress={() => router.replace("/")}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed, style]}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M15 5L8 12L15 19" stroke={colors.onGold} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
});
