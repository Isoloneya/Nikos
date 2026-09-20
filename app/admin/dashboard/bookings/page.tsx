import { prisma } from "@/lib/prisma";
import BookingsAdminClient from "./BookingsAdminClient";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { restaurant: true },
    orderBy: { date: "desc" },
  });

  return <BookingsAdminClient initialBookings={bookings} />;
}