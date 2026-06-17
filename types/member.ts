export type Zone =
  | "1구역"
  | "2구역"
  | "3구역"
  | "4구역"
  | "5구역"
  | "6구역"
  | "7구역"
  | "8구역"
  | "9구역";

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
];

export interface Member {
  zone: Zone;
  name: string;
}
