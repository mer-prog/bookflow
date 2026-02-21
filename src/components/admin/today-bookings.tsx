"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_COLORS, timeToMinutes } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

export function TodayBookings({ bookings }: { bookings: BookingWithRelations[] }) {
  const sorted = [...bookings].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  if (bookings.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-navy mb-4">今日の予約</h3>
        <p className="text-muted-foreground text-sm">今日の予約はありません</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-navy mb-4">今日の予約</h3>
      <div className="space-y-3">
        {sorted.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-center min-w-[60px]">
                <p className="text-lg font-bold text-navy">{booking.startTime}</p>
                <p className="text-xs text-muted-foreground">{booking.endTime}</p>
              </div>
              <div>
                <p className="font-medium">{booking.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.service.name} · {booking.staff.name}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                STATUS_COLORS[booking.status]
              )}
            >
              {STATUS_LABELS[booking.status]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
