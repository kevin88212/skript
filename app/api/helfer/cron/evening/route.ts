import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/app/lib/telegram";

export async function GET(request: NextRequest) {
  if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message =
    `🌙 <b>Abend-Reflexion</b>\n\n` +
    `Nimm dir 5 Minuten für dich. Schreib deine Antworten auf:\n\n` +
    `<b>1. Was lief heute gut?</b>\n` +
    `   (Auch kleine Dinge zählen!)\n\n` +
    `<b>2. Was hätte besser laufen können?</b>\n` +
    `   (Ohne Selbstkritik – nur beobachten)\n\n` +
    `<b>3. Was nimmst du dir für morgen vor?</b>\n` +
    `   (Nur 1-2 konkrete Dinge)\n\n` +
    `Du hast heute etwas bewegt. Ruh dich gut aus!`;

  await sendTelegramMessage(message);
  return NextResponse.json({ ok: true });
}
