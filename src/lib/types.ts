export type Category = {
  id: string;
  label: string;
};

export type MenuItem = {
  id: string;
  cat: string;
  name: string;
  price: number;
  desc: string;
  tags: string[];
  g: [string, string];
  kcal: number;
  image: string;
};

export type CartItem = {
  itemId: string;
  qty: number;
};

export type DeliveryDetails = {
  name: string;
  phone: string;
  address: string;
  city?: string;
  zip?: string;
  notes?: string;
};

export type OrderStatus =
  | "received"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export type Order = {
  id: string;
  items: Record<string, number>;
  delivery: DeliveryDetails;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  placedAt: number;
};