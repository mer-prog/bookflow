"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import type { TimeSlotOption } from "@/types";

interface Props {
  serviceId: string;
  staffId: string;
  selectedDate: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onSelectStaff: (id: string) => void;
  staff: { id: string; name: string }[];
}

export function DatetimeSelect({
  serviceId,
  staffId,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onSelectStaff,
  staff,
}: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [slots, setSlots] = useState<TimeSlotOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    if (selectedDate && staffId && serviceId) {
      setLoading(true);
      fetch(
        `/api/timeslots?date=${selectedDate}&serviceId=${serviceId}&staffId=${staffId}`
      )
        .then((r) => r.json())
        .then((data) => {
          setSlots(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedDate, staffId, serviceId]);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const weekday = t(`weekdaysShort.${d.getDay()}`);
    return `${d.getMonth() + 1}/${d.getDate()}(${weekday})`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-4">{t("selectDateTime")}</h2>

      {/* Staff selection */}
      {staff.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">{t("selectStaff")}</label>
          <div className="flex flex-wrap gap-2">
            {staff.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectStaff(s.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  staffId === s.id
                    ? "bg-navy text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">{t("selectDate")}</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => {
                onSelectDate(date);
                onSelectTime("");
              }}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                selectedDate === date
                  ? "bg-mint text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {formatDateLabel(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && staffId && (
        <div>
          <label className="block text-sm font-medium mb-2">{t("selectTime")}</label>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mint" />
              {t("checkingAvailability")}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-muted-foreground py-4">{t("noSlots")}</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots
                .filter((s) => s.available)
                .map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => onSelectTime(slot.time)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      selectedTime === slot.time
                        ? "bg-mint text-white"
                        : "bg-muted text-foreground hover:bg-mint/10"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
