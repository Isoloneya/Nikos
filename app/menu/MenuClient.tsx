"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import DishCard from "@/components/DishCard";
import { Dish } from "@/types";

const SPICE_LEVELS = ["Не гостре", "Середньо гостре", "Дуже гостре"];

type MenuItemFromDb = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  photoUrl: string | null;
  isSpicy: boolean;
  isVegan: boolean;
  category: { name: string };
};

export default function MenuClient({
  items,
  categories,
  initialSearch,
  restaurantCity,
}: {
  items: MenuItemFromDb[];
  categories: string[];
  initialSearch: string;
  restaurantCity: string | null;
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [spiceFilters, setSpiceFilters] = useState<string[]>([]);
  const [veganOnly, setVeganOnly] = useState(false);

  const toggleSpice = (level: string) => {
    setSpiceFilters((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const matchesSpice = (item: MenuItemFromDb) => {
    if (spiceFilters.length === 0) return true;
    const wantsNotSpicy = spiceFilters.includes("Не гостре");
    const wantsSpicy = spiceFilters.includes("Середньо гостре") || spiceFilters.includes("Дуже гостре");
    if (item.isSpicy && wantsSpicy) return true;
    if (!item.isSpicy && wantsNotSpicy) return true;
    return false;
  };

  const searchTerm = search.trim().toLowerCase();

  const visibleDishes: Dish[] = items
    .filter((item) => (searchTerm ? true : item.category.name === activeCategory))
    .filter((item) =>
      searchTerm
        ? item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm)
        : true
    )
    .filter(matchesSpice)
    .filter((item) => (veganOnly ? item.isVegan : true))
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      priceCents: item.priceCents,
      photoUrl: item.photoUrl ?? "",
      isSpicy: item.isSpicy,
      isVegan: item.isVegan,
      category: item.category.name,
    }));

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Наше меню</h1>
        <button
          className="lg:hidden flex items-center gap-1 text-sm px-3 py-2 rounded-full border border-border text-muted"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          Фільтри <ChevronDown size={14} />
        </button>
      </div>

      {restaurantCity && <p className="text-sm text-muted mb-6">Меню для локації: {restaurantCity}</p>}

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-6 bg-surface border border-border max-w-md">
        <Search size={16} className="text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук страв..."
          className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
        />
      </div>

      {!searchTerm && (
        <div className="flex flex-wrap gap-2.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium ${
                cat === activeCategory ? "bg-gradient-brand" : "bg-surface border border-border text-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block rounded-2xl p-5 bg-surface border border-border h-fit`}>
          <div className="flex flex-col gap-7">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Гострота</h4>
              <div className="flex flex-col gap-2.5">
                {SPICE_LEVELS.map((s) => (
                  <label key={s} className="flex items-center gap-2.5 text-sm text-muted">
                    <input
                      type="checkbox"
                      checked={spiceFilters.includes(s)}
                      onChange={() => toggleSpice(s)}
                      className="accent-magenta"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Дієта</h4>
              <label className="flex items-center gap-2.5 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={veganOnly}
                  onChange={(e) => setVeganOnly(e.target.checked)}
                  className="accent-magenta"
                />
                Vegan
              </label>
            </div>
          </div>
        </aside>

        <div>
          {visibleDishes.length === 0 ? (
            <p className="text-sm text-muted">Нічого не знайдено за цим запитом чи фільтром.</p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {visibleDishes.map((d) => <DishCard key={d.id} dish={d} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}