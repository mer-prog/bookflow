import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDayName, addMinutes, timeToMinutes } from "@/lib/utils";
import type { BusinessHours } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const staffId = searchParams.get("staffId");

  if (!date || !serviceId || !staffId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const business = await prisma.business.findFirst();
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const bookingDate = new Date(date);
  const dayName = getDayName(bookingDate);
  const hours = business.businessHours as BusinessHours;
  const dayHours = hours[dayName];

  if (!dayHours || dayHours.closed) {
    return NextResponse.json([]);
  }

  // Get existing bookings for this staff on this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await prisma.booking.findMany({
    where: {
      staffId,
      date: { gte: startOfDay, lte: endOfDay },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
  });

  // Generate time slots
  const slots: { time: string; available: boolean }[] = [];
  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);

  for (let m = openMinutes; m + service.duration <= closeMinutes; m += 30) {
    const slotStart = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const slotEnd = addMinutes(slotStart, service.duration);
    const slotStartMin = m;
    const slotEndMin = m + service.duration;

    const hasConflict = existingBookings.some((b) => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return slotStartMin < bEnd && slotEndMin > bStart;
    });

    slots.push({ time: slotStart, available: !hasConflict });
  }

  return NextResponse.json(slots);
}
