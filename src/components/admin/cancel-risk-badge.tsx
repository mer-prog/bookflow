"use client";

import { cn, RISK_LABELS, RISK_COLORS } from "@/lib/utils";

interface Props {
  risk: string;
  className?: string;
}

export function CancelRiskBadge({ risk, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        RISK_COLORS[risk] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {risk === "HIGH" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mr-1">
          <path d="M6 2v4M6 8v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {RISK_LABELS[risk] || risk}
    </span>
  );
}
