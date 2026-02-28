"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/layout/language-toggle";

const navIcons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 1v4M14 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  bookings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4h14M3 8h14M3 12h10M3 16h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  services: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 10a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const navKeys = [
  { key: "dashboard", href: "/admin" },
  { key: "calendar", href: "/admin/calendar" },
  { key: "bookings", href: "/admin/bookings" },
  { key: "services", href: "/admin/services" },
  { key: "settings", href: "/admin/settings" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <span className="text-lg font-bold text-navy">BookFlow</span>
      </div>
      <nav className="space-y-1">
        {navKeys.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-navy text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {navIcons[item.key]}
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 px-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("backToSite")}
        </Link>
      </div>
      <div className="mt-auto pt-4 px-3">
        <LanguageToggle variant="sidebar" />
      </div>
    </aside>
  );
}
