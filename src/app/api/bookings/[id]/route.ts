import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      staff: true,
      business: true,
      customer: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
  }

  // Customers can only view their own bookings
  const role = (session.user as Record<string, unknown>).role;
  if (role === "CUSTOMER" && booking.customerId !== session.user.id) {
    return NextResponse.json({ error: "アクセス権限がありません" }, { status: 403 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admins can update bookings
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  // Whitelist allowed fields to prevent mass assignment
  const allowedFields = ["status", "notes", "cancelReason", "cancelRisk"] as const;
  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data,
    include: { service: true, staff: true },
  });

  return NextResponse.json(booking);
}
