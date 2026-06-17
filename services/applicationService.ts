import { readSheet, clearAndWriteRows } from "@/lib/googleSheets";
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
const RANGE = `${SHEET}!A:D`;

async function fetchAllApplications(): Promise<Application[]> {
  const rows = await readSheet(RANGE);
  return rows
    .filter((r) => r[0] && r[1] && r[2])
    .map((r) => ({
      zone: r[0] as Zone,
      name: r[1],
      date: r[2] as EventDate,
      updated_at: r[3] ?? "",
    }));
}

function serializeApplications(apps: Application[]): string[][] {
  return apps.map((a) => [a.zone, a.name, a.date, a.updated_at]);
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
  const all = await fetchAllApplications();
  const idx = all.findIndex(
    (a) => a.zone === key.zone && a.name === key.name && a.date === key.date
  );

  let updated: Application[];
  let action: "added" | "removed";

  if (idx !== -1) {
    updated = all.filter((_, i) => i !== idx);
    action = "removed";
  } else {
    const newApp: Application = {
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
  const apps = await getApplicationsByDate(date);
  const zoneMap = new Map<Zone, string[]>();

  for (const app of apps) {
    const existing = zoneMap.get(app.zone) ?? [];
    existing.push(app.name);
    zoneMap.set(app.zone, existing);
  }

  return Array.from(zoneMap.entries()).map(([zone, members]) => ({
    zone,
    count: members.length,
    members,
  }));
}
