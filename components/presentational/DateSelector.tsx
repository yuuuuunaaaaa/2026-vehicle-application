"use client";

import type { EventDate } from "@/types/application";
import { EVENT_DATES, DATE_LABELS, DATE_DAY_LABELS } from "@/types/application";

export interface DateSelectorProps {
  selectedDate: EventDate;
  onSelect: (date: EventDate) => void;
  endSlot?: React.ReactNode;
}

export function DateSelector({ selectedDate, onSelect, endSlot }: DateSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-label-lg text-on-surface-variant px-1">날짜 선택</p>
      <div
        className="flex overflow-x-auto hide-scrollbar gap-3 -mx-container-padding px-container-padding"
        role="group"
        aria-label="날짜 선택"
      >
        {EVENT_DATES.map((date) => {
          const active = selectedDate === date;
          return (
            <button
              key={date}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(date)}
              className={`flex-none min-w-[80px] h-touch-target-optimal rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                active
                  ? "border-primary border-[3px] bg-primary-fixed"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <span className="text-xs font-bold text-on-surface">{DATE_LABELS[date]}</span>
              <span className="text-body-md font-bold text-on-surface">{DATE_DAY_LABELS[date]}</span>
            </button>
          );
        })}
        {endSlot}
      </div>
    </div>
  );
}
