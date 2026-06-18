"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Zone } from "@/types/member";
import type { EventDate } from "@/types/application";
import { EVENT_DATES } from "@/types/application";
import { useMembers } from "@/hooks/useMembers";
import { useApplications } from "@/hooks/useApplications";
import { useAuth } from "@/hooks/useAuth";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { DateSelector } from "@/components/presentational/DateSelector";
import { MemberList } from "@/components/presentational/MemberList";
import { ZoneMemberPanel } from "@/components/presentational/ZoneMemberPanel";
import { ConfirmSaveModal } from "@/components/ui/ConfirmSaveModal";
import { UnsavedChangesModal } from "@/components/ui/UnsavedChangesModal";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import { DATE_LABELS, DATE_DAY_LABELS } from "@/types/application";

interface ZoneApplicationContainerProps {
  zone: Zone;
}

type LeaveAction =
  | { type: "date"; date: EventDate }
  | { type: "navigate"; href: string }
  | { type: "member-manager" };

export function ZoneApplicationContainer({ zone }: ZoneApplicationContainerProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<EventDate>(EVENT_DATES[0]);
  const [showMemberManager, setShowMemberManager] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<LeaveAction | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { members, isLoading: membersLoading, error: membersError } = useMembers(zone);
  const {
    isLoading: appsLoading,
    error: appsError,
    isApplied,
    pendingToggle,
    save,
    isSaving,
    hasPendingChanges,
    resetPendingChanges,
    discardPendingChangesForDate,
  } = useApplications(zone);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      resetPendingChanges();
    }
  }, [isAuthenticated, authLoading, resetPendingChanges]);

  const isDirty = hasPendingChanges(selectedDate);
  const canEdit = isAuthenticated && !authLoading;
  const appliedNames = members.filter((m) => isApplied(m.name, selectedDate)).map((m) => m.name);
  const appliedCount = appliedNames.length;
  const dateLabel = `${DATE_LABELS[selectedDate]} ${DATE_DAY_LABELS[selectedDate]}`;

  const executeLeaveAction = useCallback(
    (action: LeaveAction) => {
      discardPendingChangesForDate(selectedDate);
      if (action.type === "date") {
        setSelectedDate(action.date);
        setShowMemberManager(false);
      } else if (action.type === "navigate") {
        router.push(action.href);
      } else if (action.type === "member-manager") {
        setShowMemberManager(true);
      }
    },
    [discardPendingChangesForDate, router, selectedDate]
  );

  const attemptLeave = useCallback(
    (action: LeaveAction) => {
      if (canEdit && isDirty) {
        setPendingLeaveAction(action);
        setShowLeaveModal(true);
        return;
      }
      executeLeaveAction(action);
    },
    [canEdit, executeLeaveAction, isDirty]
  );

  const handleDateSelect = (date: EventDate) => {
    if (!showMemberManager && date === selectedDate) return;
    attemptLeave({ type: "date", date });
  };

  const handleMemberManagerToggle = () => {
    if (showMemberManager) {
      setShowMemberManager(false);
      return;
    }
    attemptLeave({ type: "member-manager" });
  };

  const handleBack = () => attemptLeave({ type: "navigate", href: "/" });
  const handleNavigate = (href: string) => attemptLeave({ type: "navigate", href });

  const handleLeaveConfirm = () => {
    if (!pendingLeaveAction) return;
    const action = pendingLeaveAction;
    setShowLeaveModal(false);
    setPendingLeaveAction(null);
    executeLeaveAction(action);
  };

  const handleLeaveCancel = () => {
    setShowLeaveModal(false);
    setPendingLeaveAction(null);
  };

  useEffect(() => {
    if (!canEdit || !isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [canEdit, isDirty]);

  if (membersError || appsError) {
    return (
      <p role="alert" className="p-6 text-error text-body-md">
        오류가 발생했습니다: {membersError ?? appsError}
      </p>
    );
  }

  const handleSaveClick = () => setShowSaveModal(true);
  const handleConfirm = async () => {
    await save(selectedDate);
    setShowSaveModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar
        title={`${zone} 차량 신청`}
        onBackClick={handleBack}
        titleColor="on-surface"
      />

      <main className="flex-grow pt-20 pb-32 px-container-padding space-y-6 max-w-2xl mx-auto w-full">
        <DateSelector
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          endSlot={canEdit && (
            <button
              type="button"
              onClick={handleMemberManagerToggle}
              className={`flex-none h-touch-target-optimal min-w-[80px] rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                showMemberManager
                  ? "border-primary border-[3px] bg-primary-fixed"
                  : "border-dashed border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <span
                className={`material-symbols-outlined ${showMemberManager ? "text-primary" : "text-on-surface-variant"}`}
                style={{ fontSize: 20 }}
              >
                manage_accounts
              </span>
              <span className={`text-[11px] font-bold ${showMemberManager ? "text-primary" : "text-on-surface-variant"}`}>
                구성원
              </span>
            </button>
          )}
        />

        {showMemberManager ? (
          <ZoneMemberPanel zone={zone} />
        ) : (
          <>
            <div className="bg-primary-container text-white rounded-xl px-5 h-14 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined shrink-0">groups</span>
                <span className="text-body-lg font-bold truncate">신청 인원: {appliedCount}명</span>
              </div>
              {canEdit && isDirty && (
                <span className="shrink-0 bg-white/30 px-2 py-1 rounded-full text-xs font-bold ml-2">
                  미저장
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
                readOnly={!canEdit}
              />
            )}
          </>
        )}
      </main>

      {canEdit && !showMemberManager && (
        <footer className="fixed bottom-[calc(56px+1rem)] left-0 w-full p-4 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-40">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <button
              type="button"
              onClick={handleSaveClick}
              disabled={isSaving || !isDirty}
              className={`w-full h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 ${
                isDirty ? "bg-primary active:scale-[0.98]" : "bg-outline-variant"
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
      )}

      <BottomNavBar activeTab="apply" onNavigate={handleNavigate} />

      {canEdit && (
        <ConfirmSaveModal
          isOpen={showSaveModal}
          dateLabel={dateLabel}
          appliedNames={appliedNames}
          onConfirm={handleConfirm}
          onCancel={() => setShowSaveModal(false)}
          isLoading={isSaving}
        />
      )}
      <UnsavedChangesModal
        isOpen={showLeaveModal && canEdit}
        dateLabel={dateLabel}
        onStay={handleLeaveCancel}
        onLeave={handleLeaveConfirm}
      />
    </div>
  );
}
