"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm border border-border whitespace-nowrap">
      Вийти
    </button>
  );
}