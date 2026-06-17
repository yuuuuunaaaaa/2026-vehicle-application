import Link from "next/link";

interface TopAppBarProps {
  title: string;
  backHref?: string;
  onBackClick?: () => void;
  titleColor?: "primary" | "on-surface";
  titleSize?: "headline-md" | "headline-lg";
}

export function TopAppBar({
  title,
  backHref,
  onBackClick,
  titleColor = "primary",
  titleSize = "headline-md",
}: TopAppBarProps) {
  const titleClass = [
    titleSize === "headline-lg" ? "text-headline-lg" : "text-headline-md",
    titleColor === "on-surface" ? "text-on-surface" : "text-primary",
  ].join(" ");

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-touch-target-optimal bg-surface border-b border-outline-variant shadow-sm">
      <div className="flex items-center h-full px-container-padding max-w-2xl mx-auto">
        {onBackClick ? (
          <button
            type="button"
            onClick={onBackClick}
            className="shrink-0 mr-4 p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
            aria-label="뒤로 가기"
          >
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 24 }}>
              arrow_back
            </span>
          </button>
        ) : (
          backHref && (
            <Link
              href={backHref}
              className="shrink-0 mr-4 p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
              aria-label="뒤로 가기"
            >
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 24 }}>
                arrow_back
              </span>
            </Link>
          )
        )}
        <h1 className={`${titleClass} truncate min-w-0`}>{title}</h1>
      </div>
    </header>
  );
}
