"use client";

import { cn, STATUS_COLORS, formatPrice, formatDateShort, formatTimeRange } from "@/lib/utils";
import { CancelRiskBadge } from "./cancel-risk-badge";
import { RiskExplanation } from "@/components/ai/risk-explanation";
import { useTranslations, useLocale } from "next-intl";
import type { BookingWithRelations } from "@/types";

interface Props {
  bookings: BookingWithRelations[];
  onStatusChange?: (id: string, status: string) => void;
}

export function BookingTable({ bookings, onStatusChange }: Props) {
  const t = useTranslations("bookingList");
  const tStatus = useTranslations("status");
  const locale = useLocale();

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("noBookings")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("dateTime")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("customer")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("service")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("staff")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("price")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("statusLabel")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("risk")}</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">
                    {formatDateShort(booking.date, locale)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatTimeRange(booking.startTime, booking.endTime, locale)}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="font-medium">{booking.customerName}</p>
                <p className="text-muted-foreground text-xs">{booking.customerEmail}</p>
              </td>
              <td className="py-3 px-4">{booking.service.name}</td>
              <td className="py-3 px-4">{booking.staff.name}</td>
              <td className="py-3 px-4 font-medium">{formatPrice(booking.service.price)}</td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    STATUS_COLORS[booking.status]
                  )}
                >
                  {tStatus(booking.status)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <CancelRiskBadge risk={booking.cancelRisk} />
                  <RiskExplanation bookingId={booking.id} risk={booking.cancelRisk} />
                </div>
              </td>
              <td className="py-3 px-4">
                {booking.status === "PENDING" && onStatusChange && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => onStatusChange(booking.id, "CONFIRMED")}
                      className="text-xs text-mint hover:underline cursor-pointer"
                    >
                      {t("actionConfirm")}
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button
                      onClick={() => onStatusChange(booking.id, "CANCELLED")}
                      className="text-xs text-destructive hover:underline cursor-pointer"
                    >
                      {t("actionCancel")}
                    </button>
                  </div>
                )}
                {booking.status === "CONFIRMED" && onStatusChange && (
                  <button
                    onClick={() => onStatusChange(booking.id, "COMPLETED")}
                    className="text-xs text-green-600 hover:underline cursor-pointer"
                  >
                    {t("actionComplete")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
