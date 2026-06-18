import type { Zone } from "./member";

export type EventDate =
  | "2026-07-25"
  | "2026-07-26"
  | "2026-07-27"
  | "2026-07-28"
  | "2026-07-29"
  | "2026-07-30";

export const EVENT_DATES: EventDate[] = [
  "2026-07-25",
  "2026-07-26",
  "2026-07-27",
  "2026-07-28",
  "2026-07-29",
  "2026-07-30",
];

export const DATE_LABELS: Record<EventDate, string> = {
  "2026-07-25": "7월 25일",
  "2026-07-26": "7월 26일",
  "2026-07-27": "7월 27일",
  "2026-07-28": "7월 28일",
  "2026-07-29": "7월 29일",
  "2026-07-30": "7월 30일",
};

export const DATE_DAY_LABELS: Record<EventDate, string> = {
  "2026-07-25": "(토)",
  "2026-07-26": "(일)",
  "2026-07-27": "(월)",
  "2026-07-28": "(화)",
  "2026-07-29": "(수)",
  "2026-07-30": "(목)",
};

export interface Application {
  idx: number;
  memberIdx: number;
  zone: Zone;
  name: string;
  date: EventDate;
  updated_at: string;
}

export interface ApplicationKey {
  zone: Zone;
  name: string;
  date: EventDate;
}

// Summary types
export interface DateSummary {
  date: EventDate;
  count: number;
}

export interface ZoneSummaryForDate {
  zone: Zone;
  count: number;
  members: string[];
  paidMembers: string[];
  minorMembers: string[];
}
