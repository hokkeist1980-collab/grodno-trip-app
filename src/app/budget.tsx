import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { ScenarioId, TRIP } from "../data";
import { colors } from "../theme";

const TIPS = [
  "Жильё — квартира вместо отеля: −60 BYN с человека.",
  "Завтраки готовить самим: −25 BYN за поездку.",
  "Обед по ланч-меню, ресторан — один раз.",
  "Два платных музея вместо пяти.",
];

export default function BudgetScreen() {
  const [scenario, setScenario] = useState<ScenarioId>("e");
  const { cats, scenarios } = TRIP.budget;
  const current = scenarios.find((s) => s.id === scenario) ?? scenarios[0];
  const max = Math.max(...cats.map((c) => c[scenario]));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.chips}>
          {scenarios.map((s) => {
            const active = s.id === scenario;
            return (
              <Pressable
                key={s.id}
                onPress={() => setScenario(s.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <View style={styles.bigRow}>
            <Text style={styles.big}>{current.total}</Text>
            <Text style={styles.bigUnit}>BYN с человека</Text>
          </View>
          <Text style={styles.cap}>{current.cap}</Text>

          <View style={styles.rows}>
            {cats.map((c) => {
              const v = c[scenario];
              return (
                <View key={c.k} style={styles.row}>
                  <Text style={styles.rowK}>{c.k}</Text>
                  <View style={styles.bar}>
                    <View style={[styles.fill, { width: `${Math.round((v / max) * 100)}%` }]} />
                  </View>
                  <Text style={styles.rowV}>{v}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.total}>
            <Text style={styles.totalText}>На группу, 6 чел.</Text>
            <Text style={styles.totalSum}>{current.total * 6} BYN</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>КАК СЭКОНОМИТЬ</Text>
          {TIPS.map((t) => (
            <View key={t} style={styles.tipRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.tip}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  chips: { flexDirection: "row", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: colors.onGold },
  card: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  bigRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  big: { color: colors.text, fontSize: 38, fontWeight: "800", letterSpacing: -1 },
  bigUnit: { color: colors.muted, fontSize: 12, paddingBottom: 6 },
  cap: { color: "#8aa294", fontSize: 12, marginTop: 2 },
  rows: { marginTop: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  rowK: { color: colors.muted, fontSize: 12, width: 78 },
  bar: { flex: 1, height: 8, borderRadius: 99, backgroundColor: colors.card2, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99, backgroundColor: colors.gold },
  rowV: { color: colors.text, fontSize: 13, fontWeight: "700", width: 40, textAlign: "right" },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    marginTop: 12,
    paddingTop: 12,
  },
  totalText: { color: colors.text, fontSize: 14, fontWeight: "800" },
  totalSum: { color: colors.gold, fontSize: 14, fontWeight: "800" },
  section: { color: colors.muted, fontSize: 11, letterSpacing: 1, fontWeight: "700", marginBottom: 8 },
  tipRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  bullet: { color: colors.gold, fontSize: 13 },
  tip: { color: colors.muted, fontSize: 13, flex: 1 },
});
