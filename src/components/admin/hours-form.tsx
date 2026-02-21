"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BusinessHours } from "@/types";

const days = [
  { key: "monday", label: "月曜日" },
  { key: "tuesday", label: "火曜日" },
  { key: "wednesday", label: "水曜日" },
  { key: "thursday", label: "木曜日" },
  { key: "friday", label: "金曜日" },
  { key: "saturday", label: "土曜日" },
  { key: "sunday", label: "日曜日" },
];

interface Props {
  initial: BusinessHours;
  onSave: (hours: BusinessHours) => Promise<void>;
}

export function HoursForm({ initial, onSave }: Props) {
  const [hours, setHours] = useState<BusinessHours>(initial);
  const [saving, setSaving] = useState(false);

  function updateDay(day: string, field: string, value: string | boolean) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(hours);
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const dayHours = hours[day.key] || { open: "09:00", close: "18:00", closed: false };
        return (
          <div
            key={day.key}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted"
          >
            <div className="w-20 font-medium text-sm">{day.label}</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!dayHours.closed}
                onChange={(e) => updateDay(day.key, "closed", !e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-muted-foreground">営業</span>
            </label>
            {!dayHours.closed && (
              <>
                <input
                  type="time"
                  value={dayHours.open}
                  onChange={(e) => updateDay(day.key, "open", e.target.value)}
                  className="rounded-lg border border-border bg-white px-2 py-1 text-sm"
                />
                <span className="text-muted-foreground">〜</span>
                <input
                  type="time"
                  value={dayHours.close}
                  onChange={(e) => updateDay(day.key, "close", e.target.value)}
                  className="rounded-lg border border-border bg-white px-2 py-1 text-sm"
                />
              </>
            )}
            {dayHours.closed && (
              <span className="text-sm text-muted-foreground">定休日</span>
            )}
          </div>
        );
      })}
      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "保存中..." : "営業時間を保存"}
        </Button>
      </div>
    </div>
  );
}
