import type { Zone } from "./member";

export interface MemberFare {
  zone: Zone;
  name: string;
  isMinor: boolean;
  paid: boolean;
  applicationCount: number;
  fare: number;
}

export interface ZoneFareSummary {
  zone: Zone;
  total: number;
  paid: number;
  unpaid: number;
  members: MemberFare[];
}

export interface FareSummary {
  farePerAdult: number;
  totalFare: number;
  totalPaid: number;
  totalUnpaid: number;
  zones: ZoneFareSummary[];
}
