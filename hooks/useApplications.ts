"use client";

import { useState, useEffect, useCallback } from "react";
import type { Application, EventDate } from "@/types/application";
import type { Zone } from "@/types/member";

interface UseApplicationsResult {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  isApplied: (name: string, date: EventDate) => boolean;
  pendingToggle: (name: string, date: EventDate) => void;
  save: (date: EventDate) => Promise<void>;
  isSaving: boolean;
  hasPendingChanges: (date: EventDate) => boolean;
}

export function useApplications(zone: Zone): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Set<string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications?zone=${encodeURIComponent(zone)}`);
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(data.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [zone]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const isApplied = useCallback(
    (name: string, date: EventDate) => {
      const serverApplied = applications.some((a) => a.name === name && a.date === date);
      const isPending = pendingChanges[date]?.has(name) ?? false;
      return serverApplied !== isPending;
    },
    [applications, pendingChanges]
  );

  const pendingToggle = useCallback((name: string, date: EventDate) => {
    setPendingChanges((prev) => {
      const existing = new Set(prev[date] ?? []);
      if (existing.has(name)) {
        existing.delete(name);
      } else {
        existing.add(name);
      }
      return { ...prev, [date]: existing };
    });
  }, []);

  const hasPendingChanges = useCallback(
    (date: EventDate) => (pendingChanges[date]?.size ?? 0) > 0,
    [pendingChanges]
  );

  const save = useCallback(
    async (date: EventDate) => {
      setIsSaving(true);
      setError(null);
      try {
        const serverSet = new Set(
          applications.filter((a) => a.date === date).map((a) => a.name)
        );
        for (const name of pendingChanges[date] ?? []) {
          if (serverSet.has(name)) {
            serverSet.delete(name);
          } else {
            serverSet.add(name);
          }
        }
        const names = Array.from(serverSet);

        const res = await fetch("/api/applications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zone, date, names }),
        });
        if (!res.ok) throw new Error("Failed to save applications");

        setApplications((prev) => {
          const others = prev.filter((a) => a.date !== date);
          const newApps: Application[] = names.map((name) => ({
            zone,
            name,
            date,
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
    pendingToggle,
    save,
    isSaving,
    hasPendingChanges,
  };
}
