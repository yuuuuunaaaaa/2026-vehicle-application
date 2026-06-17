"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AdminAccessButton } from "@/components/ui/AdminAccessButton";
import { LoginModal } from "@/components/ui/LoginModal";
import { Toast } from "@/components/ui/Toast";

interface BottomNavBarProps {
  activeTab: "apply" | "status";
}

export function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex items-center h-touch-target-optimal px-4 pb-safe max-w-2xl mx-auto gap-2">
          <AdminAccessButton
            onClick={() => setShowLoginModal(true)}
            isAuthenticated={isAuthenticated}
          />
          <div className="flex flex-1 justify-around items-center">
            <Link
              href="/"
              className={
                activeTab === "apply"
                  ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-1 active:scale-90 transition-all duration-200"
                  : "flex flex-col items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-all p-2 rounded-lg active:scale-90 duration-200"
              }
            >
              <span className="material-symbols-outlined">edit_calendar</span>
              <span className="text-label-lg">신청하기</span>
            </Link>
            <Link
              href="/summary"
              className={
                activeTab === "status"
                  ? "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-1 active:scale-90 transition-all duration-200"
                  : "flex flex-col items-center justify-center text-on-surface-variant hover:bg-secondary-container transition-all p-2 rounded-lg active:scale-90 duration-200"
              }
            >
              <span
                className="material-symbols-outlined"
                style={activeTab === "status" ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                analytics
              </span>
              <span className="text-label-lg">현황확인</span>
            </Link>
          </div>
        </div>
      </nav>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
        onLoginSuccess={() => setSuccessMessage("로그인되었습니다.")}
        onLogoutSuccess={() => setSuccessMessage("로그아웃되었습니다.")}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <Toast message={successMessage} onHide={() => setSuccessMessage(null)} />
    </>
  );
}
