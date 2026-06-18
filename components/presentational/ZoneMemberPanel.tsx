"use client";

import type { Zone } from "@/types/member";
import type { Member } from "@/types/member";
import { useZoneMemberCrud } from "@/hooks/useZoneMemberCrud";
import { MemberEditModal } from "@/components/ui/MemberEditModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

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
  const {
    members, isLoading, isProcessing, error,
    showEditModal, editMode, editTarget, deleteTarget,
    openAdd, openEdit, closeEditModal, setDeleteTarget,
    handleSave, handleDelete,
  } = useZoneMemberCrud(zone);

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
              onEdit={() => openEdit(m)}
              onDelete={() => setDeleteTarget(m)}
              disabled={isProcessing}
            />
          ))}
          <button
            type="button"
            onClick={openAdd}
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
        onCancel={closeEditModal}
        isLoading={isProcessing}
      />

      <DeleteConfirmModal
        target={deleteTarget}
        isProcessing={isProcessing}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
