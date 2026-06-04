import type { Order, OrderStatus } from "./types";

// Use a global to survive Next.js dev hot-reloads and cross-worker access
const globalStore = global as typeof global & {
  __orders: Map<string, Order>;
};

if (!globalStore.__orders) {
  globalStore.__orders = new Map<string, Order>();
}

const orders = globalStore.__orders;

const STATUS_SEQUENCE: OrderStatus[] = [
  "received",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export function createOrder(order: Order): Order {
  orders.set(order.id, order);
  scheduleStatusAdvancement(order.id);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}

export function getAllOrders(): Order[] {
  return Array.from(orders.values());
}

export function advanceStatus(id: string): Order | null {
  const order = orders.get(id);
  if (!order) return null;
  const idx = STATUS_SEQUENCE.indexOf(order.status);
  if (idx === STATUS_SEQUENCE.length - 1) return order;
  const updated = { ...order, status: STATUS_SEQUENCE[idx + 1] };
  orders.set(id, updated);
  return updated;
}

function scheduleStatusAdvancement(id: string) {
  const delays = [6000, 16000, 28000];
  delays.forEach((delay) => {
    setTimeout(() => {
      advanceStatus(id);
    }, delay);
  });
}