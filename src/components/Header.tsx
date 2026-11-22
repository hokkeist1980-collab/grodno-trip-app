import { StyleSheet, Text, View } from "react-native";
import { TRIP } from "../data";
import { colors } from "../theme";

export function Header() {
  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>офлайн-данные</Text>
      </View>
      <Text style={styles.title}>{TRIP.title}</Text>
      <Text style={styles.sub}>{TRIP.sub}</Text>

      <View style={styles.stats}>
        {TRIP.stats.map((s) => (
          <View key={s.k} style={styles.stat}>
            <Text style={styles.statK}>{s.k}</Text>
            <Text style={styles.statV}>{s.v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 8, paddingBottom: 16 },
  pill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(111,207,151,0.35)",
    backgroundColor: "rgba(111,207,151,0.12)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  pillText: { color: colors.green, fontSize: 10, letterSpacing: 0.6, textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 38, fontWeight: "800", letterSpacing: -0.8 },
  sub: { color: colors.muted, fontSize: 13, marginTop: 4, marginBottom: 16 },
  stats: { flexDirection: "row", gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  statK: { color: colors.gold, fontSize: 13, fontWeight: "700" },
  statV: { color: colors.muted, fontSize: 9, marginTop: 2, textAlign: "center" },
});
