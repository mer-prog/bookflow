"use client";

import { Card } from "@/components/ui/card";
import { CancelRiskBadge } from "./cancel-risk-badge";
import { RiskExplanation } from "@/components/ai/risk-explanation";
import type { BookingWithRelations } from "@/types";

export function AtRiskBookings({ bookings }: { bookings: BookingWithRelations[] }) {
  const atRisk = bookings.filter(
    (b) => b.cancelRisk !== "LOW" && b.status !== "CANCELLED" && b.status !== "COMPLETED"
  );

  if (atRisk.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-navy mb-4">要注意予約</h3>
        <p className="text-muted-foreground text-sm">現在、要注意の予約はありません</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-navy">要注意予約</h3>
        <span className="bg-red-100 text-red-800 text-xs font-medium rounded-full px-2 py-0.5">
          {atRisk.length}件
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
                  {new Date(booking.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
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
              <RiskExplanation bookingId={booking.id} risk={booking.cancelRisk} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
