import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, description, priceCents, photoUrl, categoryId, isSpicy, isVegan, isAvailable, restaurantIds } = body;

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      description,
      priceCents: Number(priceCents),
      photoUrl: photoUrl || null,
      categoryId,
      isSpicy: !!isSpicy,
      isVegan: !!isVegan,
      isAvailable: isAvailable !== undefined ? !!isAvailable : undefined,
      restaurants: { set: (restaurantIds || []).map((rid: string) => ({ id: rid })) },
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  await prisma.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}