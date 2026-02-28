"use client";

import { useTranslations, useLocale } from "next-intl";
import { formatPrice, formatDuration, formatDateFull } from "@/lib/utils";

interface Props {
  service: { name: string; duration: number; price: number } | null;
  staff: { name: string } | null;
  date: string;
  time: string;
  customer: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
  };
}

export function BookingConfirm({ service, staff, date, time, customer }: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-4">{t("confirmTitle")}</h2>
      <div className="bg-muted rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmService")}</span>
          <span className="font-medium">{service?.name}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmDuration")}</span>
          <span className="font-medium">{service ? formatDuration(service.duration, locale) : ""}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmPrice")}</span>
          <span className="font-bold text-navy">{service ? formatPrice(service.price) : ""}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmStaff")}</span>
          <span className="font-medium">{staff?.name}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmDateTime")}</span>
          <span className="font-medium">
            {date ? formatDateFull(date + "T00:00:00", locale) : ""} {time}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmName")}</span>
          <span className="font-medium">{customer.customerName}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">{t("confirmEmail")}</span>
          <span className="font-medium">{customer.customerEmail}</span>
        </div>
        {customer.customerPhone && (
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">{t("confirmPhone")}</span>
            <span className="font-medium">{customer.customerPhone}</span>
          </div>
        )}
        {customer.notes && (
          <div className="py-2">
            <span className="text-sm text-muted-foreground">{t("confirmNotes")}</span>
            <p className="font-medium mt-1">{customer.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
