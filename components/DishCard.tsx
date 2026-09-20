"use client";

import { Flame, Leaf, Plus } from "lucide-react";
import { Dish } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function DishCard({ dish }: { dish: Dish }) {
  const { addToCart } = useCart();

  return (
    <div className="rounded-2xl overflow-hidden bg-surface border border-border transition-shadow duration-300 hover:shadow-glow-magenta hover:border-magenta/50">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dish.photoUrl} alt={dish.name} className="w-full h-40 sm:h-44 object-cover" />
        {(dish.isSpicy || dish.isVegan) && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{
              background: "rgba(13,11,20,0.75)",
              color: dish.isSpicy ? "#FF3EA5" : "#7CDB8A",
            }}
          >
            {dish.isSpicy ? <Flame size={12} /> : <Leaf size={12} />}
            {dish.isSpicy ? "Гостре" : "Vegan"}
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-display font-bold mb-1.5 text-sm sm:text-base">{dish.name}</h3>
        <p className="text-sm text-muted mb-4 leading-relaxed">{dish.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg">{formatPrice(dish.priceCents)}</span>
          <button
            onClick={() => addToCart(dish)}
            aria-label={`Додати ${dish.name} в кошик`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-brand"
          >
            <Plus size={18} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
