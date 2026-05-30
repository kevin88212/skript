import { NextResponse } from "next/server";
import { getGoalsFromNotion } from "@/app/lib/notion-helfer";

export async function GET() {
  const goals = await getGoalsFromNotion();
  return NextResponse.json({ goals });
}
