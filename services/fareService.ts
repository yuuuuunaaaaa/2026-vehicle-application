import { readSheet } from "@/lib/googleSheets";
import { getAllApplications } from "@/services/applicationService";
import { getAllMembers } from "@/services/memberService";
import { compareZones } from "@/lib/zoneSort";
import { EVENT_DATES } from "@/types/application";
import type { EventDate } from "@/types/application";
import type { Zone } from "@/types/member";
import type { DateFareSummary, FareSummary, ZoneDateFare } from "@/types/fare";

const FARE_ENV_FALLBACK = parseInt(process.env.FARE_PER_ADULT ?? "10000", 10);

async function getFarePerAdultRates(): Promise<{ roundTrip: number; oneWay: number }> {
  try {
    const rows = await readSheet("fare!A1:A2");
    const roundTripRaw = parseInt(rows?.[0]?.[0], 10);
    const oneWayRaw = parseInt(rows?.[1]?.[0], 10);
    const roundTrip = isNaN(roundTripRaw) ? FARE_ENV_FALLBACK : roundTripRaw;
    const oneWay = isNaN(oneWayRaw) ? roundTrip : oneWayRaw;
    return { roundTrip, oneWay };
  } catch {
    return { roundTrip: FARE_ENV_FALLBACK, oneWay: FARE_ENV_FALLBACK };
  }
}

export async function getFareSummary(): Promise<FareSummary> {
  const [allApps, allMembers, { roundTrip: FARE_ROUND_TRIP, oneWay: FARE_ONE_WAY }] = await Promise.all([
    getAllApplications(),
    getAllMembers(),
    getFarePerAdultRates(),
  ]);

  const memberByIdx = new Map(allMembers.map((m) => [m.id, m]));
  const memberByZoneName = new Map(allMembers.map((m) => [`${m.zone}:${m.name}`, m]));

  type Counts = {
    adultCount: number;
    minorCount: number;
    roundTripAdultCount: number;
    oneWayAdultCount: number;
    fare: number;
  };
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
    const counts = zoneMap.get(app.zone) ?? {
      adultCount: 0,
      minorCount: 0,
      roundTripAdultCount: 0,
      oneWayAdultCount: 0,
      fare: 0,
    };
    if (isMinor) {
      counts.minorCount++;
    } else {
      counts.adultCount++;
      if (app.direction === "both") {
        counts.roundTripAdultCount++;
        counts.fare += FARE_ROUND_TRIP;
      } else {
        counts.oneWayAdultCount++;
        counts.fare += FARE_ONE_WAY;
      }
    }
    zoneMap.set(app.zone, counts);
  }

  const dates: DateFareSummary[] = EVENT_DATES
    .filter((date) => dateZoneMap.has(date))
    .map((date) => {
      const zoneMap = dateZoneMap.get(date)!;
      const zones: ZoneDateFare[] = Array.from(zoneMap.entries())
        .sort(([a], [b]) => compareZones(a, b))
        .map(([zone, c]) => ({
          zone,
          adultCount: c.adultCount,
          minorCount: c.minorCount,
          roundTripAdultCount: c.roundTripAdultCount,
          oneWayAdultCount: c.oneWayAdultCount,
          fare: c.fare,
        }));
      const totalFare = zones.reduce((s, z) => s + z.fare, 0);
      const totalAdults = zones.reduce((s, z) => s + z.adultCount, 0);
      const totalMinors = zones.reduce((s, z) => s + z.minorCount, 0);
      const totalRoundTripAdults = zones.reduce((s, z) => s + z.roundTripAdultCount, 0);
      const totalOneWayAdults = zones.reduce((s, z) => s + z.oneWayAdultCount, 0);
      return {
        date,
        zones,
        totalFare,
        totalAdults,
        totalMinors,
        totalRoundTripAdults,
        totalOneWayAdults,
      };
    });

  const grandTotal = dates.reduce((s, d) => s + d.totalFare, 0);

  return { farePerAdult: FARE_ROUND_TRIP, farePerAdultOneWay: FARE_ONE_WAY, dates, grandTotal };
}
