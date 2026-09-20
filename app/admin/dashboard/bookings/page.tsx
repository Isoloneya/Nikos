import { prisma } from "@/lib/prisma";
import BookingsAdminClient from "./BookingsAdminClient";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { restaurant: true },
    orderBy: { date: "desc" },
  });

  const serialized = bookings.map((b) => ({
    ...b,
    date: b.date.toISOString(),
  }));

  return <BookingsAdminClient initialBookings={serialized} />;
}