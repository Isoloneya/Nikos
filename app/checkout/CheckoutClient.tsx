"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

type Restaurant = {
  id: string;
  city: string;
  address: string;
};

type PaymentMethod = "online" | "on_pickup";

export default function CheckoutClient({ restaurants }: { restaurants: Restaurant[] }) {
  const [type, setType] = useState<"delivery" | "pickup">("delivery");
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?.id ?? "");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { cart, clearCart, cartCount, cartTotalCents } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (type === "delivery") setPayment("online");
  }, [type]);

  const inputClass = "rounded-lg px-4 py-2.5 text-sm bg-ink border border-border placeholder:text-muted";

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      items: cart.map((i) => ({ id: i.id, qty: i.qty, priceCents: i.priceCents })),
      type: type === "delivery" ? "DELIVERY" : "PICKUP",
      address: type === "delivery" ? address : null,
      paymentMethod: payment === "online" ? "ONLINE" : "ON_PICKUP",
      contactName,
      contactPhone,
      contactEmail,
      comment,
      restaurantId,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || "Не вдалося оформити замовлення");
        setStatus("error");
        return;
      }

      clearCart();
      router.push("/");
    } catch {
      setErrorMsg("Не вдалося з'єднатись із сервером");
      setStatus("error");
    }
  };

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Оформлення замовлення</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl p-5 bg-surface border border-border">
            <h3 className="font-semibold mb-4 text-sm">Спосіб отримання</h3>
            <div className="flex gap-3">
              {(["delivery", "pickup"] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setType(val)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${
                    type === val ? "bg-gradient-brand" : "border border-border text-muted"
                  }`}
                >
                  {val === "delivery" ? "Доставка" : "Самовивіз"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5 flex flex-col gap-3 bg-surface border border-border">
            <h3 className="font-semibold mb-1 text-sm">Локація</h3>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className={inputClass}
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id} className="bg-ink">
                  {r.city}, {r.address}
                </option>
              ))}
            </select>
          </div>

          {type === "delivery" && (
            <div className="rounded-2xl p-5 flex flex-col gap-3 bg-surface border border-border">
              <h3 className="font-semibold mb-1 text-sm">Адреса доставки</h3>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Вулиця, будинок, квартира"
                className={inputClass}
              />
            </div>
          )}

          <div className="rounded-2xl p-5 flex flex-col gap-3 bg-surface border border-border">
            <h3 className="font-semibold mb-1 text-sm">Контактні дані</h3>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ім'я"
              className={inputClass}
            />
            <input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Телефон"
              className={inputClass}
            />
            <input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className={inputClass}
            />
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Коментар (необов'язково)"
              className={inputClass}
            />
          </div>

          <div className="rounded-2xl p-5 bg-surface border border-border">
            <h3 className="font-semibold mb-4 text-sm">Оплата</h3>

            {type === "delivery" ? (
              <p className="text-sm text-muted">
                Для доставки доступна лише онлайн-оплата карткою — курʼєр готівку чи картку не приймає.
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {([
                  ["online", "Оплата онлайн карткою"],
                  ["on_pickup", "Оплата на місці (готівка/картка)"],
                ] as const).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-2.5 text-sm text-muted">
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === val}
                      onChange={() => setPayment(val)}
                      className="accent-magenta"
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {status === "error" && <p className="text-sm text-magenta">{errorMsg}</p>}
        </div>

        <div className="rounded-2xl p-6 h-fit bg-surface border border-border">
          <h3 className="font-semibold mb-4">Разом до сплати</h3>
          <div className="flex justify-between font-bold text-lg mb-6 pb-4 border-b border-border">
            <span>{cartCount} товари</span><span>{formatPrice(cartTotalCents)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || status === "submitting"}
            className="w-full py-3 rounded-full font-semibold bg-gradient-brand disabled:opacity-40"
          >
            {status === "submitting" ? "Оформлюємо..." : payment === "online" ? "Оплатити онлайн" : "Підтвердити замовлення"}
          </button>
        </div>
      </div>
    </section>
  );
}