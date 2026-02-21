import type { Metadata } from "next";
import { SessionProvider } from "@/components/layout/session-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
