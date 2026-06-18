"use client";

import { useDateSummary } from "@/hooks/useSummary";
import { DateDetail } from "@/components/presentational/DateDetail";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import { DATE_LABELS } from "@/types/application";
import type { EventDate } from "@/types/application";

interface DateDetailContainerProps {
  date: string;
}

export function DateDetailContainer({ date }: DateDetailContainerProps) {
  const { date: eventDate, summary, isLoading, error } = useDateSummary(date);

  const label = eventDate ? DATE_LABELS[eventDate as EventDate] : date;
  const totalCount = summary.reduce((sum, z) => sum + z.count, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title={`${label} 상세 현황`} backHref="/summary" />

      <main className="flex-grow pt-20 pb-28 px-container-padding max-w-2xl mx-auto w-full">
        <section className="my-stack-gap-md">
          <div className="bg-primary p-6 rounded-xl shadow-lg text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-label-lg opacity-80">전체 신청 인원</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">
                {isLoading ? "—" : totalCount}
              </span>
              <span className="text-xl opacity-90">명</span>
            </div>
          </div>
        </section>

        {error && (
          <p role="alert" className="text-error text-body-md mb-4">
            오류: {error}
          </p>
        )}
        {isLoading ? (
          <p aria-live="polite" className="text-center text-on-surface-variant py-8">
            불러오는 중...
          </p>
        ) : (
          <DateDetail summary={summary} />
        )}
      </main>

      <BottomNavBar activeTab="status" />
    </div>
  );
}
