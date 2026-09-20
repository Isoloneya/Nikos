import BookingForm from "./BookingForm";
import { prisma } from "@/lib/prisma";

export default async function BookingPage() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    orderBy: { city: "asc" },
  });

  return <BookingForm restaurants={restaurants} />;
}