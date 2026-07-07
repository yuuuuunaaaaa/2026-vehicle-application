"use client";

import { useState, useEffect, useCallback } from "react";
import type { Application, Direction, EventDate } from "@/types/application";
import { NEXT_DIRECTION } from "@/types/application";
import type { Zone } from "@/types/member";

type Override = Direction | "removed";

interface UseApplicationsResult {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  isApplied: (name: string, date: EventDate) => boolean;
  getDirection: (name: string, date: EventDate) => Direction | null;
  pendingToggle: (name: string, date: EventDate) => void;
  cycleDirection: (name: string, date: EventDate) => void;
  save: (date: EventDate) => Promise<void>;
  isSaving: boolean;
  hasPendingChanges: (date: EventDate) => boolean;
  resetPendingChanges: () => void;
  discardPendingChangesForDate: (date: EventDate) => void;
  refresh: () => void;
}

export function useApplications(zone: Zone): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Map<string, Override>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch(`/api/applications?zone=${encodeURIComponent(zone)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load applications");
        return res.json();
      })
      .then((data) => { if (!cancelled) setApplications(data.applications); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error"); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [zone, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const serverDirection = useCallback(
    (name: string, date: EventDate): Direction | null => {
      const app = applications.find((a) => a.name === name && a.date === date);
      return app ? app.direction : null;
    },
    [applications]
  );

  const getDirection = useCallback(
    (name: string, date: EventDate): Direction | null => {
      const override = pendingChanges[date]?.get(name);
      if (override === "removed") return null;
      if (override) return override;
      return serverDirection(name, date);
    },
    [pendingChanges, serverDirection]
  );

  const isApplied = useCallback(
    (name: string, date: EventDate) => getDirection(name, date) !== null,
    [getDirection]
  );

  const applyOverride = useCallback(
    (date: EventDate, name: string, next: Direction | null) => {
      setPendingChanges((prev) => {
        const dateMap = new Map(prev[date] ?? []);
        if (next === serverDirection(name, date)) {
          dateMap.delete(name);
        } else {
          dateMap.set(name, next === null ? "removed" : next);
        }
        if (dateMap.size === 0) {
          const rest = { ...prev };
          delete rest[date];
          return rest;
        }
        return { ...prev, [date]: dateMap };
      });
    },
    [serverDirection]
  );

  const pendingToggle = useCallback(
    (name: string, date: EventDate) => {
      const current = getDirection(name, date);
      applyOverride(date, name, current === null ? "both" : null);
    },
    [getDirection, applyOverride]
  );

  const cycleDirection = useCallback(
    (name: string, date: EventDate) => {
      const current = getDirection(name, date);
      if (current === null) return;
      applyOverride(date, name, NEXT_DIRECTION[current]);
    },
    [getDirection, applyOverride]
  );

  const hasPendingChanges = useCallback(
    (date: EventDate) => (pendingChanges[date]?.size ?? 0) > 0,
    [pendingChanges]
  );

  const resetPendingChanges = useCallback(() => {
    setPendingChanges({});
  }, []);

  const discardPendingChangesForDate = useCallback((date: EventDate) => {
    setPendingChanges((prev) => {
      if (!prev[date]) return prev;
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, []);

  const save = useCallback(
    async (date: EventDate) => {
      setIsSaving(true);
      setError(null);
      try {
        const finalMap = new Map<string, Direction>(
          applications.filter((a) => a.date === date).map((a) => [a.name, a.direction])
        );
        for (const [name, value] of pendingChanges[date] ?? []) {
          if (value === "removed") {
            finalMap.delete(name);
          } else {
            finalMap.set(name, value);
          }
        }
        const entries = Array.from(finalMap.entries()).map(([name, direction]) => ({
          name,
          direction,
        }));

        const res = await fetch("/api/applications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ zone, date, entries }),
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error("저장 권한이 없습니다. 관리자 로그인이 필요합니다.");
          throw new Error("Failed to save applications");
        }

        setApplications((prev) => {
          const others = prev.filter((a) => a.date !== date);
          const newApps: Application[] = entries.map(({ name, direction }) => ({
            idx: 0,
            memberIdx: 0,
            zone,
            name,
            date,
            direction,
            updated_at: new Date().toISOString(),
          }));
          return [...others, ...newApps];
        });

        setPendingChanges((prev) => {
          const next = { ...prev };
          delete next[date];
          return next;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsSaving(false);
      }
    },
    [zone, applications, pendingChanges]
  );

  return {
    applications,
    isLoading,
    error,
    isApplied,
    getDirection,
    pendingToggle,
    cycleDirection,
    save,
    isSaving,
    hasPendingChanges,
    resetPendingChanges,
    discardPendingChangesForDate,
    refresh,
  };
}
