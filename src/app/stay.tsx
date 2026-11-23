import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { TRIP } from "../data";
import { colors } from "../theme";
import { BackHomeFab } from "../components/BackHomeFab";

export default function StayScreen() {
  const checkIn = "25.12.2026";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />
        <Text style={styles.section}>6 ЧЕЛОВЕК · 2 НОЧИ · 2 МАШИНЫ</Text>
        <Text style={styles.dateNote}>Доступные варианты на дату заезда: {checkIn}. Наличие и цену подтверждайте по телефону.</Text>

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
            {h.tel ? (
              <Pressable
                onPress={() => Linking.openURL(`tel:${h.tel}`)}
                style={({ pressed }) => [styles.callBtn, pressed && styles.callBtnPressed]}
                hitSlop={8}
              >
                <Text style={styles.callBtnText}>Позвонить</Text>
                <Text style={styles.callBtnSub}>{h.tel}</Text>
              </Pressable>
            ) : h.url ? (
              <Pressable
                onPress={() => Linking.openURL(h.url!)}
                style={({ pressed }) => [styles.linkBtn, pressed && styles.callBtnPressed]}
                hitSlop={8}
              >
                <Text style={styles.linkBtnText}>Открыть источник</Text>
                <Text style={styles.linkBtnSub}>{h.source ?? "kufar.by"}</Text>
              </Pressable>
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
  section: { color: colors.muted, fontSize: 11, letterSpacing: 1, fontWeight: "700", marginBottom: 6 },
  dateNote: { color: "#8aa294", fontSize: 12, marginBottom: 12 },
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
  price: { color: colors.gold, fontSize: 14, fontWeight: "800", textAlign: "right" },
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
  callBtn: {
    marginTop: 12,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  callBtnPressed: { opacity: 0.88, transform: [{ scale: 0.995 }] },
  callBtnText: { color: colors.onGold, fontSize: 14, fontWeight: "800" },
  callBtnSub: { color: "rgba(16,35,28,0.75)", fontSize: 12, fontWeight: "600" },
  linkBtn: {
    marginTop: 12,
    backgroundColor: "rgba(216,178,106,0.14)",
    borderWidth: 1,
    borderColor: "rgba(216,178,106,0.45)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkBtnText: { color: colors.gold, fontSize: 14, fontWeight: "800" },
  linkBtnSub: { color: colors.muted, fontSize: 12, fontWeight: "600" },
});
