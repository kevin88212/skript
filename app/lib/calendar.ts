import ical from "node-ical";

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  location?: string;
}

export async function getTodaysEvents(): Promise<CalendarEvent[]> {
  const icalUrl = process.env.GOOGLE_CALENDAR_ICAL_URL;
  if (!icalUrl || icalUrl === "DEINE_ICAL_URL_HIER") return [];

  try {
    const events = await ical.async.fromURL(icalUrl);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result: CalendarEvent[] = [];

    for (const ev of Object.values(events)) {
      if (!ev || ev.type !== "VEVENT") continue;
      const start = new Date(ev.start);
      if (start < today || start >= tomorrow) continue;

      result.push({
        title: String(ev.summary ?? "Termin"),
        start,
        end: ev.end ? new Date(ev.end) : start,
        location: ev.location ? String(ev.location) : undefined,
      });
    }

    return result.sort((a, b) => a.start.getTime() - b.start.getTime());
  } catch {
    return [];
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
}
