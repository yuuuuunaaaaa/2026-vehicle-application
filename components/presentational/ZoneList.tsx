"use client";

import Link from "next/link";
import type { Zone } from "@/types/member";
import { ZONES } from "@/types/member";

export interface ZoneListProps {
  zones?: Zone[];
}

export function ZoneList({ zones = ZONES }: ZoneListProps) {
  return (
    <ul>
      {zones.map((zone) => (
        <li key={zone}>
          <Link href={`/zone/${encodeURIComponent(zone)}`}>{zone}</Link>
        </li>
      ))}
    </ul>
  );
}
