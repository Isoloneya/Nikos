"use client";

import { useState } from "react";

type Restaurant = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours: string;
  bookingEmail: string;
  isActive: boolean;
};

const emptyForm = {
  id: "",
  name: "",
  city: "",
  address: "",
  phone: "",
  workingHours: "",
  bookingEmail: "",
  isActive: true,
};

export default function RestaurantsAdminClient({ initialRestaurants }: { initialRestaurants: Restaurant[] }) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const inputClass = "rounded-lg px-3 py-2 text-sm bg-ink border border-border placeholder:text-muted w-full";

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const loadIntoForm = (r: Restaurant) => {
    setForm(r);
    setEditingId(r.id);
  };

  const handleSubmit = async () => {
    setError("");
    const url = editingId ? `/api/admin/restaurants/${editingId}` : "/api/admin/restaurants";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Не вдалося зберегти");
      return;
    }

    const saved = await res.json();
    setRestaurants((prev) =>
      editingId ? prev.map((r) => (r.id === editingId ? saved : r)) : [...prev, saved]
    );
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити локацію?")) return;
    await fetch(`/api/admin/restaurants/${id}`, { method: "DELETE" });
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Локації</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-3">
          {restaurants.map((r) => (
            <div key={r.id} className="flex items-center gap-4 rounded-2xl p-4 bg-surface border border-border">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{r.city} — {r.name}</p>
                <p className="text-xs text-muted">{r.address} · {r.phone} · {r.workingHours}{!r.isActive && " · вимкнено"}</p>
              </div>
              <button onClick={() => loadIntoForm(r)} className="px-3 py-1.5 rounded-lg text-sm border border-border">
                Редагувати
              </button>
              <button onClick={() => handleDelete(r.id)} className="px-3 py-1.5 rounded-lg text-sm text-magenta border border-magenta/40">
                Видалити
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 bg-surface border border-border h-fit flex flex-col gap-3">
          <h3 className="font-semibold">{editingId ? "Редагувати локацію" : "Нова локація"}</h3>

          <input placeholder="Назва закладу" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          <input placeholder="Місто" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
          <input placeholder="Адреса" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
          <input placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          <input placeholder="Години роботи" value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} className={inputClass} />
          <input placeholder="Email для бронювань" value={form.bookingEmail} onChange={(e) => setForm({ ...form, bookingEmail: e.target.value })} className={inputClass} />

          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-magenta" />
            Активна
          </label>

          {error && <p className="text-sm text-magenta">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-full font-semibold bg-gradient-brand">
              {editingId ? "Зберегти" : "Додати"}
            </button>
            {editingId && (
              <button onClick={resetForm} className="px-4 py-2.5 rounded-full border border-border">
                Скасувати
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}