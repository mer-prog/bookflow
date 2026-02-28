"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration, formatDateFull, formatTimeRange } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("bookingDetail");
  const ts = useTranslations("status");
  const locale = useLocale();
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    if (!confirm(t("cancelConfirm"))) return;
    setCancelling(true);

    const res = await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
    if (res.ok) {
      const updated = await res.json();
      setBooking(updated);
    }
    setCancelling(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-navy mb-4">{t("notFound")}</h1>
          <Link href="/book">
            <Button variant="primary">{t("newBooking")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusVariant =
    booking.status === "CONFIRMED"
      ? "info"
      : booking.status === "COMPLETED"
        ? "success"
        : booking.status === "CANCELLED" || booking.status === "NO_SHOW"
          ? "destructive"
          : "warning";

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <Card>
          <div className="text-center mb-6">
            {booking.status === "CONFIRMED" && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 16l6 6 10-12" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <h1 className="text-2xl font-bold text-navy">
              {booking.status === "CONFIRMED"
                ? t("confirmed")
                : booking.status === "CANCELLED"
                  ? t("cancelled")
                  : t("detail")}
            </h1>
            <Badge variant={statusVariant} className="mt-2">
              {ts(booking.status)}
            </Badge>
          </div>

          <div className="space-y-4 bg-muted rounded-xl p-5">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("bookingId")}</span>
              <span className="text-sm font-mono">{booking.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("service")}</span>
              <span className="font-medium">{booking.service.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("staff")}</span>
              <span className="font-medium">{booking.staff.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("dateTime")}</span>
              <span className="font-medium">
                {formatDateFull(booking.date, locale)} {formatTimeRange(booking.startTime, booking.endTime, locale)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">{t("duration")}</span>
              <span className="font-medium">{formatDuration(booking.service.duration, locale)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">{t("price")}</span>
              <span className="font-bold text-navy">{formatPrice(booking.service.price)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && booking.status !== "NO_SHOW" && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? t("cancelling") : t("cancelBooking")}
              </Button>
            )}
            <Link href="/book" className="w-full">
              <Button variant="outline" className="w-full">
                {t("newBooking")}
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
