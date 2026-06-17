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
    <ul>
      {members.map((member) => {
        const applied = isApplied(member.name, selectedDate);
        return (
          <li key={member.name}>
            <label>
              <input
                type="checkbox"
                checked={applied}
                disabled={isToggling}
                onChange={() => onToggle(member.name, selectedDate)}
              />
              {member.name}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
