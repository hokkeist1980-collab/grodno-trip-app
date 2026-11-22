import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Stop } from "react-native-svg";
import { colors } from "../theme";

const NODES = [
  { key: "route", label: "Маршрут", x: 0.28, y: 0.30, glyph: "🗺" },
  { key: "stay", label: "Жильё", x: 0.72, y: 0.27, glyph: "🏠" },
  { key: "food", label: "Еда", x: 0.32, y: 0.66, glyph: "🍽" },
  { key: "budget", label: "Бюджет", x: 0.70, y: 0.68, glyph: "₽" },
] as const;

function stars(seed: number, n: number) {
  let s = seed;
  const rand = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  return Array.from({ length: n }, (_, i) => ({ id: i, x: rand(), y: rand(), r: rand() * 1.6 + 0.4, o: rand() * 0.5 + 0.2 }));
}

const STARS = stars(42, 70);

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const size = Math.min(width - 24, height * 0.62, 420);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.kicker}>ГРОДНО · 25–27 ДЕКАБРЯ</Text>
        <Text style={styles.title}>План поездки</Text>
        <Text style={styles.sub}>Нажми на точку, чтобы открыть раздел</Text>

        <View style={[styles.planetWrap, { width: size, height: size }]}>
          <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="planet" cx="38%" cy="35%" r="65%">
                <Stop offset="0%" stopColor="#2f5a4b" />
                <Stop offset="55%" stopColor="#1a352c" />
                <Stop offset="100%" stopColor="#0a1612" />
              </RadialGradient>
              <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                <Stop offset="70%" stopColor={colors.gold} stopOpacity="0" />
                <Stop offset="100%" stopColor={colors.gold} stopOpacity="0.18" />
              </RadialGradient>
            </Defs>
            {STARS.map((s) => (
              <Circle key={s.id} cx={s.x * size} cy={s.y * size} r={s.r} fill="#fff" opacity={s.o} />
            ))}
            <Circle cx={cx} cy={cy} r={r + 18} fill="url(#glow)" />
            <Circle cx={cx} cy={cy} r={r} fill="url(#planet)" stroke="rgba(216,178,106,0.35)" strokeWidth={1.5} />
            <Ellipse cx={cx} cy={cy} rx={r * 1.25} ry={r * 0.34} fill="none" stroke="rgba(216,178,106,0.18)" strokeWidth={1} transform={`rotate(-18 ${cx} ${cy})`} />
            <Path d={`M ${cx - r * 0.75} ${cy - r * 0.15} Q ${cx} ${cy - r * 0.45} ${cx + r * 0.78} ${cy + r * 0.1}`} stroke="rgba(111,207,151,0.12)" strokeWidth={10} fill="none" strokeLinecap="round" />
            <Path d={`M ${cx - r * 0.6} ${cy + r * 0.35} Q ${cx - r * 0.1} ${cy + r * 0.15} ${cx + r * 0.55} ${cy + r * 0.45}`} stroke="rgba(111,207,151,0.08)" strokeWidth={8} fill="none" strokeLinecap="round" />
            {NODES.map((n) => (
              <G key={n.key}>
                <Circle cx={n.x * size} cy={n.y * size} r={18} fill="rgba(216,178,106,0.08)" stroke="rgba(216,178,106,0.25)" strokeWidth={1} />
              </G>
            ))}
          </Svg>

          {NODES.map((n) => (
            <Pressable
              key={n.key}
              onPress={() => router.push(`/${n.key}` as Href)}
              style={({ pressed }) => [
                styles.node,
                { left: n.x * size - 34, top: n.y * size - 34 },
                pressed && styles.nodePressed,
              ]}
            >
              <Text style={styles.nodeGlyph}>{n.glyph}</Text>
              <Text style={styles.nodeLabel}>{n.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>6 человек · 2 машины · 278 км</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  kicker: { color: colors.gold, fontSize: 11, fontWeight: "700", letterSpacing: 1.4, marginBottom: 8 },
  title: { color: colors.text, fontSize: 34, fontWeight: "800", letterSpacing: -0.5 },
  sub: { color: colors.muted, fontSize: 13, marginTop: 6, marginBottom: 18 },
  planetWrap: { position: "relative" },
  node: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(22,42,34,0.88)",
    borderWidth: 1,
    borderColor: "rgba(216,178,106,0.45)",
  },
  nodePressed: { transform: [{ scale: 0.96 }], backgroundColor: "rgba(216,178,106,0.18)" },
  nodeGlyph: { fontSize: 20, lineHeight: 22 },
  nodeLabel: { color: colors.text, fontSize: 10, fontWeight: "700", marginTop: 2 },
  footer: { color: colors.muted, fontSize: 12, marginTop: 18 },
});

