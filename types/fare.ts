import type { Zone } from "./member";
import type { EventDate } from "./application";

export interface ZoneDateFare {
  zone: Zone;
  adultCount: number;
  minorCount: number;
  fare: number;
}

export interface DateFareSummary {
  date: EventDate;
  zones: ZoneDateFare[];
  totalFare: number;
  totalAdults: number;
  totalMinors: number;
}

export interface FareSummary {
  farePerAdult: number;
  dates: DateFareSummary[];
  grandTotal: number;
}
