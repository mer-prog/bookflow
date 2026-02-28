import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "@/components/layout/session-provider";
import { LocaleProvider } from "@/i18n/locale-context";
import { LocaleSync } from "@/i18n/locale-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookFlow - スマート予約管理プラットフォーム",
  description: "美容院・サロン向けAI搭載予約管理SaaS。キャンセルリスク予測で無断キャンセルを事前防止。",
  openGraph: {
    title: "BookFlow - スマート予約管理プラットフォーム",
    description: "美容院・サロン向けAI搭載予約管理SaaS。キャンセルリスク予測で無断キャンセルを事前防止。",
    type: "website",
    url: "https://bookflow-five.vercel.app",
    locale: "ja_JP",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <LocaleProvider>
              <LocaleSync />
              {children}
            </LocaleProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
