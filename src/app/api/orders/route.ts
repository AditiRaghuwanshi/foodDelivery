import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/store";
import { MENU } from "@/lib/data";
import type { Order, DeliveryDetails } from "@/lib/types";

function validate(body: Record<string, unknown>) {
  const errors: string[] = [];
  const d = body.delivery as DeliveryDetails | undefined;

  if (!d?.name?.trim()) errors.push("name is required");
  if (!d?.phone?.trim()) errors.push("phone is required");
  else if (d.phone.replace(/\D/g, "").length < 7)
    errors.push("phone must have at least 7 digits");
  if (!d?.address?.trim()) errors.push("address is required");

  const items = body.items as Record<string, number> | undefined;
  if (!items || Object.keys(items).length === 0)
    errors.push("cart is empty");
  else {
    for (const [id, qty] of Object.entries(items)) {
      const found = MENU.find((m) => m.id === id);
      if (!found) errors.push(`unknown item id: ${id}`);
      if (typeof qty !== "number" || qty < 1)
        errors.push(`invalid quantity for ${id}`);
    }
  }
  return errors;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length > 0)
    return NextResponse.json({ errors }, { status: 422 });

  const items = body.items as Record<string, number>;
  const delivery = body.delivery as DeliveryDetails;

  const subtotal = Object.entries(items).reduce((sum, [id, qty]) => {
    const item = MENU.find((m) => m.id === id)!;
    return sum + item.price * qty;
  }, 0);

  const deliveryFee = subtotal >= 35 ? 0 : 2.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

  const order: Order = {
    id: String(Math.floor(1000 + Math.random() * 9000)),
    items,
    delivery,
    subtotal,
    deliveryFee,
    tax,
    total,
    status: "received",
    placedAt: Date.now(),
  };

  createOrder(order);

  return NextResponse.json({ order }, { status: 201 });
}