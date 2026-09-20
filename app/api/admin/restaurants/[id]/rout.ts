import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, city, address, phone, workingHours, bookingEmail, isActive } = body;

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: { name, city, address, phone, workingHours, bookingEmail, isActive },
  });

  return NextResponse.json(restaurant);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  await prisma.restaurant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
