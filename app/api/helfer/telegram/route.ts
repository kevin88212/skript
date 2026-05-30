import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage } from "@/app/lib/telegram";

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  if (!message) {
    return NextResponse.json({ error: "Keine Nachricht" }, { status: 400 });
  }
  const result = await sendTelegramMessage(message);
  return NextResponse.json(result);
}
