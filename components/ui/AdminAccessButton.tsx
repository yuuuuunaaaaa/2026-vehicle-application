"use client";

interface AdminAccessButtonProps {
  onClick: () => void;
  isAuthenticated: boolean;
}

export function AdminAccessButton({ onClick, isAuthenticated }: AdminAccessButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isAuthenticated ? "관리자 메뉴" : "관리자 로그인"}
      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
        isAuthenticated
          ? "opacity-50 hover:opacity-90 bg-primary/15 border-primary/30"
          : "opacity-30 hover:opacity-70 bg-surface-container border-outline-variant/50"
      }`}
    >
      <span
        className="material-symbols-outlined text-on-surface-variant"
        style={{ fontSize: 16 }}
      >
        {isAuthenticated ? "verified_user" : "lock"}
      </span>
    </button>
  );
}
