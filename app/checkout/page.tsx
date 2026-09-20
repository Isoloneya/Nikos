import CheckoutClient from "./CheckoutClient";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    orderBy: { city: "asc" },
  });

  return <CheckoutClient restaurants={restaurants} />;
}