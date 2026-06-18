"use client";

import { useState, useEffect } from "react";

interface MemberEditModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialName?: string;
  initialIsMinor?: boolean;
  onSave: (name: string, isMinor: boolean) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function MemberEditModal({
  isOpen,
  mode,
  initialName = "",
  initialIsMinor = false,
  onSave,
  onCancel,
  isLoading,
}: MemberEditModalProps) {
  const [name, setName] = useState(initialName);
  const [isMinor, setIsMinor] = useState(initialIsMinor);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setIsMinor(initialIsMinor);
    }
  }, [isOpen, initialName, initialIsMinor]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, isMinor);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isLoading ? undefined : onCancel}
      />
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 sm:hidden" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">
                {mode === "add" ? "person_add" : "edit"}
              </span>
            </div>
            <h2 className="text-headline-md text-on-surface">
              {mode === "add" ? "구성원 추가" : "구성원 수정"}
            </h2>
          </div>

          {/* 이름 */}
          <div className="mb-4">
            <label className="text-label-lg text-on-surface-variant block mb-2">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
              autoFocus
              disabled={isLoading}
              className="w-full h-14 px-4 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-body-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* 미성년자 여부 */}
          <button
            type="button"
            onClick={() => setIsMinor((v) => !v)}
            disabled={isLoading}
            className={`w-full h-14 rounded-xl border flex items-center justify-between px-4 mb-6 transition-all ${
              isMinor
                ? "border-primary border-[2px] bg-primary-fixed"
                : "border-outline-variant bg-surface-container-low"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>
                child_care
              </span>
              <span className="text-body-lg text-on-surface">미성년자</span>
            </div>
            <div
              className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                isMinor ? "bg-primary" : "bg-outline-variant"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  isMinor ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>

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
              type="submit"
              disabled={isLoading || !name.trim()}
              className={`flex-1 h-14 rounded-xl bg-primary text-on-primary text-label-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
