"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { StatsCards } from "@/components/admin/stats-cards";
import { TodayBookings } from "@/components/admin/today-bookings";
import { AtRiskBookings } from "@/components/admin/at-risk-bookings";
import { CancelRateChart } from "@/components/admin/cancel-rate-chart";
import type { DashboardStats, BookingWithRelations } from "@/types";

export default function AdminDashboard() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    weekBookings: 0,
    totalRevenue: 0,
    cancelRate: 0,
  });
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/bookings").then((r) => r.json()),
    ]).then(([statsData, bookingsData]) => {
      setStats(statsData);
      setBookings(bookingsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = bookings.filter((b) => {
    const d = new Date(b.date);
    return d >= today && d < tomorrow;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t("title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayBookings bookings={todayBookings} />
        <AtRiskBookings bookings={bookings} />
      </div>

      <CancelRateChart />
    </div>
  );
}
