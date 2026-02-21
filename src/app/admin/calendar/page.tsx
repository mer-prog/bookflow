"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarView } from "@/components/admin/calendar-view";
import { cn } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [view, setView] = useState<"week" | "day">("week");

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  function navigateDate(direction: number) {
    const d = new Date(viewDate);
    if (view === "week") {
      d.setDate(d.getDate() + direction * 7);
    } else {
      d.setDate(d.getDate() + direction);
    }
    setViewDate(d);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">カレンダー</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {viewDate.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("week")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                view === "week" ? "bg-navy text-white" : "bg-white text-muted-foreground hover:bg-muted"
              )}
            >
              週
            </button>
            <button
              onClick={() => setView("day")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                view === "day" ? "bg-navy text-white" : "bg-white text-muted-foreground hover:bg-muted"
              )}
            >
              日
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setViewDate(new Date())}>
            今日
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateDate(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateDate(1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
          </div>
        ) : (
          <CalendarView bookings={bookings} viewDate={viewDate} view={view} />
        )}
      </Card>
    </div>
  );
}
