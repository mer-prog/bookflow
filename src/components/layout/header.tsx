"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/language-toggle";

export function Header() {
  const { data: session } = useSession();
  const t = useTranslations("header");

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-navy">BookFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/book" className="text-sm text-muted-foreground hover:text-navy transition-colors">
              {t("booking")}
            </Link>
            {session ? (
              <>
                {(session.user as Record<string, unknown>).role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-muted-foreground hover:text-navy transition-colors">
                    {t("admin")}
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">{session.user?.name}</span>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">{t("login")}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">{t("register")}</Button>
                </Link>
              </>
            )}
            <LanguageToggle variant="header" />
          </nav>
        </div>
      </div>
    </header>
  );
}
