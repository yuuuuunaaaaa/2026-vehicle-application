import { NextResponse } from "next/server";
import { getDateSummary } from "@/services/applicationService";

export async function GET() {
  try {
    const summary = await getDateSummary();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[GET /api/summary]", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
