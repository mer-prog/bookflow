"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { BookingTable } from "@/components/admin/booking-table";
import { cn } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

const statusFilterValues = ["", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;

export default function AdminBookingsPage() {
  const t = useTranslations("bookingList");
  const tStatus = useTranslations("status");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
      );
    }
  }

  const filtered = filter
    ? bookings.filter((b) => b.status === filter)
    : bookings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{t("title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("totalCount", { count: bookings.length })}
        </p>
      </div>

      <div className="flex gap-2">
        {statusFilterValues.map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              filter === value
                ? "bg-navy text-white"
                : "bg-white text-muted-foreground hover:bg-muted border border-border"
            )}
          >
            {value === "" ? tCommon("all") : tStatus(value)}
          </button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
          </div>
        ) : (
          <BookingTable bookings={filtered} onStatusChange={handleStatusChange} />
        )}
      </Card>
    </div>
  );
}
