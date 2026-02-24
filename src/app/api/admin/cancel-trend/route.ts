import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const weeks = [];

  for (let i = 3; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);

    const [total, cancelled] = await Promise.all([
      prisma.booking.count({
        where: { date: { gte: weekStart, lt: weekEnd } },
      }),
      prisma.booking.count({
        where: {
          date: { gte: weekStart, lt: weekEnd },
          status: { in: ["CANCELLED", "NO_SHOW"] },
        },
      }),
    ]);

    const rate = total > 0 ? Math.round((cancelled / total) * 1000) / 10 : 0;

    weeks.push({
      week: `第${4 - i}週`,
      cancelRate: rate,
      total,
      cancelled,
    });
  }

  return NextResponse.json(weeks);
}
