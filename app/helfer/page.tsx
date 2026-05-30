"use client";

import { useEffect, useState } from "react";

interface Goal {
  text: string;
}

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  location?: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
}

function getGreeting() {
  const hour = new Date().toLocaleString("de-DE", {
    hour: "numeric",
    hour12: false,
    timeZone: "Europe/Berlin",
  });
  const h = parseInt(hour);
  if (h < 12) return "Guten Morgen";
  if (h < 18) return "Guten Tag";
  return "Guten Abend";
}

function isEvening() {
  const hour = parseInt(
    new Date().toLocaleString("de-DE", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Berlin",
    })
  );
  return hour >= 18;
}

export default function HelferPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [top3, setTop3] = useState(["", "", ""]);
  const [reflection, setReflection] = useState({ gut: "", besser: "", morgen: "" });
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/helfer/notion").then((r) => r.json()),
      fetch("/api/helfer/calendar").then((r) => r.json()),
    ]).then(([notionData, calData]) => {
      setGoals(notionData.goals ?? []);
      setEvents(calData.events ?? []);
      setLoading(false);
    });
  }, []);

  async function sendTelegram(message: string) {
    setSending(true);
    await fetch("/api/helfer/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setSending(false);
    setSentMsg("Gesendet!");
    setTimeout(() => setSentMsg(""), 3000);
  }

  async function sendMorningMessage() {
    const goalLines = goals.map((g) => `• ${g.text}`).join("\n");
    const eventLines =
      events.length > 0
        ? events.map((e) => `• ${formatTime(e.start)} – ${e.title}`).join("\n")
        : "Keine Termine heute";
    const top3Lines = top3.filter(Boolean).map((t) => `• ${t}`).join("\n");

    const msg =
      `🌅 <b>Guten Morgen!</b>\n\n` +
      `📅 <b>Termine:</b>\n${eventLines}\n\n` +
      `🎯 <b>Ziele:</b>\n${goalLines}\n\n` +
      (top3Lines ? `✅ <b>Meine Top 3 heute:</b>\n${top3Lines}` : "");

    await sendTelegram(msg);
  }

  async function sendReflection() {
    const msg =
      `🌙 <b>Abend-Reflexion</b>\n\n` +
      `✅ <b>Was lief gut:</b>\n${reflection.gut}\n\n` +
      `📈 <b>Was ich verbessern kann:</b>\n${reflection.besser}\n\n` +
      `🎯 <b>Für morgen:</b>\n${reflection.morgen}`;
    await sendTelegram(msg);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-12">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-900 to-gray-950 px-5 pt-12 pb-8">
        <p className="text-indigo-300 text-sm font-medium">{today}</p>
        <h1 className="text-3xl font-bold mt-1">{getGreeting()}</h1>
        <p className="text-gray-400 text-sm mt-1">Dein persönlicher Tageshelfer</p>
      </div>

      <div className="px-5 space-y-6 mt-2">
        {/* Ziele */}
        <section>
          <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Deine Ziele
          </h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : goals.length > 0 ? (
            <div className="space-y-2">
              {goals.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3"
                >
                  <span className="text-lg">{["🎯", "🚀", "💡"][i] ?? "⭐"}</span>
                  <span className="text-sm font-medium">{g.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl px-4 py-3 text-gray-400 text-sm">
              Keine Ziele in Notion gefunden
            </div>
          )}
        </section>

        {/* Heutige Termine */}
        <section>
          <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Termine heute
          </h2>
          {loading ? (
            <div className="h-16 bg-gray-800 rounded-xl animate-pulse" />
          ) : events.length > 0 ? (
            <div className="space-y-2">
              {events.map((ev, i) => (
                <div key={i} className="flex gap-3 bg-gray-800 rounded-xl px-4 py-3">
                  <div className="text-center min-w-[48px]">
                    <div className="text-indigo-400 font-bold text-sm">{formatTime(ev.start)}</div>
                    <div className="text-gray-500 text-xs">{formatTime(ev.end)}</div>
                  </div>
                  <div className="border-l border-gray-700 pl-3">
                    <div className="text-sm font-medium">{ev.title}</div>
                    {ev.location && (
                      <div className="text-xs text-gray-400 mt-0.5">{ev.location}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl px-4 py-3 text-gray-400 text-sm">
              {process.env.NODE_ENV === "development" && !process.env.GOOGLE_CALENDAR_ICAL_URL
                ? "iCal URL noch nicht konfiguriert"
                : "Heute keine Termine"}
            </div>
          )}
        </section>

        {/* Top 3 des Tages */}
        <section>
          <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Meine Top 3 heute
          </h2>
          <div className="bg-gray-800 rounded-xl p-4 space-y-3">
            {top3.map((val, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold text-sm w-5">{i + 1}.</span>
                <input
                  value={val}
                  onChange={(e) => {
                    const next = [...top3];
                    next[i] = e.target.value;
                    setTop3(next);
                  }}
                  placeholder={
                    ["Wichtigste Aufgabe heute", "Zweite Priorität", "Dritte Priorität"][i]
                  }
                  className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-500"
                />
              </div>
            ))}
            <button
              onClick={sendMorningMessage}
              disabled={sending || top3.every((t) => !t.trim())}
              className="w-full mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              {sending ? "Wird gesendet..." : "An Telegram senden"}
            </button>
            {sentMsg && <p className="text-center text-green-400 text-sm">{sentMsg}</p>}
          </div>
        </section>

        {/* Abend-Reflexion (nur ab 18 Uhr sichtbar) */}
        {isEvening() && (
          <section>
            <h2 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              Abend-Reflexion
            </h2>
            <div className="bg-gray-800 rounded-xl p-4 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Was lief heute gut?</label>
                <textarea
                  value={reflection.gut}
                  onChange={(e) => setReflection({ ...reflection, gut: e.target.value })}
                  placeholder="Auch kleine Erfolge zählen..."
                  rows={2}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Was kann ich verbessern?</label>
                <textarea
                  value={reflection.besser}
                  onChange={(e) => setReflection({ ...reflection, besser: e.target.value })}
                  placeholder="Ohne Selbstkritik – nur beobachten..."
                  rows={2}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Was nehme ich mir für morgen vor?</label>
                <textarea
                  value={reflection.morgen}
                  onChange={(e) => setReflection({ ...reflection, morgen: e.target.value })}
                  placeholder="Nur 1-2 konkrete Dinge..."
                  rows={2}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-500 resize-none"
                />
              </div>
              <button
                onClick={sendReflection}
                disabled={sending || !reflection.gut.trim()}
                className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                {sending ? "Wird gesendet..." : "Reflexion speichern & senden"}
              </button>
              {sentMsg && <p className="text-center text-green-400 text-sm">{sentMsg}</p>}
            </div>
          </section>
        )}

        {/* Anti-Prokrastination Nudge */}
        <section className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-4">
          <p className="text-xs text-indigo-300 font-semibold uppercase tracking-widest mb-1">
            Tipp gegen Prokrastination
          </p>
          <p className="text-sm text-white font-medium">
            Fang mit der kleinsten möglichen Aktion an. Nicht planen — tun.
            Auch 5 Minuten zählen.
          </p>
        </section>
      </div>
    </main>
  );
}
