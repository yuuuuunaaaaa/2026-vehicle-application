"use client";

import { useState } from "react";
import type { Zone } from "@/types/member";
import type { EventDate } from "@/types/application";
import { EVENT_DATES } from "@/types/application";
import { useMembers } from "@/hooks/useMembers";
import { useApplications } from "@/hooks/useApplications";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { DateSelector } from "@/components/presentational/DateSelector";
import { MemberList } from "@/components/presentational/MemberList";

interface ZoneApplicationContainerProps {
  zone: Zone;
}

export function ZoneApplicationContainer({ zone }: ZoneApplicationContainerProps) {
  const [selectedDate, setSelectedDate] = useState<EventDate>(EVENT_DATES[0]);
  const { members, isLoading: membersLoading, error: membersError } = useMembers(zone);
  const {
    isLoading: appsLoading,
    error: appsError,
    isApplied,
    pendingToggle,
    save,
    isSaving,
    hasPendingChanges,
  } = useApplications(zone);

  if (membersError || appsError) {
    return (
      <p role="alert" className="p-6 text-error text-body-md">
        오류가 발생했습니다: {membersError ?? appsError}
      </p>
    );
  }

  const isDirty = hasPendingChanges(selectedDate);
  const appliedCount = members.filter((m) => isApplied(m.name, selectedDate)).length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title={`${zone} 차량 신청`} backHref="/" titleColor="on-surface" />

      <main className="flex-grow pt-20 pb-32 px-container-padding space-y-6 max-w-2xl mx-auto w-full">
        <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />

        {/* Status bar */}
        <div className="bg-primary-container text-white rounded-xl px-5 h-14 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined shrink-0">groups</span>
            <span className="text-body-lg font-bold truncate">신청 인원: {appliedCount}명</span>
          </div>
          {isDirty && (
            <span className="shrink-0 bg-white/30 px-2 py-1 rounded-full text-xs font-bold ml-2">
              미저장
            </span>
          )}
          {!isDirty && (
            <span className="shrink-0 bg-white/20 px-2 py-1 rounded-full text-xs font-bold ml-2">
              LIVE
            </span>
          )}
        </div>

        {membersLoading || appsLoading ? (
          <p aria-live="polite" className="text-center text-on-surface-variant py-8">
            불러오는 중...
          </p>
        ) : (
          <MemberList
            members={members}
            selectedDate={selectedDate}
            isApplied={isApplied}
            onToggle={pendingToggle}
            disabled={isSaving}
          />
        )}
      </main>

      {/* Save button */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={() => save(selectedDate)}
            disabled={isSaving || !isDirty}
            className={`w-full h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 ${
              isDirty
                ? "bg-primary active:scale-[0.98]"
                : "bg-outline-variant"
            } ${isSaving ? "animate-pulse" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">
                {isSaving ? "sync" : isDirty ? "save" : "cloud_done"}
              </span>
              <span className="text-button-text">
                {isSaving ? "저장 중..." : isDirty ? "저장하기" : "저장 완료"}
              </span>
            </div>
          </button>
        </div>
      </footer>
    </div>
  );
}
