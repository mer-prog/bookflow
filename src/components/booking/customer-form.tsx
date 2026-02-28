"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

interface Props {
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
  };
  onChange: (data: Props["data"]) => void;
}

export function CustomerForm({ data, onChange }: Props) {
  const t = useTranslations("booking");

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-4">{t("customerInfo")}</h2>
      <div className="space-y-4">
        <Input
          id="name"
          label={t("customerName")}
          placeholder={t("customerNamePlaceholder")}
          value={data.customerName}
          onChange={(e) => onChange({ ...data, customerName: e.target.value })}
          required
        />
        <Input
          id="email"
          label={t("customerEmail")}
          type="email"
          placeholder="example@email.com"
          value={data.customerEmail}
          onChange={(e) => onChange({ ...data, customerEmail: e.target.value })}
          required
        />
        <Input
          id="phone"
          label={t("customerPhone")}
          type="tel"
          placeholder={t("customerPhonePlaceholder")}
          value={data.customerPhone}
          onChange={(e) => onChange({ ...data, customerPhone: e.target.value })}
        />
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">
            {t("notes")}
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder={t("notesPlaceholder")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
