import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const items = await prisma.menuItem.findMany({
    include: { category: true, restaurants: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const body = await request.json();
  const { name, description, priceCents, photoUrl, categoryId, isSpicy, isVegan, restaurantIds } = body;

  if (!name || !description || !priceCents || !categoryId) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      name,
      description,
      priceCents: Number(priceCents),
      photoUrl: photoUrl || null,
      categoryId,
      isSpicy: !!isSpicy,
      isVegan: !!isVegan,
      restaurants: { connect: (restaurantIds || []).map((id: string) => ({ id })) },
    },
  });

  return NextResponse.json(item, { status: 201 });
}