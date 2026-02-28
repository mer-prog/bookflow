"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CancelRiskBadge } from "./cancel-risk-badge";
import { RiskExplanation } from "@/components/ai/risk-explanation";
import { useTranslations, useLocale } from "next-intl";
import { formatDateShort } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 bg-navy text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#4ECDC4" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10 4L4 10M4 4l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function AtRiskBookings({ bookings }: { bookings: BookingWithRelations[] }) {
  const [sentReminders, setSentReminders] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const t = useTranslations("dashboard");
  const locale = useLocale();

  const atRisk = bookings.filter(
    (b) => b.cancelRisk !== "LOW" && b.status !== "CANCELLED" && b.status !== "COMPLETED" && b.status !== "NO_SHOW"
  );

  function handleSendReminder(bookingId: string, customerName: string) {
    setSentReminders((prev) => new Set(prev).add(bookingId));
    setToast(t("reminderToast", { name: customerName }));
    setTimeout(() => setToast(null), 3000);
  }

  if (atRisk.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-navy mb-4">{t("atRiskTitle")}</h3>
        <p className="text-muted-foreground text-sm">{t("noAtRisk")}</p>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-navy">{t("atRiskTitle")}</h3>
          <span className="bg-red-100 text-red-800 text-xs font-medium rounded-full px-2 py-0.5">
            {atRisk.length}
          </span>
        </div>
        <div className="space-y-3">
          {atRisk.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg border border-red-100"
            >
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-bold text-navy">
                    {formatDateShort(booking.date, locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.startTime}</p>
                </div>
                <div>
                  <p className="font-medium">{booking.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.service.name} · {booking.staff.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CancelRiskBadge risk={booking.cancelRisk} />
                {sentReminders.has(booking.id) ? (
                  <Button size="sm" variant="outline" disabled className="text-green-600 border-green-200">
                    {t("reminderSent")}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendReminder(booking.id, booking.customerName)}
                  >
                    {t("sendReminder")}
                  </Button>
                )}
                <RiskExplanation bookingId={booking.id} risk={booking.cancelRisk} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
