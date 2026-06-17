"use client";

import { useDateSummary } from "@/hooks/useSummary";
import { DateDetail } from "@/components/presentational/DateDetail";
import { DATE_LABELS } from "@/types/application";
import type { EventDate } from "@/types/application";

interface DateDetailContainerProps {
  date: string;
}

export function DateDetailContainer({ date }: DateDetailContainerProps) {
  const { date: eventDate, summary, isLoading, error } = useDateSummary(date);

  if (error) return <p role="alert">오류: {error}</p>;
  if (isLoading) return <p aria-live="polite">불러오는 중...</p>;

  const label = eventDate ? DATE_LABELS[eventDate as EventDate] : date;

  return (
    <div>
      <h1>{label} 날짜 상세</h1>
      <DateDetail summary={summary} />
    </div>
  );
}
