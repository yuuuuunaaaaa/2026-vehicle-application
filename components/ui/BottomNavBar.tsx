import Link from "next/link";

interface BottomNavBarProps {
  activeTab: "apply" | "status";
}

export function BottomNavBar({ activeTab }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-touch-target-optimal px-4 pb-safe bg-surface-container-lowest rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <Link
        href="/"
        className={
          activeTab === "apply"
            ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-1 active:scale-90 transition-all duration-200"
            : "flex flex-col items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-all p-2 rounded-lg active:scale-90 duration-200"
        }
      >
        <span className="material-symbols-outlined">edit_calendar</span>
        <span className="text-label-lg">신청하기</span>
      </Link>
      <Link
        href="/summary"
        className={
          activeTab === "status"
            ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-1 active:scale-90 transition-all duration-200"
            : "flex flex-col items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-all p-2 rounded-lg active:scale-90 duration-200"
        }
      >
        <span
          className="material-symbols-outlined"
          style={activeTab === "status" ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          analytics
        </span>
        <span className="text-label-lg">현황확인</span>
      </Link>
    </nav>
  );
}
