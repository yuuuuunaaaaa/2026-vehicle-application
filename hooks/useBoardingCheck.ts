"use client";

import { useState, useEffect, useCallback } from "react";

export type Leg = "outbound" | "return";

function storageKey(date: string, leg: Leg): string {
  return `boarding-check:${date}:${leg}`;
}

interface UseBoardingCheckResult {
  checked: Set<string>;
  toggle: (key: string) => void;
  clear: () => void;
}

export function useBoardingCheck(date: string, leg: Leg): UseBoardingCheckResult {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(date, leg));
      setChecked(raw ? new Set(JSON.parse(raw)) : new Set());
    } catch {
      setChecked(new Set());
    }
  }, [date, leg]);

  const persist = useCallback(
    (next: Set<string>) => {
      setChecked(next);
      try {
        localStorage.setItem(storageKey(date, leg), JSON.stringify(Array.from(next)));
      } catch {
        // localStorage unavailable (e.g. private browsing) — in-memory state still works for this session
      }
    },
    [date, leg]
  );

  const toggle = useCallback(
    (key: string) => {
      const next = new Set(checked);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      persist(next);
    },
    [checked, persist]
  );

  const clear = useCallback(() => {
    persist(new Set());
  }, [persist]);

  return { checked, toggle, clear };
}
