import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get("serviceId");

  const where: Record<string, unknown> = { active: true };

  if (serviceId) {
    where.staffServices = { some: { serviceId } };
  }

  const staff = await prisma.staff.findMany({
    where,
    include: {
      staffServices: { include: { service: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(staff);
}
