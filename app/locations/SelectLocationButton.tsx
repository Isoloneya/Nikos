"use client";

import { useRouter } from "next/navigation";

export default function SelectLocationButton({ id, isSelected }: { id: string; isSelected: boolean }) {
  const router = useRouter();

  const handleClick = async () => {
    await fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId: id }),
    });
    router.push("/menu");
    router.refresh();
  };

  if (isSelected) {
    return (
      <span className="mt-2 inline-block px-4 py-2 rounded-full text-sm font-medium border border-magenta text-magenta">
        Поточна локація
      </span>
    );
  }

  return (
    <button onClick={handleClick} className="mt-2 px-4 py-2 rounded-full text-sm font-medium bg-gradient-brand">
      Обрати цю локацію
    </button>
  );
}