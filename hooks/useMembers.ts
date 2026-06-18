"use client";

import { useState, useEffect, useCallback } from "react";
import type { Member, Zone } from "@/types/member";

interface UseMembersResult {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useMembers(zone: Zone): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch(`/api/members?zone=${encodeURIComponent(zone)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load members");
        return res.json();
      })
      .then((data) => { if (!cancelled) setMembers(data.members); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [zone, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { members, isLoading, error, refresh };
}
