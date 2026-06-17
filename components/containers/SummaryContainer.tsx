"use client";

import { useSummary } from "@/hooks/useSummary";
import { SummaryTable } from "@/components/presentational/SummaryTable";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";

export function SummaryContainer() {
  const { summary, isLoading, error } = useSummary();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="전체 신청 집계" backHref="/" />

      <main className="flex-grow pt-20 pb-28 px-container-padding max-w-2xl mx-auto w-full">
        <section className="mb-stack-gap-md mt-stack-gap-md">
          <h2 className="text-headline-lg text-on-surface mb-2">총 신청 현황</h2>
          <p className="text-body-md text-on-surface-variant">
            날짜별 총 신청 현황입니다. 각 항목을 탭하여 상세 내역을 확인할 수 있습니다.
          </p>
        </section>

        {error && (
          <p role="alert" className="text-error text-body-md">
            오류: {error}
          </p>
        )}
        {isLoading ? (
          <p aria-live="polite" className="text-center text-on-surface-variant py-8">
            불러오는 중...
          </p>
        ) : (
          <SummaryTable summary={summary} />
        )}
      </main>

      <BottomNavBar activeTab="status" />
    </div>
  );
}
