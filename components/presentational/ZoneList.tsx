"use client";

import Link from "next/link";
import type { Zone } from "@/types/member";
import { ZONES } from "@/types/member";

export interface ZoneListProps {
  zones?: Zone[];
}

export function ZoneList({ zones = ZONES }: ZoneListProps) {
  return (
    <div className="grid grid-cols-3 gap-stack-gap-sm">
      {zones.map((zone) => (
        <Link
          key={zone}
          href={`/zone/${zone}`}
          className="flex flex-col items-center justify-center aspect-square bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:bg-surface-container transition-all active:scale-95 duration-200"
        >
          <span className="text-headline-md text-on-surface-variant">{zone}</span>
        </Link>
      ))}
    </div>
  );
}
