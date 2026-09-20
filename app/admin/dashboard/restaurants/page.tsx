import { prisma } from "@/lib/prisma";
import RestaurantsAdminClient from "./RestaurantsAdminClient";

export default async function AdminRestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({ orderBy: { city: "asc" } });
  return <RestaurantsAdminClient initialRestaurants={restaurants} />;
}