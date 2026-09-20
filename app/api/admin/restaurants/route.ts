import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/get-current-admin";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const restaurants = await prisma.restaurant.findMany({ orderBy: { city: "asc" } });
  return NextResponse.json(restaurants);
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });

  const body = await request.json();
  const { name, city, address, phone, workingHours, bookingEmail } = body;

  if (!name || !city || !address || !phone || !workingHours || !bookingEmail) {
    return NextResponse.json({ error: "Заповніть усі поля" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.create({
    data: { name, city, address, phone, workingHours, bookingEmail },
  });

  return NextResponse.json(restaurant, { status: 201 });
}