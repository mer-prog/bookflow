"use client";

import { cn, getWeekDates, isSameDay, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

interface Props {
  bookings: BookingWithRelations[];
  viewDate: Date;
  view: "week" | "day";
}

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export function CalendarView({ bookings, viewDate, view }: Props) {
  const dates = view === "week" ? getWeekDates(viewDate) : [viewDate];
  const weekdays = ["月", "火", "水", "木", "金", "土", "日"];
  const today = new Date();

  function getBookingsForDateAndHour(date: Date, hour: number) {
    return bookings.filter((b) => {
      const bDate = new Date(b.date);
      const bHour = parseInt(b.startTime.split(":")[0]);
      return isSameDay(bDate, date) && bHour === hour;
    });
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `80px repeat(${dates.length}, 1fr)` }}>
          <div className="bg-white p-3" />
          {dates.map((date, i) => (
            <div
              key={i}
              className={cn(
                "bg-white p-3 text-center",
                isSameDay(date, today) && "bg-mint/5"
              )}
            >
              <p className="text-xs text-muted-foreground">
                {view === "week" ? weekdays[i] : date.toLocaleDateString("ja-JP", { weekday: "long" })}
              </p>
              <p
                className={cn(
                  "text-lg font-bold",
                  isSameDay(date, today) ? "text-mint" : "text-navy"
                )}
              >
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `80px repeat(${dates.length}, 1fr)` }}>
          {hours.map((hour) => (
            <>
              <div key={`label-${hour}`} className="bg-white p-2 text-right">
                <span className="text-xs text-muted-foreground">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
              {dates.map((date, di) => {
                const cellBookings = getBookingsForDateAndHour(date, hour);
                return (
                  <div
                    key={`${hour}-${di}`}
                    className={cn(
                      "bg-white p-1 min-h-[60px] border-t border-border/50",
                      isSameDay(date, today) && "bg-mint/5"
                    )}
                  >
                    {cellBookings.map((b) => (
                      <div
                        key={b.id}
                        className={cn(
                          "rounded-md p-1.5 mb-1 text-xs",
                          b.status === "CONFIRMED" ? "bg-blue-100 text-blue-800 border-l-2 border-blue-500" :
                          b.status === "PENDING" ? "bg-yellow-100 text-yellow-800 border-l-2 border-yellow-500" :
                          b.status === "COMPLETED" ? "bg-green-100 text-green-800 border-l-2 border-green-500" :
                          "bg-red-100 text-red-800 border-l-2 border-red-500"
                        )}
                      >
                        <p className="font-medium truncate">{b.customerName}</p>
                        <p className="truncate text-[10px] opacity-80">
                          {b.service.name} · {b.staff.name}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
