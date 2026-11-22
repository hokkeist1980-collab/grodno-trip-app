import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { AndroidImportance, IosAuthorizationStatus, SchedulableTriggerInputTypes } from "expo-notifications";
import { TRIP, type Day, type Event } from "./data";

const SOURCE = "grodno-trip";
const DAY_DATE: Record<string, string> = { d1: "2026-12-25", d2: "2026-12-26", d3: "2026-12-27" };

export type ReminderState = { supported: boolean; enabled: boolean; scheduled: number; permission: string };

function eventDate(dayId: string, t: string): Date | null {
  const d = DAY_DATE[dayId];
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t);
  if (!d || !m) return null;
  const date = new Date(`${d}T${m[1]}:${m[2]}:00+03:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isSupported() {
  return Platform.OS === "ios" || Platform.OS === "android";
}

export async function getReminderState(): Promise<ReminderState> {
  if (!isSupported()) return { supported: false, enabled: false, scheduled: 0, permission: "unsupported" };
  const perms = await Notifications.getPermissionsAsync();
  const all = await Notifications.getAllScheduledNotificationsAsync();
  const ours = all.filter((n) => n.content.data?.source === SOURCE);
  return { supported: true, enabled: ours.length > 0, scheduled: ours.length, permission: perms.status };
}

async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === IosAuthorizationStatus.PROVISIONAL) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted || req.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

export async function cancelTripReminders() {
  if (!isSupported()) return;
  const all = await Notifications.getAllScheduledNotificationsAsync();
  const ours = all.filter((n) => n.content.data?.source === SOURCE);
  await Promise.all(ours.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

function eventBody(day: Day, ev: Event) {
  const parts = [ev.p, ev.n].filter(Boolean);
  return parts.join(" · ");
}

export async function scheduleTripReminders(): Promise<{ scheduled: number; skipped: number; permissionDenied?: boolean }> {
  if (!isSupported()) return { scheduled: 0, skipped: 0 };
  const ok = await ensurePermission();
  if (!ok) return { scheduled: 0, skipped: 0, permissionDenied: true };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("trip-events", {
      name: "События поездки",
      importance: AndroidImportance.DEFAULT,
    });
  }

  await cancelTripReminders();
  const now = Date.now();
  let scheduled = 0;
  let skipped = 0;

  for (const day of TRIP.days) {
    for (const ev of day.items) {
      const date = eventDate(day.id, ev.t);
      if (!date || date.getTime() <= now) {
        skipped++;
        continue;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${ev.t} · ${ev.h}`,
          body: eventBody(day, ev),
          data: { source: SOURCE, dayId: day.id, eventTime: ev.t, eventTitle: ev.h },
          ...(Platform.OS === "android" ? { channelId: "trip-events" } : {}),
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DATE,
          date,
          ...(Platform.OS === "android" ? { channelId: "trip-events" } : {}),
        },
      });
      scheduled++;
    }
  }
  return { scheduled, skipped };
}
