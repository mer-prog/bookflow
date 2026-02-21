"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "簡単オンライン予約",
    description: "24時間いつでも、数クリックで予約完了。お客様の利便性を最大化します。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M4 13h24" stroke="currentColor" strokeWidth="2" />
        <path d="M10 3v6M22 3v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "スマートスケジュール管理",
    description: "カレンダービューで一目で予約状況を把握。ダブルブッキングを防止します。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
        <path d="M16 10v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "AIリスク分析",
    description: "キャンセルリスクをAIが予測。事前に対策を打てるインサイトを提供します。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 24l6-8 5 4 7-10 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "顧客管理",
    description: "予約履歴から顧客の傾向を分析。リピーター獲得に繋げます。",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M6 27c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight">
              予約管理を、
              <span className="text-mint">もっとスマート</span>に。
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              BookFlowは、美容院・サロン・クリニックなど、あらゆる予約ビジネスの効率を劇的に改善するスケジューリングプラットフォームです。
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" variant="secondary">
                  今すぐ予約する
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  無料で始める
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
            <h2 className="text-3xl font-bold text-navy">主な機能</h2>
            <p className="mt-3 text-muted-foreground">
              ビジネスの成長をサポートする充実の機能
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-mint/10 text-mint rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
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
              今日から始めましょう
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              BookFlowで予約管理を効率化し、お客様満足度を向上させましょう。
            </p>
            <Link href="/book">
              <Button size="lg" variant="secondary">
                予約を始める
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
