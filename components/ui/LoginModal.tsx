"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<string | null>;
  isAuthenticated: boolean;
  onLogout: () => Promise<void>;
}

export function LoginModal({
  isOpen,
  onClose,
  onLogin,
  isAuthenticated,
  onLogout,
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const loginError = await onLogin(username, password);
    setIsSubmitting(false);
    if (loginError) {
      setError(loginError);
      return;
    }
    setUsername("");
    setPassword("");
    onClose();
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    await onLogout();
    setIsSubmitting(false);
    setUsername("");
    setPassword("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={isSubmitting ? undefined : onClose} />
      <div className="relative w-full sm:max-w-sm bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl">
        <div className="p-6">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 sm:hidden" />

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface">관리자 모드</h2>
                  <p className="text-body-md text-on-surface-variant">신청 내용을 수정할 수 있습니다.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl border border-outline-variant text-on-surface text-label-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? "처리 중..." : "로그아웃"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">lock</span>
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface">관리자 로그인</h2>
                  <p className="text-body-md text-on-surface-variant">수정 권한이 필요합니다.</p>
                </div>
              </div>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디"
                autoComplete="username"
                className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                autoComplete="current-password"
                className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md"
              />

              {error && (
                <p role="alert" className="text-error text-body-sm">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl border border-outline-variant text-on-surface text-label-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  닫기
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !username || !password}
                  className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-label-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "로그인 중..." : "로그인"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
