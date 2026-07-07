import { NextRequest, NextResponse } from "next/server";
import {
  getApplicationsByZone,
  toggleApplication,
  setApplicationsForZoneDate,
} from "@/services/applicationService";
import { isAuthenticated } from "@/lib/auth";
import type { Zone } from "@/types/member";
import type { Direction, EventDate } from "@/types/application";

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
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { zone, date, entries } = body as {
      zone: Zone;
      date: EventDate;
      entries: { name: string; direction: Direction }[];
    };

    if (!zone || !date || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: "zone, date, entries are required" },
        { status: 400 }
      );
    }

    await setApplicationsForZoneDate(zone, date, entries);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PUT /api/applications]", error);
    return NextResponse.json(
      { error: "Failed to save applications" },
      { status: 500 }
    );
  }
}
