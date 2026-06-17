"use client";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  dateLabel: string;
  onStay: () => void;
  onLeave: () => void;
}

export function UnsavedChangesModal({
  isOpen,
  dateLabel,
  onStay,
  onLeave,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onStay} />
      <div className="relative w-full sm:max-w-sm bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl">
        <div className="p-6">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 sm:hidden" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-warning-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-warning-container">warning</span>
            </div>
            <div>
              <h2 className="text-headline-md text-on-surface">저장하지 않은 변경사항</h2>
            </div>
          </div>

          <p className="text-body-md text-on-surface-variant mb-6">
            변경 내용이 저장되지 않았습니다. 저장하지 않고 이동하시겠습니까?
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onStay}
              className="flex-1 h-14 rounded-xl border border-outline-variant text-on-surface text-label-lg transition-all active:scale-[0.98]"
            >
              머무르기
            </button>
            <button
              type="button"
              onClick={onLeave}
              className="flex-1 h-14 rounded-xl bg-warning text-on-warning text-label-lg font-bold transition-all active:scale-[0.98]"
            >
              이동하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
