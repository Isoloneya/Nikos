"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { cart, changeQty, removeItem, cartCount, cartTotalCents } = useCart();

  if (cart.length === 0) {
    return (
      <section className="px-5 md:px-8 py-16 max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Ваш кошик порожній</h1>
        <p className="mb-6 text-sm text-muted">Додайте страви з меню, щоб оформити замовлення.</p>
        <Link href="/menu" className="inline-block px-6 py-3 rounded-full font-medium bg-gradient-brand">
          Перейти в меню
        </Link>
      </section>
    );
  }

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Ваш кошик ({cart.length})</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl p-4 bg-surface border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.photoUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">{item.name}</h3>
                <p className="text-sm text-muted">{formatPrice(item.priceCents)}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full px-2 py-1 border border-border">
                <button onClick={() => changeQty(item.id, -1)} aria-label="Зменшити кількість"><Minus size={14} /></button>
                <span className="text-sm w-4 text-center">{item.qty}</span>
                <button onClick={() => changeQty(item.id, 1)} aria-label="Збільшити кількість"><Plus size={14} /></button>
              </div>
              <span className="font-semibold hidden sm:block w-16 text-right">{formatPrice(item.priceCents * item.qty)}</span>
              <button onClick={() => removeItem(item.id)} aria-label="Видалити з кошика">
                <Trash2 size={16} className="text-muted" />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 h-fit bg-surface border border-border">
          <h3 className="font-semibold mb-4">Сума замовлення</h3>
          <div className="flex justify-between text-sm mb-2 text-muted">
            <span>Товарів</span><span>{cartCount}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-muted">
            <span>Доставка</span><span>безкоштовно</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t border-border">
            <span>Разом</span><span>{formatPrice(cartTotalCents)}</span>
          </div>
          <Link href="/checkout" className="block text-center w-full py-3 rounded-full font-semibold mb-3 bg-gradient-brand">
            Оформити замовлення
          </Link>
          <Link href="/menu" className="block text-center w-full py-3 rounded-full font-medium border border-border">
            Продовжити покупки
          </Link>
        </div>
      </div>
    </section>
  );
}
