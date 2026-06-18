import { NextRequest, NextResponse } from "next/server";
import {
  getMembersByZone,
  getAllMembers,
  addMember,
  updateMember,
  setMemberPaid,
  deleteMember,
} from "@/services/memberService";
import { updateApplicationsByMember, deleteApplicationsByMember } from "@/services/applicationService";
import { isAuthenticated } from "@/lib/auth";
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

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { zone, name, isMinor } = await request.json();
    if (!zone || !name) {
      return NextResponse.json({ error: "zone and name are required" }, { status: 400 });
    }
    const member = await addMember(zone as Zone, String(name).trim(), Boolean(isMinor));
    return NextResponse.json({ member });
  } catch (error) {
    console.error("[POST /api/members]", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, name, isMinor } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    }
    const numId = Number(id);
    const newName = String(name).trim();
    await updateApplicationsByMember(numId, newName);
    await updateMember(numId, newName, Boolean(isMinor));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PUT /api/members]", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, paid } = await request.json();
    if (id === undefined) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await setMemberPaid(Number(id), Boolean(paid));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/members]", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const numId = Number(id);
    await deleteApplicationsByMember(numId);
    await deleteMember(numId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/members]", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
