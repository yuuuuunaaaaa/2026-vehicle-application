"use client";

import type { ZoneSummaryForDate } from "@/types/application";

export interface DateDetailProps {
  summary: ZoneSummaryForDate[];
}

export function DateDetail({ summary }: DateDetailProps) {
  return (
    <ul>
      {summary.map(({ zone, count, members }) => (
        <li key={zone}>
          <strong>{zone}</strong> — {count}명
          <ul>
            {members.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
