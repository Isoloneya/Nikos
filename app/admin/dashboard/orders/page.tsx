import { prisma } from "@/lib/prisma";
import OrdersAdminClient from "./OrdersAdminClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { restaurant: true, items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <OrdersAdminClient initialOrders={orders} />;
}