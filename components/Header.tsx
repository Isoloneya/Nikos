"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, MapPin, ChevronDown, User as UserIcon, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const NAV_LINKS = [
  { label: "Акції", href: "/promotions" },
  { label: "Доставка", href: "/delivery" },
  { label: "Про нас", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

type HeaderUser = { name: string } | null;
type HeaderRestaurant = { city: string } | null;

export default function Header({ user, restaurant }: { user: HeaderUser; restaurant: HeaderRestaurant }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { cartCount, cartTotalCents } = useCart();
  const router = useRouter();

  const profileHref = user ? "/profile" : "/login";
  const profileLabel = user ? user.name : "Увійти";

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/menu?q=${encodeURIComponent(searchValue.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-ink border-b border-border">
      <div className="flex items-center gap-4 px-5 md:px-8 py-4">
        <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Меню">
          {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
        </button>

        <Link href="/" className="font-display text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap">
          Niko's
        </Link>

        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full flex-1 max-w-md bg-surface border border-border">
          <Search size={16} className="text-muted" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Пошук страв..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
          />
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="text-muted hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/locations"
          className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full text-sm cursor-pointer border border-border text-muted whitespace-nowrap"
        >
          <MapPin size={14} className="text-lantern" />
          {restaurant?.city ?? "Обрати місто"}
          <ChevronDown size={14} />
        </Link>

        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <Link
            href={profileHref}
            className="flex sm:hidden w-9 h-9 items-center justify-center rounded-full bg-gradient-brand flex-shrink-0"
            aria-label="Профіль"
          >
            <UserIcon size={16} color="#fff" />
          </Link>

          <Link
            href={profileHref}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-sm cursor-pointer border border-border"
          >
            <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center bg-gradient-brand">
              <UserIcon size={12} color="#fff" />
            </div>
            <span className="hidden lg:inline">{profileLabel}</span>
            <ChevronDown size={14} className="text-muted" />
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-brand"
          >
            <ShoppingBag size={16} />
            <span>{cartCount > 0 ? formatPrice(cartTotalCents) : "0 ₴"}</span>
          </Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden px-5 pb-5 flex flex-col gap-4 border-t border-border">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full mt-4 bg-surface border border-border">
            <Search size={16} className="text-muted" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Пошук страв..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
            />
          </div>
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-muted">{item.label}</Link>
          ))}
          <Link href="/locations" className="flex items-center gap-1 text-sm text-muted">
            <MapPin size={14} className="text-lantern" /> {restaurant?.city ?? "Обрати місто"}
          </Link>
        </div>
      )}
    </header>
  );
}