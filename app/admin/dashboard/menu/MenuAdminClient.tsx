"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

type Category = { id: string; name: string };
type Restaurant = { id: string; city: string; address: string };
type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  photoUrl: string | null;
  isSpicy: boolean;
  isVegan: boolean;
  isAvailable: boolean;
  categoryId: string;
  category: Category;
  restaurants: Restaurant[];
};

const emptyForm = {
  id: "",
  name: "",
  description: "",
  priceCents: "",
  photoUrl: "",
  categoryId: "",
  isSpicy: false,
  isVegan: false,
  isAvailable: true,
  restaurantIds: [] as string[],
};

export default function MenuAdminClient({
  initialItems,
  categories,
  restaurants,
}: {
  initialItems: MenuItem[];
  categories: Category[];
  restaurants: Restaurant[];
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const inputClass = "rounded-lg px-3 py-2 text-sm bg-ink border border-border placeholder:text-muted w-full";

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const loadItemIntoForm = (item: MenuItem) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      priceCents: String(item.priceCents),
      photoUrl: item.photoUrl ?? "",
      categoryId: item.categoryId,
      isSpicy: item.isSpicy,
      isVegan: item.isVegan,
      isAvailable: item.isAvailable,
      restaurantIds: item.restaurants.map((r) => r.id),
    });
    setEditingId(item.id);
  };

  const toggleRestaurant = (id: string) => {
    setForm((prev) => ({
      ...prev,
      restaurantIds: prev.restaurantIds.includes(id)
        ? prev.restaurantIds.filter((r) => r !== id)
        : [...prev.restaurantIds, id],
    }));
  };

  const handleSubmit = async () => {
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      priceCents: Number(form.priceCents),
      photoUrl: form.photoUrl,
      categoryId: form.categoryId,
      isSpicy: form.isSpicy,
      isVegan: form.isVegan,
      isAvailable: form.isAvailable,
      restaurantIds: form.restaurantIds,
    };

    const url = editingId ? `/api/admin/menu-items/${editingId}` : "/api/admin/menu-items";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Не вдалося зберегти");
      return;
    }

    const saved = await res.json();
    const category = categories.find((c) => c.id === saved.categoryId)!;
    const restaurantObjs = restaurants.filter((r) => form.restaurantIds.includes(r.id));
    const savedFull: MenuItem = { ...saved, category, restaurants: restaurantObjs };

    setItems((prev) =>
      editingId ? prev.map((i) => (i.id === editingId ? savedFull : i)) : [savedFull, ...prev]
    );
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити страву?")) return;
    await fetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Меню</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl p-4 bg-surface border border-border">
              {item.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.photoUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.category.name} · {formatPrice(item.priceCents)} · {item.restaurants.length} локацій
                  {!item.isAvailable && " · вимкнено"}
                </p>
              </div>
              <button onClick={() => loadItemIntoForm(item)} className="px-3 py-1.5 rounded-lg text-sm border border-border">
                Редагувати
              </button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 rounded-lg text-sm text-magenta border border-magenta/40">
                Видалити
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 bg-surface border border-border h-fit flex flex-col gap-3">
          <h3 className="font-semibold">{editingId ? "Редагувати страву" : "Нова страва"}</h3>

          <input
            placeholder="Назва"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Опис"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} resize-none`}
            rows={2}
          />
          <input
            placeholder="Ціна в копійках (напр. 28900 = 289 ₴)"
            type="number"
            value={form.priceCents}
            onChange={(e) => setForm({ ...form, priceCents: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="URL фото"
            value={form.photoUrl}
            onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            className={inputClass}
          />

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputClass}
          >
            <option value="" disabled>Категорія</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink">{c.name}</option>
            ))}
          </select>

          <div className="flex gap-4 text-sm text-muted">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isSpicy} onChange={(e) => setForm({ ...form, isSpicy: e.target.checked })} className="accent-magenta" />
              Гостре
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isVegan} onChange={(e) => setForm({ ...form, isVegan: e.target.checked })} className="accent-magenta" />
              Vegan
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="accent-magenta" />
              Доступна
            </label>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Доступна в локаціях</p>
            <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
              {restaurants.map((r) => (
                <label key={r.id} className="flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={form.restaurantIds.includes(r.id)}
                    onChange={() => toggleRestaurant(r.id)}
                    className="accent-magenta"
                  />
                  {r.city}, {r.address}
                </label>
              ))}
            </div>
          </div>

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