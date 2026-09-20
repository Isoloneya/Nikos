"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

const TABS = ["Мої замовлення", "Особисті дані"] as const;

const STATUS_LABELS: Record<string, string> = {
  NEW: "Нове",
  PREPARING: "Готується",
  ON_THE_WAY: "В дорозі",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

type User = {
  name: string;
  email: string;
  phone: string | null;
};

type OrderSummary = {
  id: string;
  date: string;
  status: string;
  totalCents: number;
};

export default function ProfileClient({ user, orders }: { user: User; orders: OrderSummary[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Мої замовлення");
  const router = useRouter();
  const inputClass = "rounded-lg px-4 py-2.5 text-sm bg-ink border border-border placeholder:text-muted w-full";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Профіль</h1>
          <p className="text-sm text-muted">{user.name} · {user.email}</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded-full text-sm border border-border">Вийти</button>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              tab === t ? "bg-gradient-brand" : "border border-border text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Мої замовлення" ? (
        orders.length === 0 ? (
          <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-4 bg-surface border border-border">
            <p className="text-sm text-muted">У вас ще немає замовлень.</p>
            <Link href="/menu" className="px-6 py-2.5 rounded-full text-sm font-medium border border-magenta text-magenta">
              Зробити замовлення
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-2xl p-4 bg-surface border border-border"
              >
                <div>
                  <p className="font-medium">{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted">
                    {new Date(order.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}
                    {" · "}
                    {formatPrice(order.totalCents)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted">
                  {STATUS_LABELS[order.status]}
                </span>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl p-6 flex flex-col gap-3 bg-surface border border-border max-w-md">
          <input placeholder="Ім'я" defaultValue={user.name} className={inputClass} />
          <input placeholder="Телефон" defaultValue={user.phone ?? ""} className={inputClass} />
          <input placeholder="Email" defaultValue={user.email} className={inputClass} />
          <button className="w-full py-2.5 rounded-full font-medium bg-gradient-brand">
            Зберегти зміни
          </button>
        </div>
      )}
    </section>
  );
}