"use client";

import { cn, STATUS_LABELS, STATUS_COLORS, formatPrice } from "@/lib/utils";
import { CancelRiskBadge } from "./cancel-risk-badge";
import { RiskExplanation } from "@/components/ai/risk-explanation";
import type { BookingWithRelations } from "@/types";

interface Props {
  bookings: BookingWithRelations[];
  onStatusChange?: (id: string, status: string) => void;
}

export function BookingTable({ bookings, onStatusChange }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        予約がありません
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">日時</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">顧客</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">サービス</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">担当</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">料金</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">ステータス</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">リスク</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">操作</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">
                    {new Date(booking.date).toLocaleDateString("ja-JP", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {booking.startTime}〜{booking.endTime}
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
                  {STATUS_LABELS[booking.status]}
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
                      確定
                    </button>
                    <span className="text-muted-foreground">|</span>
                    <button
                      onClick={() => onStatusChange(booking.id, "CANCELLED")}
                      className="text-xs text-destructive hover:underline cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                )}
                {booking.status === "CONFIRMED" && onStatusChange && (
                  <button
                    onClick={() => onStatusChange(booking.id, "COMPLETED")}
                    className="text-xs text-green-600 hover:underline cursor-pointer"
                  >
                    完了
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
