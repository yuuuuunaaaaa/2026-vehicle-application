"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AdminAccessButton } from "@/components/ui/AdminAccessButton";
import { LoginModal } from "@/components/ui/LoginModal";
import { Toast } from "@/components/ui/Toast";

interface BottomNavBarProps {
  activeTab: "apply" | "status" | "fare";
  onNavigate?: (href: string) => void;
}

function NavItem({
  href,
  onNavigate,
  active,
  icon,
  label,
}: {
  href: string;
  onNavigate?: (href: string) => void;
  active: boolean;
  icon: string;
  label: string;
}) {
  const className = [
    "flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-200 active:scale-90",
    active
      ? "bg-primary-container text-on-primary-container"
      : "text-on-surface-variant hover:bg-secondary-container",
  ].join(" ");

  const content = (
    <>
      <span
        className="material-symbols-outlined"
        style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span className="text-label-lg">{label}</span>
    </>
  );

  if (onNavigate) {
    return (
      <button type="button" onClick={() => onNavigate(href)} className={className}>
        {content}
      </button>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function BottomNavBar({ activeTab, onNavigate }: BottomNavBarProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex items-center h-touch-target-optimal px-4 pb-safe max-w-2xl mx-auto gap-2">
          {isAuthenticated && (
            <AdminAccessButton
              onClick={() => setShowLoginModal(true)}
              isAuthenticated={isAuthenticated}
            />
          )}
          <div className="flex flex-1 justify-around items-center">
            {isAuthenticated ? (
              <NavItem
                href="/"
                onNavigate={onNavigate}
                active={activeTab === "apply"}
                icon="edit_calendar"
                label="신청하기"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl text-on-surface-variant hover:bg-secondary-container transition-all duration-200 active:scale-90"
              >
                <span className="material-symbols-outlined">lock</span>
                <span className="text-label-lg">로그인</span>
              </button>
            )}
            <NavItem
              href="/summary"
              onNavigate={onNavigate}
              active={activeTab === "status"}
              icon="analytics"
              label="현황확인"
            />
            {isAuthenticated && (
              <NavItem
                href="/fare"
                onNavigate={onNavigate}
                active={activeTab === "fare"}
                icon="payments"
                label="차비"
              />
            )}
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
