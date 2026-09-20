import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, type, address, paymentMethod, contactName, contactPhone, contactEmail, comment, restaurantId } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Кошик порожній" }, { status: 400 });
  }
  if (!restaurantId || !contactName || !contactPhone) {
    return NextResponse.json({ error: "Заповніть обов'язкові поля" }, { status: 400 });
  }
  if (type === "DELIVERY" && !address) {
    return NextResponse.json({ error: "Вкажіть адресу доставки" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const totalCents = items.reduce((sum: number, i: { priceCents: number; qty: number }) => sum + i.priceCents * i.qty, 0);

  const order = await prisma.order.create({
    data: {
      type,
      address: address || null,
      paymentMethod,
      totalCents,
      contactName,
      contactPhone,
      comment: comment || null,
      restaurantId,
      userId: user?.id ?? null,
      items: {
        create: items.map((i: { id: string; qty: number; priceCents: number; name?: string }) => ({
          menuItemId: i.id,
          quantity: i.qty,
          priceAtOrder: i.priceCents,
        })),
      },
    },
    include: { items: { include: { menuItem: true } } },
  });

  const emailTo = contactEmail || user?.email;
  if (emailTo) {
    try {
      await sendOrderConfirmation({
        email: emailTo,
        contactName,
        orderId: order.id,
        totalCents: order.totalCents,
        type: order.type,
        items: order.items.map((i) => ({ name: i.menuItem.name, quantity: i.quantity })),
      });
    } catch (e) {
      console.error("Не вдалося надіслати email підтвердження замовлення:", e);
    }
  }

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { menuItem: true } } },
  });

  return NextResponse.json(orders);
}