import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, description, duration, price, active, staffIds } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (duration !== undefined) data.duration = parseInt(duration);
  if (price !== undefined) data.price = parseInt(price);
  if (active !== undefined) data.active = active;

  const service = await prisma.service.update({
    where: { id },
    data,
    include: { staffServices: { include: { staff: true } } },
  });

  if (staffIds) {
    await prisma.staffService.deleteMany({ where: { serviceId: id } });
    await prisma.staffService.createMany({
      data: staffIds.map((staffId: string) => ({ staffId, serviceId: id })),
    });
  }

  return NextResponse.json(service);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.staffService.deleteMany({ where: { serviceId: id } });
  await prisma.service.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
