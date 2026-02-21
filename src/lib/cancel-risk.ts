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

export function getRiskFactors(input: RiskInput): string[] {
  const factors: string[] = [];
  const leadTimeHours =
    (input.bookingDate.getTime() - input.createdAt.getTime()) / (1000 * 60 * 60);

  if (leadTimeHours < 2) factors.push("直前予約（2時間以内）");
  else if (leadTimeHours < 24) factors.push("当日予約（24時間以内）");
  else if (leadTimeHours < 72) factors.push("短期予約（3日以内）");

  if (input.totalBookings > 0) {
    const cancelRate = input.pastCancellations / input.totalBookings;
    if (cancelRate > 0.3) factors.push("過去キャンセル率が高い（30%超）");
    else if (cancelRate > 0.15) factors.push("過去キャンセル歴あり（15%超）");
  }

  const dow = input.bookingDate.getDay();
  if (dow === 1) factors.push("月曜日（キャンセル多発曜日）");
  if (dow === 5) factors.push("金曜日（キャンセル多発曜日）");

  const hour = parseInt(input.startTime.split(":")[0]);
  if (hour < 10) factors.push("早朝時間帯");
  if (hour >= 17) factors.push("夕方以降の時間帯");

  return factors;
}
