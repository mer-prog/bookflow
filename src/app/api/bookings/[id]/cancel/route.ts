import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
  }

  // Customers can only cancel their own bookings
  const role = (session.user as Record<string, unknown>).role;
  if (role === "CUSTOMER" && booking.customerId !== session.user.id) {
    return NextResponse.json({ error: "アクセス権限がありません" }, { status: 403 });
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "既にキャンセルされています" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: { service: true, staff: true },
  });

  return NextResponse.json(updated);
}
