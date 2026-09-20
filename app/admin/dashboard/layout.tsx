import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/get-current-admin";
import AdminLogoutButton from "./AdminLogoutButton";

const NAV = [
  { label: "Меню", href: "/admin/dashboard/menu" },
  { label: "Локації", href: "/admin/dashboard/restaurants" },
  { label: "Бронювання", href: "/admin/dashboard/bookings" },
  { label: "Замовлення", href: "/admin/dashboard/orders" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-border p-5 flex md:flex-col gap-2 overflow-x-auto">
        <div className="font-display text-lg font-bold mb-0 md:mb-4 whitespace-nowrap">Niko's Admin</div>
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="px-3 py-2 rounded-lg text-sm text-muted hover:bg-surface whitespace-nowrap">
            {item.label}
          </Link>
        ))}
        <div className="md:mt-auto">
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}