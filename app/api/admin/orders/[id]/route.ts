import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  const order = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json(order);
}