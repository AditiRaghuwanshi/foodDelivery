"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Receipt, Leaf } from "lucide-react";
import StatusStepper from "@/components/StatusStepper";
import { money } from "@/lib/data";
import type { Order, OrderStatus } from "@/lib/types";

export default function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("received");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let attempts = 0;

    const fetchOrder = () => {
      fetch(`/api/orders/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.order) {
            setOrder(d.order);
            setStatus(d.order.status);
          } else if (attempts < 3) {
            attempts++;
            setTimeout(fetchOrder, 500);
          } else {
            setError("Order not found.");
          }
        })
        .catch(() => {
          if (attempts < 3) {
            attempts++;
            setTimeout(fetchOrder, 500);
          } else {
            setError("Failed to load order.");
          }
        });
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const es = new EventSource(`/api/orders/${id}/stream`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [id]);

  const STATUS_LABELS: Record<OrderStatus, string> = {
    received: "Order received",
    preparing: "Preparing your food",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered!",
  };

  const ETA_LABELS: Record<OrderStatus, string> = {
    received: "Arriving in ~28 min",
    preparing: "Arriving in ~22 min",
    out_for_delivery: "Arriving in ~10 min",
    delivered: "Delivered",
  };

  if (error) {
    return (
      <div className="min-h-screen bg-surface-2 flex flex-col items-center justify-center gap-4 text-ink-soft">
        <p>{error}</p>
        <button
          onClick={() => router.push("/")}
          className="text-primary font-semibold underline"
        >
          Back to menu
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface-2 flex items-center justify-center text-ink-soft">
        Loading order…
      </div>
    );
  }

  const itemCount = Object.values(order.items).reduce((n, q) => n + q, 0);

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-line-soft">
        <div className="max-w-2xl mx-auto px-6 h-[70px] flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-9 h-9 rounded-full border border-line grid place-items-center text-ink hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={17} />
          </button>
          <h2 className="font-display font-bold text-xl tracking-tight">
            Track order
          </h2>
          <span className="ml-auto text-ink-faint font-bold text-sm">
            #{order.id}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-9 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 bg-primary text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-md mb-5">
            {status === "delivered" ? (
              "✓ Delivered"
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {ETA_LABELS[status]}
              </>
            )}
          </div>
          <h1 className="font-display font-bold text-4xl text-ink tracking-tight mb-2">
            {STATUS_LABELS[status]}
          </h1>
          <p className="text-ink-soft text-[15px]">
            {status === "delivered"
              ? "Hope you enjoy your meal!"
              : "We'll keep you updated as your order progresses."}
          </p>
        </div>

        <StatusStepper status={status} />

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-surface border border-line-soft rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-ink-faint text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin size={13} /> Delivering to
            </div>
            <div className="font-bold text-sm leading-snug text-ink">
              {order.delivery.name}
              <br />
              {order.delivery.address}
              {order.delivery.city ? `, ${order.delivery.city}` : ""}
            </div>
          </div>
          <div className="bg-surface border border-line-soft rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-ink-faint text-xs font-bold uppercase tracking-wider mb-2">
              <Receipt size={13} /> Order · {itemCount} items
            </div>
            <div className="font-bold text-sm leading-snug text-ink">
              {money(order.total)} · paid
              <br />
              <span className="text-ink-soft font-semibold text-xs">
                Placed{" "}
                {new Date(order.placedAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {status === "delivered" && (
          <button
            onClick={() => router.push("/")}
            className="w-full mt-6 border-[1.5px] border-line hover:border-primary hover:text-primary text-ink font-bold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Leaf size={16} /> Start a new order
          </button>
        )}
      </div>
    </div>
  );
}