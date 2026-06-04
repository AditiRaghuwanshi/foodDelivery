"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingBag, Bike } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MENU, money } from "@/lib/data";

type Props = {
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({ onClose, onCheckout }: Props) {
  const { cart, add, sub, count, subtotal, deliveryFee, tax, total } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-50 bg-surface flex flex-col shadow-lg transition-transform duration-300"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Head */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-line">
          <h3 className="font-display font-bold text-xl tracking-tight">
            Your cart
          </h3>
          <button
            onClick={onClose}
            className="ml-auto w-9 h-9 rounded-full border border-line grid place-items-center text-ink hover:bg-surface-2 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        {ids.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-ink-soft">
            <div className="w-16 h-16 rounded-full bg-primary-tint text-primary grid place-items-center mb-4">
              <ShoppingBag size={28} />
            </div>
            <h4 className="font-display font-bold text-lg text-ink mb-1">
              Your cart is empty
            </h4>
            <p className="text-sm">
              Add a bowl or a cold-press to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {ids.map((id) => {
                const item = MENU.find((m) => m.id === id)!;
                const bg = `linear-gradient(150deg, ${item.g[0]}, ${item.g[1]})`;
                return (
                  <div
                    key={id}
                    className="flex gap-3 py-4 border-b border-line-soft last:border-0"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex-shrink-0"
                      style={{ background: bg }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm leading-tight">
                        {item.name}
                      </div>
                      <div className="text-ink-soft text-xs font-semibold mt-0.5">
                        {money(item.price)} each
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-extrabold text-sm">
                        {money(item.price * cart[id])}
                      </span>
                      <div className="flex items-center gap-0.5 bg-surface-2 border border-line rounded-full p-0.5">
                        <button
                          onClick={() => sub(id)}
                          className="w-6 h-6 rounded-full grid place-items-center text-primary hover:bg-primary-tint transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-ink font-extrabold text-sm min-w-[18px] text-center">
                          {cart[id]}
                        </span>
                        <button
                          onClick={() => add(id)}
                          className="w-6 h-6 rounded-full grid place-items-center text-primary hover:bg-primary-tint transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="border-t border-line px-5 pt-4 pb-5 bg-surface">
              {subtotal < 35 && (
                <div className="flex items-center gap-2 text-primary bg-primary-tint text-xs font-semibold px-3 py-2 rounded-lg mb-3">
                  <Bike size={15} />
                  Add {money(35 - subtotal)} more for free delivery
                </div>
              )}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <span>Subtotal</span>
                  <strong className="text-ink">{money(subtotal)}</strong>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Delivery</span>
                  <strong className="text-ink">
                    {deliveryFee === 0 ? "Free" : money(deliveryFee)}
                  </strong>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <span>Taxes & fees</span>
                  <strong className="text-ink">{money(tax)}</strong>
                </div>
                <div className="flex justify-between text-ink font-extrabold text-lg pt-3 mt-2 border-t border-dashed border-line">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="w-full mt-4 bg-primary hover:bg-primary-700 text-white font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-px"
              >
                Go to checkout →
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}