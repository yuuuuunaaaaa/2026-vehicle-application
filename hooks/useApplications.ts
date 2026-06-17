"use client";

import { useState, useEffect, useCallback } from "react";
import type { Application, EventDate } from "@/types/application";
import type { Zone } from "@/types/member";

interface UseApplicationsResult {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  isApplied: (name: string, date: EventDate) => boolean;
  toggle: (name: string, date: EventDate) => Promise<void>;
  isToggling: boolean;
}

export function useApplications(zone: Zone): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/applications?zone=${encodeURIComponent(zone)}`
      );
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
    (name: string, date: EventDate) =>
      applications.some((a) => a.name === name && a.date === date),
    [applications]
  );

  const toggle = useCallback(
    async (name: string, date: EventDate) => {
      setIsToggling(true);
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zone, name, date }),
        });
        if (!res.ok) throw new Error("Failed to toggle application");
        // Optimistic update
        const { action } = await res.json();
        if (action === "added") {
          setApplications((prev) => [
            ...prev,
            { zone, name, date, updated_at: new Date().toISOString() },
          ]);
        } else {
          setApplications((prev) =>
            prev.filter((a) => !(a.name === name && a.date === date))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Re-fetch on error to sync state
        await fetchApplications();
      } finally {
        setIsToggling(false);
      }
    },
    [zone, fetchApplications]
  );

  return { applications, isLoading, error, isApplied, toggle, isToggling };
}
