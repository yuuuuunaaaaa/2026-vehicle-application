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

export type Direction = "both" | "outbound" | "return";

export const DIRECTION_LABELS: Record<Direction, string> = {
  both: "왕복",
  outbound: "갈때만",
  return: "올때만",
};

export const NEXT_DIRECTION: Record<Direction, Direction> = {
  both: "outbound",
  outbound: "return",
  return: "both",
};

export const DIRECTION_BADGE_STYLES: Record<Direction, string> = {
  both: "bg-surface-container-high text-on-surface-variant",
  outbound: "bg-warning text-on-warning",
  return: "bg-tertiary text-on-tertiary",
};

export interface Application {
  idx: number;
  memberIdx: number;
  zone: Zone;
  name: string;
  date: EventDate;
  updated_at: string;
  direction: Direction;
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
  outboundCount: number;
  returnCount: number;
}

export interface ZoneMemberSummary {
  name: string;
  isMinor: boolean;
  direction: Direction;
}

export interface ZoneSummaryForDate {
  zone: Zone;
  count: number;
  members: ZoneMemberSummary[];
}
