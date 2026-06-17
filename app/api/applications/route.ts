import { NextRequest, NextResponse } from "next/server";
import {
  getApplicationsByZone,
  toggleApplication,
} from "@/services/applicationService";
import type { Zone } from "@/types/member";
import type { EventDate } from "@/types/application";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const zone = searchParams.get("zone") as Zone | null;

  if (!zone) {
    return NextResponse.json({ error: "zone is required" }, { status: 400 });
  }

  try {
    const applications = await getApplicationsByZone(zone);
    return NextResponse.json({ applications });
  } catch (error) {
    console.error("[GET /api/applications]", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zone, name, date } = body as {
      zone: Zone;
      name: string;
      date: EventDate;
    };

    if (!zone || !name || !date) {
      return NextResponse.json(
        { error: "zone, name, date are required" },
        { status: 400 }
      );
    }

    const result = await toggleApplication({ zone, name, date });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/applications]", error);
    return NextResponse.json(
      { error: "Failed to toggle application" },
      { status: 500 }
    );
  }
}
