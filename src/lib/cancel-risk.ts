import { CancelRisk } from "@/generated/prisma/client";

interface RiskInput {
  bookingDate: Date;
  createdAt: Date;
  startTime: string;
  pastCancellations: number;
  totalBookings: number;
}

export function calculateCancelRisk(input: RiskInput): CancelRisk {
  let score = 0;

  // Lead time (0-40 points)
  const leadTimeHours =
    (input.bookingDate.getTime() - input.createdAt.getTime()) / (1000 * 60 * 60);
  if (leadTimeHours < 2) score += 40;
  else if (leadTimeHours < 24) score += 25;
  else if (leadTimeHours < 72) score += 10;

  // Past cancellation rate (0-35 points)
  if (input.totalBookings > 0) {
    const cancelRate = input.pastCancellations / input.totalBookings;
    if (cancelRate > 0.3) score += 35;
    else if (cancelRate > 0.15) score += 20;
    else if (cancelRate > 0) score += 5;
  }

  // Day of week (0-10 points)
  const dow = input.bookingDate.getDay();
  if (dow === 1 || dow === 5) score += 10; // Mon/Fri

  // Time of day (0-15 points)
  const hour = parseInt(input.startTime.split(":")[0]);
  if (hour < 10 || hour >= 17) score += 15;

  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

const factorMessages = {
  ja: {
    lastMinute: "直前予約（2時間以内）",
    sameDay: "当日予約（24時間以内）",
    shortNotice: "短期予約（3日以内）",
    highCancelRate: "過去キャンセル率が高い（30%超）",
    hasCancelHistory: "過去キャンセル歴あり（15%超）",
    monday: "月曜日（キャンセル多発曜日）",
    friday: "金曜日（キャンセル多発曜日）",
    earlyMorning: "早朝時間帯",
    lateEvening: "夕方以降の時間帯",
  },
  en: {
    lastMinute: "Last-minute booking (within 2 hours)",
    sameDay: "Same-day booking (within 24 hours)",
    shortNotice: "Short-notice booking (within 3 days)",
    highCancelRate: "High past cancellation rate (over 30%)",
    hasCancelHistory: "Has cancellation history (over 15%)",
    monday: "Monday (high cancellation day)",
    friday: "Friday (high cancellation day)",
    earlyMorning: "Early morning time slot",
    lateEvening: "Late afternoon/evening time slot",
  },
};

export function getRiskFactors(input: RiskInput, locale: string = "ja"): string[] {
  const factors: string[] = [];
  const msgs = locale === "en" ? factorMessages.en : factorMessages.ja;
  const leadTimeHours =
    (input.bookingDate.getTime() - input.createdAt.getTime()) / (1000 * 60 * 60);

  if (leadTimeHours < 2) factors.push(msgs.lastMinute);
  else if (leadTimeHours < 24) factors.push(msgs.sameDay);
  else if (leadTimeHours < 72) factors.push(msgs.shortNotice);

  if (input.totalBookings > 0) {
    const cancelRate = input.pastCancellations / input.totalBookings;
    if (cancelRate > 0.3) factors.push(msgs.highCancelRate);
    else if (cancelRate > 0.15) factors.push(msgs.hasCancelHistory);
  }

  const dow = input.bookingDate.getDay();
  if (dow === 1) factors.push(msgs.monday);
  if (dow === 5) factors.push(msgs.friday);

  const hour = parseInt(input.startTime.split(":")[0]);
  if (hour < 10) factors.push(msgs.earlyMorning);
  if (hour >= 17) factors.push(msgs.lateEvening);

  return factors;
}
