"use client";

import Link from "next/link";
import type { DateSummary } from "@/types/application";
import { DATE_LABELS } from "@/types/application";

export interface SummaryTableProps {
  summary: DateSummary[];
}

export function SummaryTable({ summary }: SummaryTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>날짜</th>
          <th>신청 인원</th>
        </tr>
      </thead>
      <tbody>
        {summary.map(({ date, count }) => (
          <tr key={date}>
            <td>
              <Link href={`/summary/${date}`}>{DATE_LABELS[date]}</Link>
            </td>
            <td>{count}명</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
