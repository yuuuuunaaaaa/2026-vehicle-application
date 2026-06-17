"use client";

import type { Member } from "@/types/member";
import type { EventDate } from "@/types/application";

export interface MemberListProps {
  members: Member[];
  selectedDate: EventDate;
  isApplied: (name: string, date: EventDate) => boolean;
  onToggle: (name: string, date: EventDate) => void;
  isToggling: boolean;
}

export function MemberList({
  members,
  selectedDate,
  isApplied,
  onToggle,
  isToggling,
}: MemberListProps) {
  return (
    <>
      <p className="text-center text-body-md text-on-surface-variant flex items-center justify-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>touch_app</span>
        성명을 누르면 즉시 저장됩니다
      </p>
      <div className="grid gap-2 grid-cols-3">
        {members.map((member) => {
          const applied = isApplied(member.name, selectedDate);
          return (
            <button
              key={member.name}
              type="button"
              disabled={isToggling}
              onClick={() => onToggle(member.name, selectedDate)}
              className={`flex items-center justify-between rounded-xl border shadow-sm transition-all duration-200 h-14 px-2 active:scale-95 disabled:opacity-60 ${
                applied
                  ? "border-primary border-[3px] bg-primary-fixed"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <span className="text-on-surface text-[14px] font-bold truncate">{member.name}</span>
              {applied && (
                <span
                  className="material-symbols-outlined text-primary shrink-0"
                  style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
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
