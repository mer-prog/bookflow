"use client";

import { createContext, useContext, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "./config";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isPending: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = useCallback(
    (newLocale: Locale) => {
      document.cookie = `locale=${newLocale};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`;
      localStorage.setItem("locale", newLocale);
      startTransition(() => {
        router.refresh();
      });
    },
    [router]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used within LocaleProvider");
  return ctx;
}
