const PROMOTIONS = [
  {
    title: "2+1 на всі роли",
    desc: "Замов два роли — третій у подарунок. Діє щодня після 20:00.",
    tag: "Хіт",
  },
  {
    title: "−15% на перше замовлення",
    desc: "Промокод NIKOS15 при оформленні через сайт.",
    tag: "Новим клієнтам",
  },
  {
    title: "Комбо для двох",
    desc: "Рамен + роли + напої зі знижкою 20%.",
    tag: "Комбо",
  },
  {
    title: "Безкоштовна доставка",
    desc: "При замовленні від 500 ₴ доставка завжди безкоштовна.",
    tag: "Постійна",
  },
];

export default function PromotionsPage() {
  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Акції</h1>
      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {PROMOTIONS.map((promo) => (
          <div
            key={promo.title}
            className="rounded-2xl p-6 bg-surface border border-border flex flex-col gap-3"
          >
            <span className="inline-block w-fit px-3 py-1 rounded-full text-xs font-medium bg-gradient-brand">
              {promo.tag}
            </span>
            <h3 className="text-lg font-bold">{promo.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{promo.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}