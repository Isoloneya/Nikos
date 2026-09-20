import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getSelectedRestaurant() {
  const cookieStore = await cookies();
  const id = cookieStore.get("restaurantId")?.value;

  if (id) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id } });
    if (restaurant && restaurant.isActive) return restaurant;
  }

  return prisma.restaurant.findFirst({ where: { isActive: true }, orderBy: { city: "asc" } });
}