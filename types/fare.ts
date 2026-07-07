import type { Zone } from "./member";
import type { EventDate } from "./application";

export interface ZoneDateFare {
  zone: Zone;
  adultCount: number;
  minorCount: number;
  roundTripAdultCount: number;
  oneWayAdultCount: number;
  fare: number;
}

export interface DateFareSummary {
  date: EventDate;
  zones: ZoneDateFare[];
  totalFare: number;
  totalAdults: number;
  totalMinors: number;
  totalRoundTripAdults: number;
  totalOneWayAdults: number;
}

export interface FareSummary {
  farePerAdult: number;
  farePerAdultOneWay: number;
  dates: DateFareSummary[];
  grandTotal: number;
}
