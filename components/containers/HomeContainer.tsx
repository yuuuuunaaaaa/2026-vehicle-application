"use client";

import Link from "next/link";
import { ZoneList } from "@/components/presentational/ZoneList";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import { useAuth } from "@/hooks/useAuth";

export function HomeContainer() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="차량 신청 관리" titleSize="headline-lg" />

      <main className="flex-grow pt-20 pb-28 px-container-padding max-w-2xl mx-auto w-full">
        <section className="mt-stack-gap-md mb-stack-gap-md">
          <h2 className="text-display-lg text-on-surface mb-1">차량 신청 현황</h2>
          {isAuthenticated && (
            <p className="text-body-lg text-on-surface-variant">담당 구역을 선택해 주세요.</p>
          )}
        </section>

        {isAuthenticated && <ZoneList />}

        <div className={isAuthenticated ? "mt-stack-gap-md" : ""}>
          <Link
            href="/summary"
            className="w-full h-touch-target-optimal bg-primary text-on-primary text-button-text rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">analytics</span>
            전체 집계 보기
          </Link>
        </div>
      </main>

      <BottomNavBar activeTab="apply" />
    </div>
  );
}
