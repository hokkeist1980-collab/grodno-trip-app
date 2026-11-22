import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { TRIP } from "../data";
import { colors } from "../theme";

export default function FoodScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />
        <Text style={styles.section}>ЗАВТРАК · ОБЕД · УЖИН · КОФЕ</Text>

        {TRIP.food.map((f) => (
          <View key={f.name} style={styles.card}>
            <View style={styles.top}>
              <Text style={styles.name}>{f.name}</Text>
              <Text style={styles.check}>{f.check} BYN</Text>
            </View>
            <Text style={styles.meta}>
              {f.type} · {f.addr}
            </Text>
            <Text style={styles.note}>{f.note}</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${f.tel}`)} hitSlop={8}>
              <Text style={styles.link}>позвонить</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
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
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 10 },
  name: { color: colors.text, fontSize: 15, fontWeight: "700", flexShrink: 1 },
  check: { color: colors.gold, fontSize: 13, fontWeight: "800" },
  meta: { color: colors.muted, fontSize: 12, marginTop: 3 },
  note: { color: "#8aa294", fontSize: 12, marginTop: 5 },
  link: { color: colors.gold, fontSize: 12, marginTop: 8 },
});
