import { NextRequest, NextResponse } from "next/server";
import { getZoneSummaryForDate } from "@/services/applicationService";
import type { EventDate } from "@/types/application";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;

  try {
    const summary = await getZoneSummaryForDate(date as EventDate);
    return NextResponse.json({ date, summary });
  } catch (error) {
    console.error("[GET /api/summary/[date]]", error);
    return NextResponse.json(
      { error: "Failed to fetch date summary" },
      { status: 500 }
    );
  }
}
