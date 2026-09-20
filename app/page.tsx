import Link from "next/link";
import DishCard from "@/components/DishCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const dbItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    take: 3,
    orderBy: { createdAt: "asc" },
    include: { category: true },
  });

  const dishes = dbItems.map((item) => ({
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
    <>
      <section className="grid md:grid-cols-2 gap-10 px-5 md:px-8 py-10 md:py-16 items-center max-w-6xl mx-auto">
        <div>
          <p className="text-sm mb-4 text-lantern">Pan-Asian кухня · 2 закладу по країні</p>
          <h1 className="font-black leading-[1.08] mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>
            Смак нічного ринку, прямо до дверей
          </h1>
          <p className="mb-8 max-w-md text-base sm:text-lg text-muted leading-relaxed">
            Роли, рамен і дамплінги від Niko's — готуємо як на вуличних кухнях Токіо, Сеула й Бангкоку.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href="/menu" className="px-7 py-3.5 rounded-full font-semibold text-center bg-gradient-brand">
              Переглянути меню
            </Link>
            <Link href="/booking" className="px-6 py-3.5 rounded-full font-medium text-center border border-border">
              Забронювати столик
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div
            className="absolute rounded-full w-[300px] h-[300px] blur-[10px]"
            style={{ background: "radial-gradient(circle, rgba(245,194,77,0.2), transparent 70%)" }}
          />
          <div
            className="absolute rounded-full w-[230px] h-[230px]"
            style={{ background: "radial-gradient(circle, rgba(255,62,165,0.27), transparent 70%)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=700&q=80"
            alt="Тонкоцу рамен"
            className="relative rounded-3xl object-cover w-full max-w-[300px] sm:max-w-[340px] aspect-square border border-border"
          />
        </div>
      </section>

      <section className="px-5 md:px-8 pb-16 md:pb-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Популярне зараз</h2>
          <Link href="/menu" className="text-sm text-magenta">Усе меню</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {dishes.map((d) => <DishCard key={d.id} dish={d} />)}
        </div>
      </section>
    </>
  );
}