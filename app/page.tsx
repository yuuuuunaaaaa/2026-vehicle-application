import Link from "next/link";
import { ZoneList } from "@/components/presentational/ZoneList";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="차량 신청 관리" titleSize="headline-lg" />

      <main className="flex-grow pt-20 pb-28 px-container-padding max-w-2xl mx-auto w-full">
        <section className="mt-stack-gap-md mb-stack-gap-md">
          <h2 className="text-display-lg text-on-surface mb-1">차량 신청 현황</h2>
          <p className="text-body-lg text-on-surface-variant">담당 구역을 선택해 주세요.</p>
        </section>

        <ZoneList />

        <div className="mt-stack-gap-md">
          <Link
            href="/summary"
            className="w-full h-touch-target-optimal bg-primary text-on-primary text-button-text rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">analytics</span>
            전체 집계 보기
          </Link>
        </div>

        <div className="mt-stack-gap-md p-card-inner-padding bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <span className="text-label-lg text-on-surface">도움말</span>
          </div>
          <p className="text-body-md text-on-surface-variant">
            구역을 선택하면 해당 구역의 차량 배정 및 신청 현황을 실시간으로 확인하실 수 있습니다.
          </p>
        </div>
      </main>

      <BottomNavBar activeTab="apply" />
    </div>
  );
}
