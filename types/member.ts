export type Zone =
  | "1구역"
  | "2구역"
  | "3구역"
  | "4구역"
  | "5구역"
  | "6구역"
  | "7구역"
  | "8구역"
  | "9구역"
  | "청년회";

export const ZONES: Zone[] = [
  "1구역",
  "2구역",
  "3구역",
  "4구역",
  "5구역",
  "6구역",
  "7구역",
  "8구역",
  "9구역",
  "청년회",
];

export interface Member {
  id: number;
  zone: Zone;
  name: string;
  isMinor: boolean;
}
