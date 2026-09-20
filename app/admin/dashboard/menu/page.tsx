import { prisma } from "@/lib/prisma";
import MenuAdminClient from "./MenuAdminClient";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    include: { category: true, restaurants: true },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const restaurants = await prisma.restaurant.findMany({ orderBy: { city: "asc" } });

  return (
    <MenuAdminClient
      initialItems={items}
      categories={categories}
      restaurants={restaurants}
    />
  );
}