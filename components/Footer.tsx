import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-5 md:px-8 pt-14 pb-8 border-t border-border">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        <div>
          <div className="font-display text-xl font-bold mb-3">Niko's</div>
          <p className="text-sm text-muted leading-relaxed">
            Pan-Asian кухня зі смаком нічного ринку.
            <br />
            Щодня з 10:00 до 22:00.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Магазин</h4>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <Link href="/menu">Меню</Link>
            <Link href="/cart">Кошик</Link>
            <Link href="/profile">Мої замовлення</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Інформація</h4>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <span>Про нас</span>
            <Link href="/contacts">Контакти</Link>
            <span>Акції</span>
            <span>FAQ</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Контакти</h4>
          <div className="flex flex-col gap-2 text-sm text-muted">
            <span>+380 (44) 555-55-55</span>
            <span>hello@nikos.ua</span>
            <span>м. Київ, вул. Хрещатик, 1</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted border-t border-border">
        <span>© 2026 Niko's. Усі права захищено.</span>
        <span>Зроблено в Україні</span>
      </div>
    </footer>
  );
}
