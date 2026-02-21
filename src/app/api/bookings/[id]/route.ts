import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true, staff: true, business: true, customer: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const booking = await prisma.booking.update({
    where: { id },
    data: body,
    include: { service: true, staff: true },
  });

  return NextResponse.json(booking);
}
