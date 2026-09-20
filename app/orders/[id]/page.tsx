import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { getCurrentUser } from "@/lib/get-current-user";

const STEPS = [
  { key: "NEW", label: "Нове" },
  { key: "PREPARING", label: "Готується" },
  { key: "ON_THE_WAY", label: "В дорозі" },
  { key: "DELIVERED", label: "Доставлено" },
];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } } },
  });

  if (!order || order.userId !== user.id) notFound();

  const isCancelled = order.status === "CANCELLED";
  const currentIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-2xl mx-auto">
      <Link href="/profile" className="text-sm text-muted">← Мої замовлення</Link>

      <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-1">Замовлення {order.id.slice(0, 8)}</h1>
      <p className="text-sm text-muted mb-8">
        {order.createdAt.toLocaleString("uk-UA", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
      </p>

      {isCancelled ? (
        <div className="rounded-2xl p-5 bg-surface border border-border mb-8">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-magenta/20 text-magenta">Скасовано</span>
        </div>
      ) : (
        <div className="rounded-2xl p-6 bg-surface border border-border mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => {
              const done = i <= currentIndex;
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center gap-2 relative">
                  {i > 0 && (
                    <div className={`absolute top-2 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-magenta" : "bg-border"}`} />
                  )}
                  <div className={`w-4 h-4 rounded-full relative z-10 ${done ? "bg-gradient-brand" : "bg-border"}`} />
                  <span className={`text-xs text-center ${done ? "text-foreground" : "text-muted"}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="font-semibold mb-4">Склад замовлення</h2>
      <div className="flex flex-col gap-3 mb-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity} × {item.menuItem.name}</span>
            <span className="text-muted">{formatPrice(item.priceAtOrder * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
        <span>Разом</span>
        <span>{formatPrice(order.totalCents)}</span>
      </div>
    </section>
  );
}