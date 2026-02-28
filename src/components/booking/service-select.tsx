"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn, formatPrice, formatDuration } from "@/lib/utils";
import type { ServiceWithStaff } from "@/types";

interface Props {
  services: ServiceWithStaff[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ServiceSelect({ services, selectedId, onSelect }: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-4">{t("selectService")}</h2>
      <div className="grid gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer",
              selectedId === service.id
                ? "border-mint bg-mint/5"
                : "border-border hover:border-mint/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span>{formatDuration(service.duration, locale)}</span>
                  <span>•</span>
                  <span>{t("staffLabel")} {service.staffServices.map((ss) => ss.staff.name).join(", ")}</span>
                </div>
              </div>
              <div className="text-lg font-bold text-navy">
                {formatPrice(service.price)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
