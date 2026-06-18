import { readSheet } from "@/lib/googleSheets";
import { getAllApplications } from "@/services/applicationService";
import { getAllMembers } from "@/services/memberService";
import { compareZones } from "@/lib/zoneSort";
import { EVENT_DATES } from "@/types/application";
import type { EventDate } from "@/types/application";
import type { Zone } from "@/types/member";
import type { DateFareSummary, FareSummary, ZoneDateFare } from "@/types/fare";

const FARE_ENV_FALLBACK = parseInt(process.env.FARE_PER_ADULT ?? "10000", 10);

async function getFarePerAdult(): Promise<number> {
  try {
    const rows = await readSheet("fare!A1");
    const raw = rows?.[0]?.[0];
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? FARE_ENV_FALLBACK : parsed;
  } catch {
    return FARE_ENV_FALLBACK;
  }
}

export async function getFareSummary(): Promise<FareSummary> {
  const [allApps, allMembers, FARE_PER_ADULT] = await Promise.all([
    getAllApplications(),
    getAllMembers(),
    getFarePerAdult(),
  ]);

  const memberByIdx = new Map(allMembers.map((m) => [m.id, m]));
  const memberByZoneName = new Map(allMembers.map((m) => [`${m.zone}:${m.name}`, m]));

  type Counts = { adultCount: number; minorCount: number };
  const dateZoneMap = new Map<EventDate, Map<Zone, Counts>>();

  for (const app of allApps) {
    const member =
      (app.memberIdx ? memberByIdx.get(app.memberIdx) : undefined) ??
      memberByZoneName.get(`${app.zone}:${app.name}`);
    const isMinor = member?.isMinor ?? false;

    let zoneMap = dateZoneMap.get(app.date);
    if (!zoneMap) {
      zoneMap = new Map();
      dateZoneMap.set(app.date, zoneMap);
    }
    const counts = zoneMap.get(app.zone) ?? { adultCount: 0, minorCount: 0 };
    if (isMinor) counts.minorCount++;
    else counts.adultCount++;
    zoneMap.set(app.zone, counts);
  }

  const dates: DateFareSummary[] = EVENT_DATES
    .filter((date) => dateZoneMap.has(date))
    .map((date) => {
      const zoneMap = dateZoneMap.get(date)!;
      const zones: ZoneDateFare[] = Array.from(zoneMap.entries())
        .sort(([a], [b]) => compareZones(a, b))
        .map(([zone, { adultCount, minorCount }]) => ({
          zone,
          adultCount,
          minorCount,
          fare: adultCount * FARE_PER_ADULT,
        }));
      const totalFare = zones.reduce((s, z) => s + z.fare, 0);
      const totalAdults = zones.reduce((s, z) => s + z.adultCount, 0);
      const totalMinors = zones.reduce((s, z) => s + z.minorCount, 0);
      return { date, zones, totalFare, totalAdults, totalMinors };
    });

  const grandTotal = dates.reduce((s, d) => s + d.totalFare, 0);

  return { farePerAdult: FARE_PER_ADULT, dates, grandTotal };
}
