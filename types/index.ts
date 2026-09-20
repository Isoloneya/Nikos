export type Restaurant = {
  id: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
};

export type OrderStatus = "NEW" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED";

export type OrderItemSummary = {
  name: string;
  qty: number;
  priceCents: number;
};

export type OrderSummary = {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItemSummary[];
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  photoUrl: string;
  isSpicy?: boolean;
  isVegan?: boolean;
  category: string;
};

export type CartItem = Dish & {
  qty: number;
};
