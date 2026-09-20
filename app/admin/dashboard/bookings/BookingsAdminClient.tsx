"use client";

import { useState } from "react";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  comment: string | null;
  status: string;
  restaurant: { city: string; address: string };
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "CANCELLED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Очікує",
  CONFIRMED: "Підтверджено",
  CANCELLED: "Скасовано",
};

export default function BookingsAdminClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusChange = async (id: string, status: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Бронювання</h1>

      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl p-4 bg-surface border border-border flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium">{b.name} · {b.guests} гостей</p>
              <p className="text-sm text-muted">
                {new Date(b.date).toLocaleDateString("uk-UA")} о {b.time} · {b.restaurant.city}, {b.restaurant.address}
              </p>
              <p className="text-sm text-muted">{b.phone} · {b.email}</p>
              {b.comment && <p className="text-sm text-muted mt-1">💬 {b.comment}</p>}
            </div>
            <select
              value={b.status}
              onChange={(e) => handleStatusChange(b.id, e.target.value)}
              className="rounded-lg px-3 py-2 text-sm bg-ink border border-border"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-ink">{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}