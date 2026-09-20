"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Скільки часу займає доставка?",
    a: "В середньому 30–60 хвилин залежно від вашої локації та завантаженості кухні.",
  },
  {
    q: "Чи можна оплатити готівкою?",
    a: "Готівкою можна оплатити тільки при самовивозі. Доставка оплачується онлайн карткою.",
  },
  {
    q: "Як скасувати замовлення?",
    a: "Напишіть у підтримку протягом 5 хвилин після оформлення — поки кухня не почала готувати.",
  },
  {
    q: "Чи є вегетаріанські страви?",
    a: "Так, у кожній категорії меню є страви з позначкою Vegan.",
  },
  {
    q: "Як працює бронювання столика?",
    a: "Заповніть форму на сторінці бронювання — підтвердження прийде на вказаний email.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">FAQ</h1>
      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="rounded-2xl bg-surface border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between text-left px-5 py-4"
              >
                <span className="font-medium">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="px-5 pb-4 text-sm text-muted leading-relaxed">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}