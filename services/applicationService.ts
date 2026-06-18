import { readSheet, clearAndWriteRows } from "@/lib/googleSheets";
import { getMembersByZone, getAllMembers } from "@/services/memberService";
import type {
  Application,
  ApplicationKey,
  DateSummary,
  EventDate,
  ZoneSummaryForDate,
} from "@/types/application";
import { EVENT_DATES } from "@/types/application";
import type { Zone } from "@/types/member";

const SHEET = "applications";
const RANGE = `${SHEET}!A:F`;

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
  names: string[]
): Promise<void> {
  const [all, zoneMembers] = await Promise.all([
    fetchAllApplications(),
    getMembersByZone(zone),
  ]);

  const memberIdxMap = new Map(zoneMembers.map((m) => [m.name, m.id]));
  const others = all.filter((a) => !(a.zone === zone && a.date === date));
  let idxCounter = nextIdx(others);

  const newApps: Application[] = names.map((name) => ({
    idx: idxCounter++,
    memberIdx: memberIdxMap.get(name) ?? 0,
    zone,
    name,
    date,
    updated_at: new Date().toISOString(),
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

export async function getDateSummary(): Promise<DateSummary[]> {
  const all = await fetchAllApplications();
  return EVENT_DATES.map((date) => ({
    date,
    count: all.filter((a) => a.date === date).length,
  }));
}

export async function getZoneSummaryForDate(
  date: EventDate
): Promise<ZoneSummaryForDate[]> {
  const [apps, allMembers] = await Promise.all([
    getApplicationsByDate(date),
    getAllMembers(),
  ]);

  const paidMap = new Map(
    allMembers.map((m) => [`${m.zone}:${m.name}`, m.paid])
  );

  const zoneMap = new Map<Zone, string[]>();
  for (const app of apps) {
    const existing = zoneMap.get(app.zone) ?? [];
    existing.push(app.name);
    zoneMap.set(app.zone, existing);
  }

  const minorMap = new Map(
    allMembers.map((m) => [`${m.zone}:${m.name}`, m.isMinor])
  );

  return Array.from(zoneMap.entries()).map(([zone, members]) => ({
    zone,
    count: members.length,
    members,
    paidMembers: members.filter((name) => paidMap.get(`${zone}:${name}`) === true),
    minorMembers: members.filter((name) => minorMap.get(`${zone}:${name}`) === true),
  }));
}

export async function getApplicantCounts(): Promise<{ zone: Zone; name: string; count: number }[]> {
  const all = await fetchAllApplications();
  const countMap = new Map<string, { zone: Zone; name: string; count: number }>();
  for (const app of all) {
    const key = `${app.zone}:${app.name}`;
    const existing = countMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      countMap.set(key, { zone: app.zone, name: app.name, count: 1 });
    }
  }
  return Array.from(countMap.values());
}

export async function getUniqueApplicants(): Promise<{ zone: Zone; name: string }[]> {
  const all = await fetchAllApplications();
  const seen = new Set<string>();
  const unique: { zone: Zone; name: string }[] = [];
  for (const app of all) {
    const key = `${app.zone}:${app.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ zone: app.zone, name: app.name });
    }
  }
  return unique;
}
