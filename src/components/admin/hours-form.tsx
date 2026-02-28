"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { BusinessHours } from "@/types";

const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

interface Props {
  initial: BusinessHours;
  onSave: (hours: BusinessHours) => Promise<void>;
}

export function HoursForm({ initial, onSave }: Props) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
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
      {dayKeys.map((key) => {
        const dayHours = hours[key] || { open: "09:00", close: "18:00", closed: false };
        return (
          <div
            key={key}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted"
          >
            <div className="w-20 font-medium text-sm">{t(`days.${key}`)}</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!dayHours.closed}
                onChange={(e) => updateDay(key, "closed", !e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-muted-foreground">{t("open")}</span>
            </label>
            {!dayHours.closed && (
              <>
                <input
                  type="time"
                  value={dayHours.open}
                  onChange={(e) => updateDay(key, "open", e.target.value)}
                  className="rounded-lg border border-border bg-white px-2 py-1 text-sm"
                />
                <span className="text-muted-foreground">~</span>
                <input
                  type="time"
                  value={dayHours.close}
                  onChange={(e) => updateDay(key, "close", e.target.value)}
                  className="rounded-lg border border-border bg-white px-2 py-1 text-sm"
                />
              </>
            )}
            {dayHours.closed && (
              <span className="text-sm text-muted-foreground">{t("closedDay")}</span>
            )}
          </div>
        );
      })}
      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? tCommon("saving") : t("saveHours")}
        </Button>
      </div>
    </div>
  );
}
