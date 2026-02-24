import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const business = await prisma.business.findFirst();
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }
  return NextResponse.json(business);
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { businessHours, name, description, address, phone, email } = body;

  const business = await prisma.business.findFirst();
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const updated = await prisma.business.update({
    where: { id: business.id },
    data: {
      ...(businessHours && { businessHours }),
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
    },
  });

  return NextResponse.json(updated);
}
