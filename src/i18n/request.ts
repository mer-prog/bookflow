import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  // 1. Check cookie first
  const cookieLocale = cookieStore.get("locale")?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return {
      locale: cookieLocale,
      messages: (await import(`../messages/${cookieLocale}.json`)).default,
    };
  }

  // 2. Parse Accept-Language header for auto-detection
  const acceptLanguage = headerStore.get("accept-language") || "";
  const detectedLocale = parseAcceptLanguage(acceptLanguage);

  const locale = detectedLocale || defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

function parseAcceptLanguage(header: string): Locale | null {
  if (!header) return null;

  const languages = header
    .split(",")
    .map((part) => {
      const [lang, quality] = part.trim().split(";q=");
      return {
        lang: lang.trim().toLowerCase(),
        q: quality ? parseFloat(quality) : 1.0,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("en")) return "en";
  }

  return null;
}
