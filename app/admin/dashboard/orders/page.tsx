import { prisma } from "@/lib/prisma";
import OrdersAdminClient from "./OrdersAdminClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { restaurant: true, items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  return <OrdersAdminClient initialOrders={serialized} />;
}