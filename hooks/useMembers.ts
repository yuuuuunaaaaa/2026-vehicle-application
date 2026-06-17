"use client";

import { useState, useEffect } from "react";
import type { Member, Zone } from "@/types/member";

interface UseMembersResult {
  members: Member[];
  isLoading: boolean;
  error: string | null;
}

export function useMembers(zone: Zone): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [zone]);

  return { members, isLoading, error };
}
