export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getTodaysEvents } from "@/app/lib/calendar";

export async function GET() {
  const events = await getTodaysEvents();
  return NextResponse.json({ events });
}
