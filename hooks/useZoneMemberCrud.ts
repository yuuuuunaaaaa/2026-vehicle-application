"use client";

import { useState, useEffect, useCallback } from "react";
import type { Member, Zone } from "@/types/member";

export type EditMode = "add" | "edit";

export interface UseZoneMemberCrudReturn {
  members: Member[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  showEditModal: boolean;
  editMode: EditMode;
  editTarget: Member | null;
  deleteTarget: Member | null;
  openAdd: () => void;
  openEdit: (member: Member) => void;
  closeEditModal: () => void;
  setDeleteTarget: (member: Member | null) => void;
  handleSave: (name: string, isMinor: boolean) => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useZoneMemberCrud(zone: Zone): UseZoneMemberCrudReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("add");
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetch(`/api/members?zone=${encodeURIComponent(zone)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("불러오기 실패");
        return res.json();
      })
      .then((data) => { if (!cancelled) setMembers(data.members); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "오류 발생"); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [zone]);

  const openAdd = useCallback(() => {
    setEditMode("add");
    setEditTarget(null);
    setShowEditModal(true);
  }, []);

  const openEdit = useCallback((member: Member) => {
    setEditMode("edit");
    setEditTarget(member);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => setShowEditModal(false), []);

  const handleSave = async (name: string, isMinor: boolean) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (editMode === "add") {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ zone, name, isMinor }),
        });
        if (!res.ok) throw new Error("추가 실패");
        const data = await res.json();
        setMembers((prev) => [...prev, data.member]);
      } else if (editTarget) {
        const res = await fetch("/api/members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: editTarget.id, name, isMinor }),
        });
        if (!res.ok) throw new Error("수정 실패");
        setMembers((prev) =>
          prev.map((m) => (m.id === editTarget.id ? { ...m, name, isMinor } : m))
        );
      }
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch(`/api/members?id=${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("삭제 실패");
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    members, isLoading, isProcessing, error,
    showEditModal, editMode, editTarget, deleteTarget,
    openAdd, openEdit, closeEditModal, setDeleteTarget,
    handleSave, handleDelete,
  };
}
