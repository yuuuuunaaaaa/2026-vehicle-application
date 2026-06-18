"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFare } from "@/hooks/useFare";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import type { ZoneFareSummary } from "@/types/fare";

function formatWon(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}

function FareZoneRow({
  zone: z,
  farePerAdult,
}: {
  zone: ZoneFareSummary;
  farePerAdult: number;
}) {
  const [open, setOpen] = useState(false);
  const adultCount = z.members.filter((m) => !m.isMinor).length;

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-low transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="text-body-lg font-bold text-on-surface">{z.zone}</span>
          <span className="text-body-sm text-on-surface-variant">성인 {adultCount}명</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-body-md font-bold text-on-surface">
            {formatWon(z.total)}
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
        <div className="border-t border-outline-variant px-4 pb-3 pt-2 space-y-2">
          {z.members.map((m) => (
            <div key={m.name} className="flex items-center gap-2 py-1">
              <span className="flex-1 text-body-md text-on-surface">{m.name}</span>
              {m.isMinor ? (
                <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  무료
                </span>
              ) : (
                <>
                  <span className="text-body-sm text-on-surface-variant whitespace-nowrap">
                    {m.applicationCount}회 × {formatWon(farePerAdult)}
                  </span>
                  <span className="text-body-sm font-bold text-on-surface whitespace-nowrap">
                    = {formatWon(m.fare)}
                  </span>
                  {m.paid ? (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      납부
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      미납
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
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
          <h2 className="text-headline-lg text-on-surface mb-2">차비 현황</h2>
          <p className="text-body-md text-on-surface-variant">
            신청 날짜 수 기준으로 계산됩니다. 미성년자는 무료입니다.
          </p>
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
              <p role="alert" className="text-error text-body-md mb-4">
                오류: {error}
              </p>
            )}
            {isLoading ? (
              <p aria-live="polite" className="text-center text-on-surface-variant py-8">
                불러오는 중...
              </p>
            ) : fare ? (
              <>
                {/* 전체 요약 카드 */}
                <div className="bg-surface-container rounded-xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-on-surface-variant">1인 1회 차비</span>
                    <span className="text-body-lg font-bold text-on-surface">
                      {formatWon(fare.farePerAdult)}
                    </span>
                  </div>
                  <div className="h-px bg-outline-variant" />
                  <div className="flex justify-between items-center">
                    <span className="text-body-md text-on-surface-variant">전체 차비 합계</span>
                    <span className="text-headline-md font-bold text-on-surface">
                      {formatWon(fare.totalFare)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-green-700 mb-1">납부 완료</p>
                      <p className="text-body-lg font-bold text-green-800">
                        {formatWon(fare.totalPaid)}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-bold text-amber-700 mb-1">미납</p>
                      <p className="text-body-lg font-bold text-amber-800">
                        {formatWon(fare.totalUnpaid)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 구역별 목록 */}
                <div className="space-y-2">
                  {fare.zones.map((z) => (
                    <FareZoneRow key={z.zone} zone={z} farePerAdult={fare.farePerAdult} />
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </main>

      <BottomNavBar activeTab="fare" />
    </div>
  );
}
