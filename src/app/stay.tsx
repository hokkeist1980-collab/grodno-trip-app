import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { TRIP } from "../data";
import { colors } from "../theme";
import { BackHomeFab } from "../components/BackHomeFab";

export default function StayScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />
        <Text style={styles.section}>6 ЧЕЛОВЕК · 2 НОЧИ · 2 МАШИНЫ</Text>

        {TRIP.hotels.map((h) => (
          <View key={h.name} style={[styles.card, h.best && styles.cardBest]}>
            <View style={styles.top}>
              <Text style={styles.name}>{h.name}</Text>
              <Text style={styles.price}>{h.price}</Text>
            </View>
            <Text style={styles.meta}>
              {h.type} · {h.unit}
            </Text>
            <Text style={styles.meta}>
              🅿 {h.parking} · 📍 {h.dist}
            </Text>
            <Text style={styles.note}>{h.note}</Text>
            {h.best ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>рекомендуем</Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
      <BackHomeFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  section: { color: colors.muted, fontSize: 11, letterSpacing: 1, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  cardBest: { borderWidth: 1, borderColor: "rgba(216,178,106,0.5)" },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 10 },
  name: { color: colors.text, fontSize: 15, fontWeight: "700", flexShrink: 1 },
  price: { color: colors.gold, fontSize: 15, fontWeight: "800" },
  meta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  note: { color: "#8aa294", fontSize: 12, marginTop: 6 },
  tag: {
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(216,178,106,0.4)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { color: colors.gold, fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase" },
});
