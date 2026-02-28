"use client";

import { useEffect } from "react";

export function LocaleSync() {
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved && (saved === "ja" || saved === "en")) {
      const current = document.cookie
        .split("; ")
        .find((c) => c.startsWith("locale="))
        ?.split("=")[1];
      if (current !== saved) {
        document.cookie = `locale=${saved};path=/;max-age=${365 * 24 * 60 * 60};samesite=lax`;
        window.location.reload();
      }
    }
  }, []);

  return null;
}
