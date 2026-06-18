"use client";

import type { Member } from "@/types/member";

interface DeleteConfirmModalProps {
  target: Member | null;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ target, isProcessing, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!target) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isProcessing ? undefined : onCancel}
      />
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl p-6">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 sm:hidden" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-error">delete</span>
          </div>
          <h2 className="text-headline-md text-on-surface">삭제 확인</h2>
        </div>
        <p className="text-body-md text-on-surface-variant mb-6">
          <strong className="text-on-surface">{target.name}</strong>님을 삭제하시겠습니까?
          <br />
          <span className="text-[13px]">삭제된 구성원은 복구할 수 없습니다.</span>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 h-14 rounded-xl border border-outline-variant text-on-surface text-label-lg transition-all active:scale-[0.98] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 h-14 rounded-xl bg-error text-on-error text-label-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 ${
              isProcessing ? "animate-pulse" : ""
            }`}
          >
            {isProcessing ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
