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
    fetch("/api/summary")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load summary");
        return res.json();
      })
      .then((data) => setSummary(data.summary))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
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
    fetch(`/api/summary/${encodeURIComponent(date)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load date summary");
        return res.json();
      })
      .then((res) => setData({ date: res.date, summary: res.summary }))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [date]);

  return { ...data, isLoading, error };
}
