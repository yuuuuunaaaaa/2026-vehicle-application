import { readSheet } from "@/lib/googleSheets";
import type { Member, Zone } from "@/types/member";

const SHEET = "members";

export async function getAllMembers(): Promise<Member[]> {
  const rows = await readSheet(`${SHEET}!A:B`);
  return rows
    .filter((r) => r[0] && r[1])
    .map((r) => ({ zone: r[0] as Zone, name: r[1] }));
}

export async function getMembersByZone(zone: Zone): Promise<Member[]> {
  const all = await getAllMembers();
  return all.filter((m) => m.zone === zone);
}
