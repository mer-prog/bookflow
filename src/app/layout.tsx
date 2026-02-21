import type { Metadata } from "next";
import { SessionProvider } from "@/components/layout/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookFlow - Smart Booking Platform",
  description: "Streamline your scheduling with BookFlow",
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
