import { MessageCircle, AtSign, Send } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ContactsPage() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    orderBy: { city: "asc" },
    take: 3,
  });

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Контакти</h1>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <div className="rounded-2xl p-6 bg-surface border border-border">
          <h3 className="font-semibold mb-3">Загальні питання</h3>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <span>+380 (44) 555-55-55</span>
            <span>hello@nikos.ua</span>
            <span>Щодня з 10:00 до 22:00</span>
          </div>
        </div>
        <div className="rounded-2xl p-6 bg-surface border border-border">
          <h3 className="font-semibold mb-3">Ми в соцмережах</h3>
          <div className="flex flex-col gap-3 text-sm text-muted">
            <a href="#" className="flex items-center gap-2">
              <AtSign size={16} /> instagram.com/nikos.ua
            </a>
            <a href="#" className="flex items-center gap-2">
              <Send size={16} /> t.me/nikos_ua
            </a>
            <a href="#" className="flex items-center gap-2">
              <MessageCircle size={16} /> Чат підтримки на сайті
            </a>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Наші найближчі локації</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {restaurants.map((r) => (
          <div key={r.id} className="rounded-2xl p-4 bg-surface border border-border">
            <p className="font-semibold mb-1">{r.city}</p>
            <p className="text-sm text-muted">{r.address}</p>
            <p className="text-sm text-muted">{r.phone}</p>
          </div>
        ))}
      </div>
    </section>
  );
}