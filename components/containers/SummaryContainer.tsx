"use client";

import { useSummary } from "@/hooks/useSummary";
import { SummaryTable } from "@/components/presentational/SummaryTable";

export function SummaryContainer() {
  const { summary, isLoading, error } = useSummary();

  if (error) return <p role="alert">오류: {error}</p>;
  if (isLoading) return <p aria-live="polite">불러오는 중...</p>;

  return (
    <div>
      <h1>전체 집계</h1>
      <SummaryTable summary={summary} />
    </div>
  );
}
