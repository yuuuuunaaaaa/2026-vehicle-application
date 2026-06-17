import { NextRequest, NextResponse } from "next/server";
import { getMembersByZone, getAllMembers } from "@/services/memberService";
import type { Zone } from "@/types/member";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const zone = searchParams.get("zone") as Zone | null;

  try {
    const members = zone
      ? await getMembersByZone(zone)
      : await getAllMembers();
    return NextResponse.json({ members });
  } catch (error) {
    console.error("[GET /api/members]", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
