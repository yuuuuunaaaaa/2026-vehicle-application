"use client";

interface ConfirmSaveModalProps {
  isOpen: boolean;
  dateLabel: string;
  appliedNames: string[];
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function ConfirmSaveModal({
  isOpen,
  dateLabel,
  appliedNames,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={isLoading ? undefined : onCancel} />
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl">
        <div className="p-6">
          {/* 핸들바 */}
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 sm:hidden" />

          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">save</span>
            </div>
            <div>
              <h2 className="text-headline-md text-on-surface">저장 확인</h2>
              <p className="text-body-md text-on-surface-variant">{dateLabel}</p>
            </div>
          </div>

          {/* 신청자 목록 */}
          <div className="bg-surface-container-low rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: 18 }}
              >
                groups
              </span>
              <span className="text-label-lg text-on-surface">
                신청 인원 {appliedNames.length}명
              </span>
            </div>
            {appliedNames.length > 0 ? (
              <div className="max-h-52 overflow-y-auto space-y-1">
                {appliedNames.map((name) => (
                  <div key={name} className="flex items-center gap-2 py-1">
                    <span
                      className="material-symbols-outlined text-primary shrink-0"
                      style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="text-body-md text-on-surface">{name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-md text-on-surface-variant italic">
                신청자가 없습니다.
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 h-14 rounded-xl border border-outline-variant text-on-surface text-label-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-14 rounded-xl bg-primary text-on-primary text-label-lg font-bold transition-all active:scale-[0.98] disabled:opacity-70 ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
