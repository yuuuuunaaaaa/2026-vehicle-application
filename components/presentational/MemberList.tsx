"use client";

import type { Member } from "@/types/member";
import type { EventDate } from "@/types/application";

export interface MemberListProps {
  members: Member[];
  selectedDate: EventDate;
  isApplied: (name: string, date: EventDate) => boolean;
  onToggle: (name: string, date: EventDate) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function MemberList({
  members,
  selectedDate,
  isApplied,
  onToggle,
  disabled = false,
  readOnly = false,
}: MemberListProps) {
  return (
    <>
      <p className="text-center text-body-md text-on-surface-variant flex items-center justify-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {readOnly ? "visibility" : "touch_app"}
        </span>
        {readOnly ? "조회 전용입니다. 수정은 관리자만 가능합니다." : "성명을 눌러 신청 여부를 변경하세요"}
      </p>
      <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
        {members.map((member) => {
          const applied = isApplied(member.name, selectedDate);
          return (
            <button
              key={member.name}
              type="button"
              disabled={disabled || readOnly}
              onClick={() => onToggle(member.name, selectedDate)}
              className={`relative flex items-center justify-center rounded-xl border shadow-sm transition-all duration-200 h-14 px-2 active:scale-95 disabled:opacity-60 ${
                readOnly ? "cursor-default" : ""
              } ${
                applied
                  ? "border-primary border-[3px] bg-primary-fixed"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <span className="text-on-surface text-[14px] font-bold text-center">{member.name}</span>
              {applied && (
                <span
                  className="absolute right-1.5 material-symbols-outlined text-primary"
                  style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
