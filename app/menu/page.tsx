import MenuClient from "./MenuClient";
import { prisma } from "@/lib/prisma";
import { getSelectedRestaurant } from "@/lib/get-selected-restaurant";

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const restaurant = await getSelectedRestaurant();

  const items = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
      ...(restaurant ? { restaurants: { some: { id: restaurant.id } } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <MenuClient
      items={items}
      categories={categories.map((c) => c.name)}
      initialSearch={q ?? ""}
      restaurantCity={restaurant?.city ?? null}
    />
  );
}