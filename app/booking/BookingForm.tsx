"use client";

import { useState, FormEvent } from "react";
import { Calendar, Clock, MapPin, Users as UsersIcon } from "lucide-react";

type Restaurant = {
  id: string;
  city: string;
  address: string;
};

export default function BookingForm({ restaurants }: { restaurants: Restaurant[] }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const inputClass = "rounded-lg px-4 py-2.5 text-sm bg-ink border border-border placeholder:text-muted w-full";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      date: data.get("date"),
      time: data.get("time"),
      guests: data.get("guests"),
      restaurantId: data.get("restaurantId"),
      comment: data.get("comment"),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || "Щось пішло не так");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMsg("Не вдалося з'єднатись із сервером");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="px-5 md:px-8 py-16 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Бронювання прийнято</h1>
        <p className="text-sm text-muted mb-6">Підтвердження надіслано на вашу пошту.</p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-3 rounded-full font-medium border border-border"
        >
          Забронювати ще раз
        </button>
      </section>
    );
  }

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Забронювати столик</h1>
      <p className="text-sm mb-8 text-muted">Оберіть локацію, дату й час — ми підтвердимо бронювання на пошту.</p>

      <form onSubmit={handleSubmit} className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4 bg-surface border border-border">
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="name" placeholder="Ім'я" className={inputClass} required />
          <input name="phone" placeholder="Телефон" className={inputClass} required />
        </div>
        <input name="email" placeholder="Email" type="email" className={inputClass} required />

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-ink border border-border">
            <Calendar size={15} className="text-muted flex-shrink-0" />
            <input name="date" type="date" className="bg-transparent outline-none text-sm w-full" required />
          </div>
          <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-ink border border-border">
            <Clock size={15} className="text-muted flex-shrink-0" />
            <input name="time" type="time" className="bg-transparent outline-none text-sm w-full" required />
          </div>
          <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-ink border border-border">
            <UsersIcon size={15} className="text-muted flex-shrink-0" />
            <input name="guests" type="number" min={1} placeholder="Гостей" className="bg-transparent outline-none text-sm w-full placeholder:text-muted" required />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-ink border border-border">
          <MapPin size={15} className="text-lantern flex-shrink-0" />
          <select name="restaurantId" className="bg-transparent outline-none text-sm w-full" required defaultValue="">
            <option value="" disabled>Оберіть локацію</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id} className="bg-ink">
                {r.city}, {r.address}
              </option>
            ))}
          </select>
        </div>

        <textarea name="comment" placeholder="Коментар (необов'язково)" rows={3} className="rounded-lg px-4 py-2.5 text-sm bg-ink border border-border placeholder:text-muted resize-none" />

        {status === "error" && (
          <p className="text-sm text-magenta">{errorMsg}</p>
        )}

        <button type="submit" disabled={status === "submitting"} className="w-full py-3 rounded-full font-semibold mt-2 bg-gradient-brand disabled:opacity-50">
          {status === "submitting" ? "Надсилаємо..." : "Забронювати"}
        </button>
      </form>
    </section>
  );
}