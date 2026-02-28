"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const featureIcons = [
  <svg key="0" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="6" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M4 13h24" stroke="currentColor" strokeWidth="2" />
    <path d="M10 3v6M22 3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="20" r="2" fill="currentColor" />
  </svg>,
  <svg key="1" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
    <path d="M16 10v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="2" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4 24l6-8 5 4 7-10 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="26" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>,
  <svg key="3" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="2" />
    <path d="M6 27c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>,
];

const featureKeys = ["feature1", "feature2", "feature3", "feature4"] as const;

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight break-keep">
              {t("heroTitle")}
              <span className="whitespace-nowrap"><span className="text-mint">{t("heroTitleAccent")}</span>{t("heroTitleSuffix")}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("heroDescription")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" variant="secondary">
                  {t("ctaBook")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  {t("ctaStart")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mint/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-navy/5 rounded-full blur-3xl" />
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy">{t("featuresTitle")}</h2>
            <p className="mt-3 text-muted-foreground">
              {t("featuresSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureKeys.map((key, i) => (
              <div
                key={key}
                className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-mint/10 text-mint rounded-lg flex items-center justify-center mb-4">
                  {featureIcons[i]}
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {t(`${key}Title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-navy rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("ctaSectionTitle")}
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              {t("ctaSectionDesc")}
            </p>
            <Link href="/book">
              <Button size="lg" variant="secondary">
                {t("ctaSectionButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
