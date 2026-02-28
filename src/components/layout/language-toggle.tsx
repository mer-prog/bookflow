"use client";

import { useLocaleContext } from "@/i18n/locale-context";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "sidebar" | "header";
  className?: string;
}

export function LanguageToggle({ variant = "sidebar", className }: Props) {
  const { locale, setLocale, isPending } = useLocaleContext();

  if (variant === "header") {
    return (
      <button
        onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
          "bg-white border border-border text-muted-foreground hover:bg-muted hover:text-foreground",
          isPending && "opacity-50",
          className
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="8" cy="8" rx="3" ry="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1.5 8h13M2.5 5h11M2.5 11h11" stroke="currentColor" strokeWidth="1" />
        </svg>
        {locale === "ja" ? "EN" : "JP"}
      </button>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 bg-muted rounded-lg p-0.5", className)}>
      <button
        onClick={() => setLocale("ja")}
        disabled={isPending}
        className={cn(
          "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
          locale === "ja"
            ? "bg-white text-navy shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        JP
      </button>
      <button
        onClick={() => setLocale("en")}
        disabled={isPending}
        className={cn(
          "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
          locale === "en"
            ? "bg-white text-navy shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
