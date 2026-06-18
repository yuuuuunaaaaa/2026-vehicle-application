"use client";

import type { Member, Zone } from "@/types/member";
import { useZoneMemberCrud } from "@/hooks/useZoneMemberCrud";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { MemberEditModal } from "@/components/ui/MemberEditModal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";

interface ZoneMemberContainerProps {
  zone: Zone;
}

function MemberCrudCard({
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
    <div className="flex flex-col items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm px-2 py-3 h-[96px]">
      <span className="text-[14px] font-bold text-on-surface text-center truncate w-full text-center">
        {member.name}
      </span>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
        member.isMinor
          ? "bg-primary text-on-primary"
          : "bg-transparent text-transparent"
      }`}>
        미성년
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={disabled}
          aria-label="수정"
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 active:scale-90"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label="삭제"
          className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors disabled:opacity-40 active:scale-90"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
        </button>
      </div>
    </div>
  );
}

export function ZoneMemberContainer({ zone }: ZoneMemberContainerProps) {
  const {
    members, isLoading, isProcessing, error,
    showEditModal, editMode, editTarget, deleteTarget,
    openAdd, openEdit, closeEditModal, setDeleteTarget,
    handleSave, handleDelete,
  } = useZoneMemberCrud(zone);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar
        title={`${zone} 구성원 관리`}
        backHref={`/zone/${encodeURIComponent(zone)}`}
        titleColor="on-surface"
      />

      <main className="flex-grow pt-20 pb-8 px-container-padding max-w-2xl mx-auto w-full">
        <section className="mt-stack-gap-md mb-stack-gap-md">
          <h2 className="text-headline-lg text-on-surface mb-1">{zone} 구성원</h2>
          <p className="text-body-md text-on-surface-variant">
            이름과 미성년자 여부를 등록·수정·삭제할 수 있습니다. 구역은 변경할 수 없습니다.
          </p>
        </section>

        {error && (
          <p role="alert" className="text-error text-body-md mb-4">{error}</p>
        )}

        {isLoading ? (
          <p aria-live="polite" className="text-center text-on-surface-variant py-8">
            불러오는 중...
          </p>
        ) : (
          <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
            {members.map((m) => (
              <MemberCrudCard
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
              className="flex flex-col items-center justify-center h-[96px] rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all active:scale-95 disabled:opacity-40"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>add</span>
              <span className="text-[12px] font-bold mt-1">추가</span>
            </button>
          </div>
        )}
      </main>

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
    </div>
  );
}
