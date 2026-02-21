import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [todayBookings, weekBookings, totalBookings, cancelledBookings, weekRevenue] =
    await Promise.all([
      prisma.booking.count({
        where: { date: { gte: today, lt: tomorrow }, status: { not: "CANCELLED" } },
      }),
      prisma.booking.count({
        where: { date: { gte: weekStart, lt: weekEnd }, status: { not: "CANCELLED" } },
      }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.booking.findMany({
        where: {
          date: { gte: weekStart, lt: weekEnd },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        include: { service: true },
      }),
    ]);

  const totalRevenue = weekRevenue.reduce((sum, b) => sum + b.service.price, 0);
  const cancelRate = totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

  return NextResponse.json({
    todayBookings,
    weekBookings,
    totalRevenue,
    cancelRate: Math.round(cancelRate * 10) / 10,
  });
}
