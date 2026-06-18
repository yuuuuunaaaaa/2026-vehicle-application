import { readSheet, clearAndWriteRows } from "@/lib/googleSheets";
import type { Member, Zone } from "@/types/member";

const SHEET = "members";
const RANGE = `${SHEET}!A:E`;

const MINOR_VALUES = ["Y", "YES", "예", "O", "TRUE", "1", "◯"];

function parseFlag(raw: string | undefined): boolean {
  return MINOR_VALUES.includes((raw ?? "").trim().toUpperCase());
}

function serializeMembers(members: Member[]): string[][] {
  return members.map((m) => [
    String(m.id),
    m.zone,
    m.name,
    m.isMinor ? "Y" : "N",
    m.paid ? "Y" : "N",
  ]);
}

export async function getAllMembers(): Promise<Member[]> {
  const rows = await readSheet(RANGE);
  return rows
    .filter((r) => r[0] && r[2])
    .map((r) => {
      const rawZone = (r[1] ?? "").trim();
      const zone = rawZone.endsWith("구역") ? rawZone : `${rawZone}구역`;
      return {
        id: parseInt(r[0], 10),
        zone: zone as Zone,
        name: r[2].trim(),
        isMinor: parseFlag(r[3]),
        paid: parseFlag(r[4]),
      };
    });
}

export async function getMembersByZone(zone: Zone): Promise<Member[]> {
  const all = await getAllMembers();
  return all.filter((m) => m.zone === zone);
}

export async function addMember(
  zone: Zone,
  name: string,
  isMinor: boolean
): Promise<Member> {
  const all = await getAllMembers();
  const newId = all.reduce((max, m) => Math.max(max, m.id), 0) + 1;
  const newMember: Member = { id: newId, zone, name, isMinor, paid: false };
  await clearAndWriteRows(RANGE, serializeMembers([...all, newMember]));
  return newMember;
}

export async function updateMember(
  id: number,
  name: string,
  isMinor: boolean
): Promise<void> {
  const all = await getAllMembers();
  const updated = all.map((m) => (m.id === id ? { ...m, name, isMinor } : m));
  await clearAndWriteRows(RANGE, serializeMembers(updated));
}

export async function setMemberPaid(id: number, paid: boolean): Promise<void> {
  const all = await getAllMembers();
  const updated = all.map((m) => (m.id === id ? { ...m, paid } : m));
  await clearAndWriteRows(RANGE, serializeMembers(updated));
}

export async function deleteMember(id: number): Promise<void> {
  const all = await getAllMembers();
  const updated = all.filter((m) => m.id !== id);
  await clearAndWriteRows(RANGE, serializeMembers(updated));
}
