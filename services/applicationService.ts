import { readSheet, clearAndWriteRows } from "@/lib/googleSheets";
import { getAllMembers, getMembersByZone } from "@/services/memberService";
import { compareZones } from "@/lib/zoneSort";
import type {
  Application,
  ApplicationKey,
  DateSummary,
  Direction,
  EventDate,
  ZoneMemberSummary,
  ZoneSummaryForDate,
} from "@/types/application";
import { EVENT_DATES } from "@/types/application";
import type { Zone } from "@/types/member";

const SHEET = "applications";
const RANGE = `${SHEET}!A:G`;

async function fetchAllApplications(): Promise<Application[]> {
  const rows = await readSheet(RANGE);
  return rows
    .filter((r) => r[0] && r[2] && r[3] && r[4])
    .map((r) => ({
      idx: parseInt(r[0], 10),
      memberIdx: parseInt(r[1] ?? "0", 10) || 0,
      zone: r[2] as Zone,
      name: r[3],
      date: r[4] as EventDate,
      updated_at: r[5] ?? "",
      direction: (r[6] as Direction) || "both",
    }));
}

function serializeApplications(apps: Application[]): string[][] {
  return apps.map((a) => [
    String(a.idx),
    String(a.memberIdx),
    a.zone,
    a.name,
    a.date,
    a.updated_at,
    a.direction,
  ]);
}

function nextIdx(apps: Application[]): number {
  return apps.reduce((max, a) => Math.max(max, a.idx), 0) + 1;
}

export async function getApplicationsByZone(
  zone: Zone
): Promise<Application[]> {
  const all = await fetchAllApplications();
  return all.filter((a) => a.zone === zone);
}

export async function getApplicationsByDate(
  date: EventDate
): Promise<Application[]> {
  const all = await fetchAllApplications();
  return all.filter((a) => a.date === date);
}

export async function toggleApplication(key: ApplicationKey): Promise<{
  action: "added" | "removed";
}> {
  const [all, zoneMembers] = await Promise.all([
    fetchAllApplications(),
    getMembersByZone(key.zone),
  ]);

  const memberIdxMap = new Map(zoneMembers.map((m) => [m.name, m.id]));
  const existingIdx = all.findIndex(
    (a) => a.zone === key.zone && a.name === key.name && a.date === key.date
  );

  let updated: Application[];
  let action: "added" | "removed";

  if (existingIdx !== -1) {
    updated = all.filter((_, i) => i !== existingIdx);
    action = "removed";
  } else {
    const newApp: Application = {
      idx: nextIdx(all),
      memberIdx: memberIdxMap.get(key.name) ?? 0,
      zone: key.zone,
      name: key.name,
      date: key.date,
      updated_at: new Date().toISOString(),
      direction: "both",
    };
    updated = [...all, newApp];
    action = "added";
  }

  await clearAndWriteRows(RANGE, serializeApplications(updated));
  return { action };
}

export async function setApplicationsForZoneDate(
  zone: Zone,
  date: EventDate,
  entries: { name: string; direction: Direction }[]
): Promise<void> {
  const [all, zoneMembers] = await Promise.all([
    fetchAllApplications(),
    getMembersByZone(zone),
  ]);

  const memberIdxMap = new Map(zoneMembers.map((m) => [m.name, m.id]));
  const others = all.filter((a) => !(a.zone === zone && a.date === date));
  let idxCounter = nextIdx(others);

  const newApps: Application[] = entries.map(({ name, direction }) => ({
    idx: idxCounter++,
    memberIdx: memberIdxMap.get(name) ?? 0,
    zone,
    name,
    date,
    updated_at: new Date().toISOString(),
    direction,
  }));

  await clearAndWriteRows(RANGE, serializeApplications([...others, ...newApps]));
}

export async function updateApplicationsByMember(
  memberIdx: number,
  newName: string
): Promise<void> {
  const all = await fetchAllApplications();
  const updated = all.map((a) =>
    a.memberIdx === memberIdx ? { ...a, name: newName } : a
  );
  await clearAndWriteRows(RANGE, serializeApplications(updated));
}

export async function deleteApplicationsByMember(
  memberIdx: number
): Promise<void> {
  const all = await fetchAllApplications();
  const updated = all.filter((a) => a.memberIdx !== memberIdx);
  await clearAndWriteRows(RANGE, serializeApplications(updated));
}

export async function getAllApplications(): Promise<Application[]> {
  return fetchAllApplications();
}

export async function getDateSummary(): Promise<DateSummary[]> {
  const all = await fetchAllApplications();
  return EVENT_DATES.map((date) => {
    const apps = all.filter((a) => a.date === date);
    return {
      date,
      count: apps.length,
      outboundCount: apps.filter((a) => a.direction !== "return").length,
      returnCount: apps.filter((a) => a.direction !== "outbound").length,
    };
  });
}

export async function getZoneSummaryForDate(
  date: EventDate
): Promise<ZoneSummaryForDate[]> {
  const [apps, allMembers] = await Promise.all([
    getApplicationsByDate(date),
    getAllMembers(),
  ]);

  const minorLookup = new Map<string, boolean>(
    allMembers.map((m) => [`${m.zone}::${m.name}`, m.isMinor])
  );

  const zoneMap = new Map<Zone, ZoneMemberSummary[]>();
  for (const app of apps) {
    const existing = zoneMap.get(app.zone) ?? [];
    existing.push({
      name: app.name,
      isMinor: minorLookup.get(`${app.zone}::${app.name}`) ?? false,
      direction: app.direction,
    });
    zoneMap.set(app.zone, existing);
  }
  return Array.from(zoneMap.entries())
    .sort(([a], [b]) => compareZones(a, b))
    .map(([zone, members]) => ({
      zone,
      count: members.length,
      members,
    }));
}
