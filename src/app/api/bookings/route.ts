import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes, timeRangesOverlap } from "@/lib/utils";
import { calculateCancelRisk } from "@/lib/cancel-risk";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();

  // Require authentication to list bookings
  if (!session?.user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const staffId = searchParams.get("staffId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (staffId) where.staffId = staffId;

  // If customer, only show their bookings
  if ((session.user as Record<string, unknown>).role === "CUSTOMER") {
    where.customerId = session.user.id;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      service: true,
      staff: true,
      customer: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    serviceId,
    staffId,
    date,
    time,
    customerName,
    customerEmail,
    customerPhone,
    notes,
  } = body;

  if (!serviceId || !staffId || !date || !time || !customerName || !customerEmail) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "サービスが見つかりません" }, { status: 404 });
  }

  const business = await prisma.business.findFirst();
  if (!business) {
    return NextResponse.json({ error: "ビジネスが見つかりません" }, { status: 404 });
  }

  const endTime = addMinutes(time, service.duration);
  const bookingDate = new Date(date);

  // Check for existing customer
  const session = await auth();
  let customerId: string | null = null;
  if (session?.user) {
    customerId = session.user.id!;
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { email: customerEmail },
    });
    if (existingUser) customerId = existingUser.id;
  }

  // Calculate cancel risk
  let pastCancellations = 0;
  let totalBookings = 0;
  if (customerId) {
    totalBookings = await prisma.booking.count({
      where: { customerId },
    });
    pastCancellations = await prisma.booking.count({
      where: { customerId, status: "CANCELLED" },
    });
  }

  const cancelRisk = calculateCancelRisk({
    bookingDate,
    createdAt: new Date(),
    startTime: time,
    pastCancellations,
    totalBookings,
  });

  // Reject double bookings: conflict check + create run atomically in a
  // Serializable transaction so concurrent requests cannot both pass the check
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        const existingBookings = await tx.booking.findMany({
          where: {
            staffId,
            date: { gte: startOfDay, lte: endOfDay },
            status: { in: ["CONFIRMED", "PENDING"] },
          },
        });

        const hasConflict = existingBookings.some((b) =>
          timeRangesOverlap(time, endTime, b.startTime, b.endTime)
        );
        if (hasConflict) return null;

        return tx.booking.create({
          data: {
            businessId: business.id,
            serviceId,
            staffId,
            customerId,
            customerName,
            customerEmail,
            customerPhone: customerPhone || null,
            date: bookingDate,
            startTime: time,
            endTime,
            status: "CONFIRMED",
            cancelRisk,
            notes: notes || null,
          },
          include: { service: true, staff: true },
        });
      },
      { isolationLevel: "Serializable" }
    );

    if (!booking) {
      return NextResponse.json(
        { error: "指定の時間帯は既に予約が入っています" },
        { status: 409 }
      );
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    // P2034: serialization conflict between concurrent transactions
    if (
      error instanceof Error &&
      (error as Error & { code?: string }).code === "P2034"
    ) {
      return NextResponse.json(
        { error: "指定の時間帯は既に予約が入っています" },
        { status: 409 }
      );
    }
    throw error;
  }
}
