"use client";

import type { EventDate } from "@/types/application";
import { EVENT_DATES, DATE_LABELS } from "@/types/application";

export interface DateSelectorProps {
  selectedDate: EventDate;
  onSelect: (date: EventDate) => void;
}

export function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
  return (
    <div role="group" aria-label="날짜 선택">
      {EVENT_DATES.map((date) => (
        <button
          key={date}
          type="button"
          aria-pressed={selectedDate === date}
          onClick={() => onSelect(date)}
        >
          {DATE_LABELS[date]}
        </button>
      ))}
    </div>
  );
}
