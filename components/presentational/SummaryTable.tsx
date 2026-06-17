"use client";

import Link from "next/link";
import type { DateSummary } from "@/types/application";
import { DATE_LABELS, DATE_DAY_LABELS } from "@/types/application";

export interface SummaryTableProps {
  summary: DateSummary[];
}

export function SummaryTable({ summary }: SummaryTableProps) {
  return (
    <div className="flex flex-col gap-stack-gap-sm">
      {summary.map(({ date, count }) => (
        <Link
          key={date}
          href={`/summary/${date}`}
          className="w-full text-left bg-surface-container-lowest border border-outline-variant rounded-xl p-card-inner-padding flex items-center justify-between min-h-touch-target-optimal shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:bg-surface-container transition-colors active:scale-[0.98] duration-200"
        >
          <div className="flex flex-col gap-1">
            <span className="text-body-lg text-on-surface">
              {DATE_LABELS[date]} {DATE_DAY_LABELS[date]}
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-label-lg text-on-surface-variant">
                총 신청자 <span className="text-primary">{count}명</span>
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </Link>
      ))}
    </div>
  );
}
