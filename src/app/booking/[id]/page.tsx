"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration, STATUS_LABELS } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
    if (!confirm("予約をキャンセルしますか？")) return;
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
          <h1 className="text-2xl font-bold text-navy mb-4">予約が見つかりません</h1>
          <Link href="/book">
            <Button variant="primary">新しい予約をする</Button>
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
                ? "予約が確定しました"
                : booking.status === "CANCELLED"
                  ? "予約はキャンセルされました"
                  : "予約詳細"}
            </h1>
            <Badge variant={statusVariant} className="mt-2">
              {STATUS_LABELS[booking.status]}
            </Badge>
          </div>

          <div className="space-y-4 bg-muted rounded-xl p-5">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">予約ID</span>
              <span className="text-sm font-mono">{booking.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">サービス</span>
              <span className="font-medium">{booking.service.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">担当</span>
              <span className="font-medium">{booking.staff.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">日時</span>
              <span className="font-medium">
                {new Date(booking.date).toLocaleDateString("ja-JP")} {booking.startTime}〜{booking.endTime}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">所要時間</span>
              <span className="font-medium">{formatDuration(booking.service.duration)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">料金</span>
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
                {cancelling ? "キャンセル中..." : "予約をキャンセル"}
              </Button>
            )}
            <Link href="/book" className="w-full">
              <Button variant="outline" className="w-full">
                新しい予約をする
              </Button>
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
