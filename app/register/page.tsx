"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inputClass = "rounded-lg px-4 py-2.5 text-sm bg-ink border border-border placeholder:text-muted w-full";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      password: data.get("password"),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Не вдалося зареєструватись");
      setLoading(false);
      return;
    }

    router.push("/profile");
    router.refresh();
  };

  return (
    <section className="px-5 md:px-8 py-16 max-w-md mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Реєстрація</h1>
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 flex flex-col gap-3 bg-surface border border-border">
        <input name="name" placeholder="Ім'я" className={inputClass} required />
        <input name="email" type="email" placeholder="Email" className={inputClass} required />
        <input name="phone" placeholder="Телефон" className={inputClass} />
        <input name="password" type="password" placeholder="Пароль" className={inputClass} required minLength={6} />
        {error && <p className="text-sm text-magenta">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-full font-semibold mt-2 bg-gradient-brand disabled:opacity-50">
          {loading ? "Реєструємо..." : "Зареєструватись"}
        </button>
        <p className="text-sm text-muted text-center mt-2">
          Вже є акаунт? <Link href="/login" className="text-magenta">Увійти</Link>
        </p>
      </form>
    </section>
  );
}