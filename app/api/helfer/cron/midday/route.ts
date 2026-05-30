import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/app/lib/telegram";
import { getGoalsFromNotion } from "@/app/lib/notion-helfer";

export async function GET(request: NextRequest) {
  if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await getGoalsFromNotion();

  const nudges = [
    "Kleiner Schritt zählt mehr als gar keiner!",
    "Prokrastination endet genau jetzt. Du schaffst das!",
    "Fang mit 5 Minuten an – der Rest kommt von selbst.",
    "Dein zukünftiges Ich wird dir danken.",
    "Fortschritt > Perfektion. Fang an!",
  ];
  const nudge = nudges[Math.floor(Math.random() * nudges.length)];

  let message = `☀️ <b>Mittagscheck!</b>\n\n`;
  message += `Hast du schon an deinen Zielen gearbeitet?\n\n`;

  if (goals.length > 0) {
    message += `🎯 <b>Zur Erinnerung:</b>\n`;
    for (const g of goals) {
      message += `  • ${g.text}\n`;
    }
    message += "\n";
  }

  message += `💬 <i>${nudge}</i>\n\n`;
  message += `Welche eine Sache kannst du jetzt in den nächsten 30 Minuten erledigen?`;

  await sendTelegramMessage(message);
  return NextResponse.json({ ok: true });
}
