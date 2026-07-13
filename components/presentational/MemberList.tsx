"use client";

import type { Member } from "@/types/member";
import type { EventDate } from "@/types/application";
import { DIRECTION_BADGE_STYLES, DIRECTION_LABELS, type Direction } from "@/types/application";

export interface MemberListProps {
  members: Member[];
  selectedDate: EventDate;
  getDirection: (name: string, date: EventDate) => Direction | null;
  onToggle: (name: string, date: EventDate) => void;
  onCycleDirection: (name: string, date: EventDate) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function MemberList({
  members,
  selectedDate,
  getDirection,
  onToggle,
  onCycleDirection,
  disabled = false,
  readOnly = false,
}: MemberListProps) {
  const interactive = !disabled && !readOnly;
  const sortedMembers = [...members].sort((a, b) =>
    a.name.localeCompare(b.name, "ko"),
  );

  return (
    <>
      <p className="text-center text-body-md text-on-surface-variant flex items-center justify-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {readOnly ? "visibility" : "touch_app"}
        </span>
        {readOnly
          ? "조회 전용입니다. 수정은 관리자만 가능합니다."
          : "성명을 눌러 신청 여부를 변경하고, 오른쪽 배지를 눌러 왕복/갈때만/올때만을 변경하세요"}
      </p>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {sortedMembers.map((member) => {
          const direction = getDirection(member.name, selectedDate);
          const applied = direction !== null;

          return (
            <div
              key={member.name}
              role="button"
              tabIndex={interactive ? 0 : -1}
              aria-pressed={applied}
              aria-disabled={!interactive}
              onClick={() => interactive && onToggle(member.name, selectedDate)}
              onKeyDown={(e) => {
                if (!interactive) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle(member.name, selectedDate);
                }
              }}
              className={`flex items-center justify-between gap-1.5 rounded-xl border shadow-sm transition-all duration-200 h-14 px-3 active:scale-95 select-none ${
                interactive ? "cursor-pointer" : "cursor-default"
              } ${disabled ? "opacity-60" : ""} ${
                applied
                  ? "border-primary border-[3px] bg-primary-fixed"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <span className="flex items-center gap-1 min-w-0">
                {applied && (
                  <span
                    className="material-symbols-outlined text-primary shrink-0"
                    style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                )}
                <span className="text-on-surface text-[14px] font-bold truncate">
                  {member.name}
                </span>
              </span>

              {applied && direction && (
                <button
                  type="button"
                  disabled={!interactive}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCycleDirection(member.name, selectedDate);
                  }}
                  className={`shrink-0 px-2 py-1 rounded-full text-[11px] font-bold transition-colors active:scale-95 disabled:opacity-60 ${DIRECTION_BADGE_STYLES[direction]}`}
                >
                  {DIRECTION_LABELS[direction]}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
