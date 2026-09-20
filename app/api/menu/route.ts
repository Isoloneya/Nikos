import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const restaurantId = request.nextUrl.searchParams.get("restaurantId");
  const category = request.nextUrl.searchParams.get("category");

  const items = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
      ...(restaurantId ? { restaurants: { some: { id: restaurantId } } } : {}),
      ...(category ? { category: { name: category } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(items);
}