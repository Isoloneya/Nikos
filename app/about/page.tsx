const VALUES = [
  { title: "Свіжість", desc: "Продукти закуповуються щодня, нічого не заморожуємо про запас." },
  { title: "Швидкість", desc: "Кухня заточена під час приготування, а не під показ у меню." },
  { title: "Автентичність", desc: "Рецепти адаптовані від шеф-кухарів з Токіо, Сеула й Бангкоку." },
];

export default function AboutPage() {
  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Про нас</h1>
      <p className="text-muted leading-relaxed mb-4">
        Niko's почався у 2019 році з одного невеликого закладу в Києві, де готували
        рамен за рецептом, підглянутим у нічній кухні Осаки. Сьогодні мережа налічує
        20 закладів по всій Україні.
      </p>
      <p className="text-muted leading-relaxed mb-10">
        Ми не намагаємось бути "справжньою японською" чи "справжньою корейською"
        кухнею — Niko's про суміш смаків нічних ринків Азії, адаптовану під
        швидкість сучасного міста.
      </p>

      <div className="grid sm:grid-cols-3 gap-5">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl p-5 bg-surface border border-border">
            <h3 className="font-bold mb-2">{v.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}