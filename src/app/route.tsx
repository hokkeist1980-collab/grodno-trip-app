import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { TripMap } from "../components/TripMap";
import { TRIP } from "../data";
import { cancelTripReminders, getReminderState, scheduleTripReminders } from "../notifications";
import { colors } from "../theme";
import { BackHomeFab } from "../components/BackHomeFab";

export default function RouteScreen() {
  const [dayId, setDayId] = useState(TRIP.days[0].id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remindersOn, setRemindersOn] = useState(false);
  const [remindersBusy, setRemindersBusy] = useState(false);
  const [remindersNote, setRemindersNote] = useState("");
  const day = TRIP.days.find((d) => d.id === dayId) ?? TRIP.days[0];

  useEffect(() => {
    getReminderState().then((s) => {
      setRemindersOn(s.enabled);
      if (!s.supported) setRemindersNote("Уведомления доступны в приложении на iOS/Android");
      else if (s.enabled) setRemindersNote(`Запланировано: ${s.scheduled}`);
    }).catch(() => {});
  }, []);

  async function toggleReminders() {
    if (Platform.OS === "web") {
      Alert.alert("Уведомления", "Локальные уведомления доступны в мобильном приложении (Expo Go/dev build).");
      return;
    }
    setRemindersBusy(true);
    try {
      if (remindersOn) {
        await cancelTripReminders();
        setRemindersOn(false);
        setRemindersNote("Напоминания выключены");
      } else {
        const res = await scheduleTripReminders();
        if (res.permissionDenied) {
          setRemindersNote("Разрешение на уведомления не выдано");
          Alert.alert("Уведомления", "Разреши уведомления в настройках устройства.");
        } else {
          setRemindersOn(res.scheduled > 0);
          setRemindersNote(res.scheduled > 0 ? `Запланировано: ${res.scheduled}, пропущено: ${res.skipped}` : "Все события уже в прошлом");
        }
      }
    } catch {
      setRemindersNote("Не удалось обновить напоминания");
    } finally {
      setRemindersBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.reminderCard}>
          <View style={styles.reminderTextWrap}>
            <Text style={styles.reminderTitle}>Напоминания о событиях</Text>
            <Text style={styles.reminderSub}>{remindersNote || "Локальные уведомления по времени маршрута (МСК +03)"}</Text>
          </View>
          <Pressable
            onPress={toggleReminders}
            disabled={remindersBusy}
            style={[styles.reminderBtn, remindersOn && styles.reminderBtnOn, remindersBusy && styles.reminderBtnBusy]}
          >
            <Text style={[styles.reminderBtnText, remindersOn && styles.reminderBtnTextOn]}>
              {remindersBusy ? "..." : remindersOn ? "Вкл" : "Выкл"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.chips}>
          {TRIP.days.map((d) => {
            const active = d.id === dayId;
            return (
              <Pressable
                key={d.id}
                onPress={() => {
                  setDayId(d.id);
                  setSelectedId(null);
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{d.short}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.head}>{day.head}</Text>
        <Text style={styles.date}>
          {day.date} · {day.items.length} точек
        </Text>

        <TripMap day={day} selectedId={selectedId} onSelect={setSelectedId} />

        <View style={styles.card}>
          <View style={styles.line} />
          {day.items.map((it) => {
            const key = it.t + it.h;
            const active = selectedId === key;
            return (
              <Pressable key={key} style={styles.ev} onPress={() => setSelectedId(active ? null : key)}>
                <View style={[styles.dot, active && styles.dotActive]} />
                <Text style={styles.time}>{it.t}</Text>
                <Text style={[styles.evHead, active && styles.evHeadActive]}>{it.h}</Text>
                <Text style={styles.place}>{it.p}</Text>
                {it.n ? <Text style={styles.note}>{it.n}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <BackHomeFab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingBottom: 28 },
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  reminderTextWrap: { flex: 1 },
  reminderTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  reminderSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  reminderBtn: { minWidth: 64, alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card2 },
  reminderBtnOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  reminderBtnBusy: { opacity: 0.6 },
  reminderBtnText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  reminderBtnTextOn: { color: colors.onGold },
  chips: { flexDirection: "row", gap: 8, marginBottom: 18 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: colors.onGold },
  head: { color: colors.text, fontSize: 21, fontWeight: "700" },
  date: { color: colors.muted, fontSize: 13, marginTop: 2, marginBottom: 16 },
  card: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 16,
    paddingLeft: 34,
    position: "relative",
  },
  line: {
    position: "absolute",
    left: 20,
    top: 22,
    bottom: 22,
    width: 2,
    borderRadius: 2,
    backgroundColor: "rgba(216,178,106,0.35)",
  },
  ev: { marginBottom: 18 },
  dot: {
    position: "absolute",
    left: -20,
    top: 4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  dotActive: { width: 11, height: 11, left: -21, top: 3, backgroundColor: "#fff1c8" },
  time: { color: colors.gold, fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },
  evHead: { color: colors.text, fontSize: 15, fontWeight: "600", marginTop: 2 },
  evHeadActive: { color: colors.gold },
  place: { color: colors.muted, fontSize: 13, marginTop: 1 },
  note: { color: "#7f9788", fontSize: 12, marginTop: 3 },
});
