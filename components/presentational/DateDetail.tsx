"use client";

import { useState } from "react";
import type { ZoneSummaryForDate } from "@/types/application";

export interface DateDetailProps {
  summary: ZoneSummaryForDate[];
  isAdmin?: boolean;
}

export function DateDetail({ summary, isAdmin = false }: DateDetailProps) {
  const [openZone, setOpenZone] = useState<string | null>(
    summary.length > 0 ? summary[0].zone : null
  );

  const toggle = (zone: string) => {
    setOpenZone((prev) => (prev === zone ? null : zone));
  };

  return (
    <div className="space-y-stack-gap-sm">
      {summary.map(({ zone, count, members, paidMembers, minorMembers }) => {
        const isOpen = openZone === zone;
        const paidSet = new Set(paidMembers);
        const minorSet = new Set(minorMembers);
        return (
          <div
            key={zone}
            className={`bg-white border rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 ${
              isOpen ? "border-primary ring-2 ring-primary" : "border-outline-variant"
            }`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between p-card-inner-padding min-h-touch-target-optimal hover:bg-surface-container-low transition-colors"
              onClick={() => toggle(zone)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>
                    map
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-headline-md text-on-surface">{zone}</h3>
                  <p className="text-body-md text-on-surface-variant">총 {count}명 신청 완료</p>
                </div>
              </div>
              <span
                className={`material-symbols-outlined text-outline rotate-icon ${isOpen ? "rotate-180" : ""}`}
                style={{ transition: "transform 0.3s ease" }}
              >
                expand_more
              </span>
            </button>
            {isOpen && (
              <div className="px-card-inner-padding pb-5 space-y-3">
                {members.length > 0 ? (
                  members.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg"
                    >
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        person
                      </span>
                      <span className="text-body-lg text-on-surface">{name}</span>
                      {isAdmin ? (
                        minorSet.has(name) ? (
                          <span className="ml-auto text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                            무료
                          </span>
                        ) : paidSet.has(name) ? (
                          <span className="ml-auto text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                            납부
                          </span>
                        ) : (
                          <span className="ml-auto text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                            미납
                          </span>
                        )
                      ) : (
                        <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          확정
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-on-surface-variant text-body-md italic">
                    신청자가 없습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
