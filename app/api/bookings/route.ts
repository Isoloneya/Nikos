import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, phone, email, date, time, guests, restaurantId, comment } = body;

  if (!name || !phone || !email || !date || !time || !guests || !restaurantId) {
    return NextResponse.json({ error: "Заповніть усі обов'язкові поля" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) {
    return NextResponse.json({ error: "Локацію не знайдено" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      name,
      phone,
      email,
      date: new Date(date),
      time,
      guests: Number(guests),
      comment: comment || null,
      restaurantId,
    },
  });

  try {
    await sendBookingConfirmation({
      email,
      name,
      date: booking.date,
      time,
      guests: Number(guests),
      restaurantCity: restaurant.city,
      restaurantAddress: restaurant.address,
    });
  } catch (e) {
    console.error("Не вдалося надіслати email підтвердження бронювання:", e);
  }

  return NextResponse.json(booking, { status: 201 });
}