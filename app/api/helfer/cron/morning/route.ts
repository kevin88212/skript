export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/app/lib/telegram";
import { getGoalsFromNotion } from "@/app/lib/notion-helfer";
import { getTodaysEvents, formatTime } from "@/app/lib/calendar";

export async function GET(request: NextRequest) {
  if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [goals, events] = await Promise.all([
    getGoalsFromNotion(),
    getTodaysEvents(),
  ]);

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Berlin",
  });

  let message = `🌅 <b>Guten Morgen! ${today}</b>\n\n`;

  if (events.length > 0) {
    message += `📅 <b>Deine Termine heute:</b>\n`;
    for (const ev of events) {
      message += `  • ${formatTime(ev.start)} – ${ev.title}`;
      if (ev.location) message += ` (${ev.location})`;
      message += "\n";
    }
    message += "\n";
  } else {
    message += `📅 <b>Heute keine Termine</b> – freie Zeit für deine Ziele!\n\n`;
  }

  if (goals.length > 0) {
    message += `🎯 <b>Deine großen Ziele:</b>\n`;
    for (const g of goals) {
      message += `  • ${g.text}\n`;
    }
    message += "\n";
  }

  message += `💪 <b>Was sind deine Top 3 für heute?</b>\n`;
  message += `Schreib sie dir auf – und fang mit dem Wichtigsten an!\n\n`;
  message += `👉 Dein Dashboard: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://deine-app.vercel.app"}/helfer`;

  await sendTelegramMessage(message);
  return NextResponse.json({ ok: true });
}
