"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFare } from "@/hooks/useFare";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import { DATE_LABELS, DATE_DAY_LABELS } from "@/types/application";
import { formatWon } from "@/lib/format";
import type { DateFareSummary } from "@/types/fare";

function DateFareRow({ summary, farePerAdult }: { summary: DateFareSummary; farePerAdult: number }) {
  const [open, setOpen] = useState(false);
  const label = DATE_LABELS[summary.date];
  const dayLabel = DATE_DAY_LABELS[summary.date];

  const tableCols: React.CSSProperties = { gridTemplateColumns: "2fr 1fr 1fr 2fr" };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? "border-primary ring-2 ring-primary" : "border-outline-variant"}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-surface-container-low transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>
              calendar_month
            </span>
          </div>
          <div className="text-left min-w-0">
            <p className="text-body-lg font-bold text-on-surface">
              {label} <span className="text-on-surface-variant font-normal">{dayLabel}</span>
            </p>
            <p className="text-body-sm text-on-surface-variant whitespace-nowrap">
              성인 {summary.totalAdults}명
              {summary.totalMinors > 0 && ` · 미성년 ${summary.totalMinors}명`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <span className="text-body-lg font-bold text-on-surface whitespace-nowrap">
            {formatWon(summary.totalFare)}
          </span>
          <span
            className="material-symbols-outlined text-outline transition-transform duration-200"
            style={{ fontSize: 20, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            expand_more
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-outline-variant">
          {/* 헤더 */}
          <div className="grid px-3 py-2 bg-surface-container-low text-label-sm text-on-surface-variant" style={tableCols}>
            <span>구역</span>
            <span className="text-center">성인</span>
            <span className="text-center">미성년</span>
            <span className="text-right">차비</span>
          </div>
          {/* 구역 행 */}
          {summary.zones.map((z) => (
            <div
              key={z.zone}
              className="grid px-3 py-3 border-t border-outline-variant/50 text-body-sm"
              style={tableCols}
            >
              <span className="font-bold text-on-surface">{z.zone}</span>
              <span className="text-center text-on-surface whitespace-nowrap">{z.adultCount}명</span>
              <span className="text-center text-on-surface-variant whitespace-nowrap">
                {z.minorCount > 0 ? `${z.minorCount}명` : "—"}
              </span>
              <span className="text-right font-bold text-on-surface whitespace-nowrap">{formatWon(z.fare)}</span>
            </div>
          ))}
          {/* 소계 */}
          <div className="grid px-3 py-3 border-t border-outline bg-surface-container text-body-sm font-bold" style={tableCols}>
            <span className="text-on-surface">소계</span>
            <span className="text-center text-on-surface whitespace-nowrap">{summary.totalAdults}명</span>
            <span className="text-center text-on-surface-variant whitespace-nowrap">
              {summary.totalMinors > 0 ? `${summary.totalMinors}명` : "—"}
            </span>
            <span className="text-right text-primary whitespace-nowrap">{formatWon(summary.totalFare)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function FareContainer() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { fare, isLoading: fareLoading, error } = useFare();
  const isLoading = authLoading || fareLoading;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="차비 현황" backHref="/summary" />

      <main className="flex-grow pt-20 pb-28 px-container-padding max-w-2xl mx-auto w-full">
        <section className="mb-stack-gap-md mt-stack-gap-md">
          <h2 className="text-headline-lg text-on-surface mb-1">차비 현황</h2>
          <p className="text-body-md text-on-surface-variant">날짜별 구역 차비 집계입니다.</p>
        </section>

        {!authLoading && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>
              lock
            </span>
            <p className="text-body-lg text-on-surface-variant">관리자만 볼 수 있습니다.</p>
          </div>
        )}

        {isAuthenticated && (
          <>
            {error && (
              <p role="alert" className="text-error text-body-md mb-4">오류: {error}</p>
            )}
            {isLoading ? (
              <p aria-live="polite" className="text-center text-on-surface-variant py-8">
                불러오는 중...
              </p>
            ) : fare && fare.dates.length > 0 ? (
              <>
                {/* 전체 합계 카드 */}
                <div className="bg-primary rounded-xl p-5 mb-6 text-white">
                  <p className="text-label-lg opacity-80 mb-1">전체 차비 합계</p>
                  <p className="text-4xl font-bold mb-3">{formatWon(fare.grandTotal)}</p>
                  <p className="text-body-sm opacity-70">1인 1회 {formatWon(fare.farePerAdult)}</p>
                </div>

                {/* 날짜별 아코디언 */}
                <div className="space-y-3">
                  {fare.dates.map((d) => (
                    <DateFareRow key={d.date} summary={d} farePerAdult={fare.farePerAdult} />
                  ))}
                </div>
              </>
            ) : fare ? (
              <p className="text-center text-on-surface-variant py-12">신청 데이터가 없습니다.</p>
            ) : null}
          </>
        )}
      </main>

      <BottomNavBar activeTab="fare" />
    </div>
  );
}
