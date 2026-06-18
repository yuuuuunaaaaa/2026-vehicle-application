"use client";

import { useState, useEffect, useCallback } from "react";
import type { Member, Zone } from "@/types/member";
import { MemberEditModal } from "@/components/ui/MemberEditModal";

function MemberRow({
  member,
  onEdit,
  onDelete,
  disabled,
}: {
  member: Member;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3 h-16 px-4 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm">
      <span className="flex-1 text-body-lg font-bold text-on-surface truncate">
        {member.name}
      </span>
      {member.isMinor && (
        <span className="shrink-0 text-[11px] font-bold px-2 py-1 rounded-full bg-primary text-on-primary">
          미성년
        </span>
      )}
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        aria-label="수정"
        className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 active:scale-90"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>edit</span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={disabled}
        aria-label="삭제"
        className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-error hover:bg-error/10 transition-colors disabled:opacity-40 active:scale-90"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>delete</span>
      </button>
    </div>
  );
}

interface ZoneMemberPanelProps {
  zone: Zone;
}

export function ZoneMemberPanel({ zone }: ZoneMemberPanelProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/members?zone=${encodeURIComponent(zone)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("불러오기 실패");
      const data = await res.json();
      setMembers(data.members);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setIsLoading(false);
    }
  }, [zone]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSave = async (name: string, isMinor: boolean) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (editMode === "add") {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ zone, name, isMinor }),
        });
        if (!res.ok) throw new Error("추가 실패");
        const data = await res.json();
        setMembers((prev) => [...prev, data.member]);
      } else if (editTarget) {
        const res = await fetch("/api/members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editTarget.id, name, isMinor }),
        });
        if (!res.ok) throw new Error("수정 실패");
        setMembers((prev) =>
          prev.map((m) => (m.id === editTarget.id ? { ...m, name, isMinor } : m))
        );
      }
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch(`/api/members?id=${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("삭제 실패");
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <p className="text-label-lg text-on-surface-variant px-1">구성원 관리</p>
        <p className="text-body-md text-on-surface-variant">{members.length}명</p>
      </div>

      {error && (
        <p role="alert" className="text-error text-body-md mb-2">{error}</p>
      )}

      {isLoading ? (
        <p aria-live="polite" className="text-center text-on-surface-variant py-8">
          불러오는 중...
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              onEdit={() => { setEditMode("edit"); setEditTarget(m); setShowEditModal(true); }}
              onDelete={() => setDeleteTarget(m)}
              disabled={isProcessing}
            />
          ))}
          <button
            type="button"
            onClick={() => { setEditMode("add"); setEditTarget(null); setShowEditModal(true); }}
            disabled={isProcessing}
            className="h-14 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all active:scale-[0.98] disabled:opacity-40"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>add</span>
            <span className="text-body-md font-bold">구성원 추가</span>
          </button>
        </div>
      )}

      <MemberEditModal
        isOpen={showEditModal}
        mode={editMode}
        initialName={editTarget?.name ?? ""}
        initialIsMinor={editTarget?.isMinor ?? false}
        onSave={handleSave}
        onCancel={() => setShowEditModal(false)}
        isLoading={isProcessing}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={isProcessing ? undefined : () => setDeleteTarget(null)}
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
              <strong className="text-on-surface">{deleteTarget.name}</strong>님을 삭제하시겠습니까?
              <br />
              <span className="text-[13px]">삭제된 구성원은 복구할 수 없습니다.</span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isProcessing}
                className="flex-1 h-14 rounded-xl border border-outline-variant text-on-surface text-label-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
      )}
    </>
  );
}
