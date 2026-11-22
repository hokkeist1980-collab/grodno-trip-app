import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle, G, Polyline, Rect, Text as SvgText } from "react-native-svg";
import type { Bounds, Day, MapPoint } from "../data";
import { colors } from "../theme";

type Props = {
  day: Day;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

const MAP_H = 280;

function computeBounds(points: MapPoint[]): Bounds {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const north = Math.max(...lats);
  const south = Math.min(...lats);
  const east = Math.max(...lngs);
  const west = Math.min(...lngs);
  const latPad = Math.max((north - south) * 0.12, 0.004);
  const lngPad = Math.max((east - west) * 0.12, 0.004);
  return { north: north + latPad, south: south - latPad, east: east + lngPad, west: west - lngPad };
}

function project(lat: number, lng: number, b: Bounds, w: number, h: number) {
  const x = ((lng - b.west) / (b.east - b.west || 1)) * w;
  const y = ((b.north - lat) / (b.north - b.south || 1)) * h;
  return { x, y };
}

const DAY_COLORS: Record<string, string> = { d1: "#d8b26a", d2: "#6fcf97", d3: "#8ecae6" };
const NEMAN: [number, number][] = [
  [53.6905, 23.806], [53.6875, 23.812], [53.683, 23.818], [53.6795, 23.822],
  [53.6765, 23.827], [53.6735, 23.834], [53.671, 23.842],
];

export function TripMap({ day, selectedId, onSelect }: Props) {
  const { width: winW } = useWindowDimensions();
  const [mode, setMode] = useState<"all" | "city">("all");
  const w = Math.max(280, Math.min(winW - 64, 520));
  const h = MAP_H;
  const allBounds = useMemo(() => computeBounds(day.map.points), [day]);
  const activeBounds = mode === "city" && day.map.cityBounds ? day.map.cityBounds : allBounds;
  const color = DAY_COLORS[day.id] ?? colors.gold;

  const pts = useMemo(
    () => day.map.points.map((p) => ({ ...p, ...project(p.lat, p.lng, activeBounds, w, h) })),
    [day, activeBounds, w, h]
  );
  const linePts = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const selected = day.map.points.find((p) => (p.eventKey ?? p.id) === selectedId || p.id === selectedId);

  const nemanPts = NEMAN.map(([lat, lng]) => {
    const pr = project(lat, lng, activeBounds, w, h);
    return `${pr.x},${pr.y}`;
  }).join(" ");

  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={styles.title}>Карта маршрута</Text>
        <View style={styles.btns}>
          <Pressable onPress={() => setMode("all")} style={[styles.btn, mode === "all" && styles.btnActive]}>
            <Text style={[styles.btnText, mode === "all" && styles.btnTextActive]}>Весь день</Text>
          </Pressable>
          {day.map.cityBounds ? (
            <Pressable onPress={() => setMode("city")} style={[styles.btn, mode === "city" && styles.btnActive]}>
              <Text style={[styles.btnText, mode === "city" && styles.btnTextActive]}>Центр</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={[styles.mapWrap, { width: w, height: h }]}>
        <Svg width={w} height={h}>
          <Rect x={0} y={0} width={w} height={h} fill="#0f211a" rx={12} />
          <Polyline points={nemanPts} fill="none" stroke="rgba(110,170,200,0.35)" strokeWidth={8} strokeLinecap="round" />
          <Polyline points={nemanPts} fill="none" stroke="rgba(140,210,240,0.25)" strokeWidth={3} strokeLinecap="round" />
          <Polyline points={linePts} fill="none" stroke={color} strokeWidth={2.5} strokeOpacity={0.75} strokeDasharray={day.id === "d1" ? "6 6" : undefined} />
          {pts.map((p, i) => {
            const key = p.eventKey ?? p.id;
            const active = selectedId === key || selectedId === p.id;
            const r = active ? 7 : p.kind === "route" ? 5 : 6;
            return (
              <G key={p.id} onPress={() => onSelect(active ? null : key)}>
                {active ? <Circle cx={p.x} cy={p.y} r={12} fill={color} opacity={0.18} /> : null}
                <Circle cx={p.x} cy={p.y} r={r} fill={p.kind === "route" ? "#162a22" : color} stroke={color} strokeWidth={2} />
                <SvgText x={p.x} y={p.y - 10} fill={active ? colors.text : colors.muted} fontSize={9} fontWeight="700" textAnchor="middle">
                  {i + 1}
                </SvgText>
              </G>
            );
          })}
        </Svg>
        <View style={styles.legend}>
          <View style={[styles.legendDot, { backgroundColor: color }]} />
          <Text style={styles.legendText}>{day.short} · {pts.length} точек</Text>
        </View>
      </View>

      {selected ? (
        <View style={styles.callout}>
          <Text style={styles.calloutTime}>{selected.t ?? "Точка маршрута"}</Text>
          <Text style={styles.calloutTitle}>{selected.label}</Text>
          {selected.p ? <Text style={styles.calloutPlace}>{selected.p}</Text> : null}
          {selected.n ? <Text style={styles.calloutNote}>{selected.n}</Text> : null}
        </View>
      ) : (
        <Text style={styles.hint}>Тапни по точке, чтобы увидеть детали. Переключай масштаб сверху.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  headRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 },
  title: { color: colors.text, fontSize: 15, fontWeight: "700" },
  btns: { flexDirection: "row", gap: 6 },
  btn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card2 },
  btnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  btnText: { color: colors.muted, fontSize: 11, fontWeight: "600" },
  btnTextActive: { color: colors.onGold },
  mapWrap: { alignSelf: "center", borderRadius: 12, overflow: "hidden", position: "relative" },
  legend: { position: "absolute", left: 10, bottom: 8, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(12,24,20,0.72)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.muted, fontSize: 11 },
  callout: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: colors.card2, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  calloutTime: { color: colors.gold, fontSize: 12, fontWeight: "700" },
  calloutTitle: { color: colors.text, fontSize: 14, fontWeight: "700", marginTop: 2 },
  calloutPlace: { color: colors.muted, fontSize: 12, marginTop: 2 },
  calloutNote: { color: "#7f9788", fontSize: 12, marginTop: 3 },
  hint: { color: colors.muted, fontSize: 12, marginTop: 10 },
});
