"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

type Order = {
  id: string;
  type: string;
  status: string;
  totalCents: number;
  contactName: string;
  contactPhone: string;
  address: string | null;
  createdAt: string;
  restaurant: { city: string; address: string };
  items: { quantity: number; menuItem: { name: string } }[];
};

const STATUS_OPTIONS = ["NEW", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"];
const STATUS_LABELS: Record<string, string> = {
  NEW: "Нове",
  PREPARING: "Готується",
  ON_THE_WAY: "В дорозі",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export default function OrdersAdminClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Замовлення</h1>

      <div className="flex flex-col gap-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl p-4 bg-surface border border-border flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium">{o.id.slice(0, 8)} · {formatPrice(o.totalCents)}</p>
              <p className="text-sm text-muted">
                {o.type === "DELIVERY" ? "Доставка" : "Самовивіз"} · {o.restaurant.city}, {o.restaurant.address}
              </p>
              <p className="text-sm text-muted">{o.contactName} · {o.contactPhone}{o.address && ` · ${o.address}`}</p>
              <p className="text-sm text-muted mt-1">
                {o.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
              </p>
            </div>
            <select
              value={o.status}
              onChange={(e) => handleStatusChange(o.id, e.target.value)}
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