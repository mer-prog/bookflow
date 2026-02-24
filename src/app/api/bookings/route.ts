import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "@/lib/utils";
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

  const booking = await prisma.booking.create({
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

  return NextResponse.json(booking, { status: 201 });
}
