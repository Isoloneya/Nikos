import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const ordersSummary = orders.map((o) => ({
    id: o.id,
    date: o.createdAt.toISOString(),
    status: o.status,
    totalCents: o.totalCents,
  }));

  return (
    <ProfileClient
      user={{ name: user.name, email: user.email, phone: user.phone }}
      orders={ordersSummary}
    />
  );
}