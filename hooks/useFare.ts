"use client";

import { useState, useEffect } from "react";
import type { FareSummary } from "@/types/fare";

export function useFare() {
  const [fare, setFare] = useState<FareSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch("/api/fare", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("차비 불러오기 실패");
        return res.json() as Promise<{ fare: FareSummary }>;
      })
      .then((data) => {
        if (!cancelled) setFare(data?.fare ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "오류 발생");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { fare, isLoading, error };
}
