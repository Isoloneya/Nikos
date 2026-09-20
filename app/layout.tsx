import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/get-current-user";
import { getSelectedRestaurant } from "@/lib/get-selected-restaurant";

export const metadata: Metadata = {
  title: "Niko's — Pan-Asian кухня",
  description: "Роли, рамен і дамплінги. Доставка по всій Україні.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const restaurant = await getSelectedRestaurant();

  return (
    <html lang="uk">
      <body>
        <CartProvider>
          <Header user={user ? { name: user.name } : null} restaurant={restaurant ? { city: restaurant.city } : null} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}