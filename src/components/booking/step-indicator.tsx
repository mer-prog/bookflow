"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const t = useTranslations("booking");

  const steps = [
    { label: t("step1"), step: 1 },
    { label: t("step2"), step: 2 },
    { label: t("step3"), step: 3 },
    { label: t("step4"), step: 4 },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep >= s.step
                  ? "bg-mint text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > s.step ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                s.step
              )}
            </div>
            <span
              className={cn(
                "text-sm hidden sm:block",
                currentStep >= s.step ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-0.5 mx-2",
                currentStep > s.step ? "bg-mint" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
