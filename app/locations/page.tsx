import { MapPin, Phone, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSelectedRestaurant } from "@/lib/get-selected-restaurant";
import SelectLocationButton from "./SelectLocationButton";

export default async function LocationsPage() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    orderBy: { city: "asc" },
  });

  const selected = await getSelectedRestaurant();

  return (
    <section className="px-5 md:px-8 py-8 md:py-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Наші локації</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {restaurants.map((r) => (
          <div key={r.id} className="rounded-2xl p-5 bg-surface border border-border flex flex-col gap-3">
            <h3 className="text-lg font-bold">{r.city}</h3>
            <div className="flex items-start gap-2 text-sm text-muted">
              <MapPin size={15} className="text-lantern flex-shrink-0 mt-0.5" />
              {r.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Phone size={15} className="flex-shrink-0" />
              {r.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Clock size={15} className="flex-shrink-0" />
              {r.workingHours}
            </div>
            <SelectLocationButton id={r.id} isSelected={selected?.id === r.id} />
          </div>
        ))}
      </div>
    </section>
  );
}