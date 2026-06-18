import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getFareSummary } from "@/services/fareService";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const fare = await getFareSummary();
    return NextResponse.json({ fare });
  } catch (error) {
    console.error("[GET /api/fare]", error);
    return NextResponse.json({ error: "Failed to fetch fare" }, { status: 500 });
  }
}
