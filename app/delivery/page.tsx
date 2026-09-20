import { Truck, Clock, Wallet, MapPin } from "lucide-react";

const CITIES = ["Київ", "Львів", "Одеса", "Харків", "Дніпро", "Івано-Франківськ"];

export default function DeliveryPage() {
  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Доставка</h1>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <div className="rounded-2xl p-5 bg-surface border border-border flex gap-4">
          <Clock size={22} className="text-lantern flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">30–60 хвилин</h3>
            <p className="text-sm text-muted">Середній час доставки залежно від локації.</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-surface border border-border flex gap-4">
          <Wallet size={22} className="text-lantern flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Безкоштовно від 500 ₴</h3>
            <p className="text-sm text-muted">До цієї суми — фіксована вартість 60 ₴.</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-surface border border-border flex gap-4">
          <Truck size={22} className="text-lantern flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Тільки онлайн-оплата</h3>
            <p className="text-sm text-muted">Для доставки приймаємо оплату карткою на сайті.</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 bg-surface border border-border flex gap-4">
          <MapPin size={22} className="text-lantern flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">20 міст по Україні</h3>
            <p className="text-sm text-muted">Список локацій доступний при оформленні замовлення.</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Міста доставки</h2>
      <div className="flex flex-wrap gap-2.5">
        {CITIES.map((city) => (
          <span key={city} className="px-4 py-2 rounded-full text-sm bg-surface border border-border text-muted">
            {city}
          </span>
        ))}
      </div>
    </section>
  );
}