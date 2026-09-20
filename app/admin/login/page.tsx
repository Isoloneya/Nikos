"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inputClass = "rounded-lg px-4 py-2.5 text-sm bg-ink border border-border placeholder:text-muted w-full";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Не вдалося увійти");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard/menu");
    router.refresh();
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-5 bg-ink">
      <form onSubmit={handleSubmit} className="rounded-2xl p-6 flex flex-col gap-3 bg-surface border border-border w-full max-w-sm">
        <h1 className="text-xl font-bold mb-2">Вхід в адмінку</h1>
        <input name="email" type="email" placeholder="Email" className={inputClass} required />
        <input name="password" type="password" placeholder="Пароль" className={inputClass} required />
        {error && <p className="text-sm text-magenta">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-full font-semibold mt-2 bg-gradient-brand disabled:opacity-50">
          {loading ? "Входимо..." : "Увійти"}
        </button>
      </form>
    </section>
  );
}