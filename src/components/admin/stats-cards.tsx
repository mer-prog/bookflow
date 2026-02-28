"use client";

import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { DashboardStats } from "@/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const t = useTranslations("dashboard");

  const items = [
    {
      label: t("todayBookings"),
      value: `${stats.todayBookings}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
          <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      color: "text-mint bg-mint/10",
    },
    {
      label: t("weekBookings"),
      value: `${stats.weekBookings}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 20l4-8 4 4 4-8 4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: t("weekRevenue"),
      value: formatPrice(stats.totalRevenue),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 010 3H9M9 12.5h4.5a1.5 1.5 0 010 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: "text-green-600 bg-green-50",
    },
    {
      label: t("cancelRate"),
      value: `${stats.cancelRate}%`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-bold text-navy">{item.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
