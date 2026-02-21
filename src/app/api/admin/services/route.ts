import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    include: { staffServices: { include: { staff: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, duration, price, staffIds } = body;

  const business = await prisma.business.findFirst();
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const service = await prisma.service.create({
    data: {
      businessId: business.id,
      name,
      description: description || null,
      duration: parseInt(duration),
      price: parseInt(price),
      staffServices: staffIds?.length
        ? {
            create: staffIds.map((staffId: string) => ({ staffId })),
          }
        : undefined,
    },
    include: { staffServices: { include: { staff: true } } },
  });

  return NextResponse.json(service, { status: 201 });
}
