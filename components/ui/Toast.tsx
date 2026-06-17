"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, onHide, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [message, onHide, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-on-primary shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <span
        className="material-symbols-outlined shrink-0"
        style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
      >
        check_circle
      </span>
      <span className="text-body-md font-medium whitespace-nowrap">{message}</span>
    </div>
  );
}
