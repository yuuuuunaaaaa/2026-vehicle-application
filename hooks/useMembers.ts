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
    setIsLoading(true);
    setError(null);
    fetch(`/api/members?zone=${encodeURIComponent(zone)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load members");
        return res.json();
      })
      .then((data) => setMembers(data.members))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [zone, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { members, isLoading, error, refresh };
}
