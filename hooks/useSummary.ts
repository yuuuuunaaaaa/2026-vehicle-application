"use client";

import { useState, useEffect } from "react";
import type { DateSummary, EventDate, ZoneSummaryForDate } from "@/types/application";

interface UseSummaryResult {
  summary: DateSummary[];
  isLoading: boolean;
  error: string | null;
}

export function useSummary(): UseSummaryResult {
  const [summary, setSummary] = useState<DateSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch("/api/summary", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load summary");
        return res.json();
      })
      .then((data) => { if (!cancelled) setSummary(data.summary); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { summary, isLoading, error };
}

interface UseDateSummaryResult {
  date: EventDate | null;
  summary: ZoneSummaryForDate[];
  isLoading: boolean;
  error: string | null;
}

export function useDateSummary(date: string): UseDateSummaryResult {
  const [data, setData] = useState<{
    date: EventDate | null;
    summary: ZoneSummaryForDate[];
  }>({ date: null, summary: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch(`/api/summary/${encodeURIComponent(date)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load date summary");
        return res.json();
      })
      .then((res) => { if (!cancelled) setData({ date: res.date, summary: res.summary }); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [date]);

  return { ...data, isLoading, error };
}
