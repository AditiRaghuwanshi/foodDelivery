"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingBag, MapPin, Leaf } from "lucide-react";

type Props = {
  onCartOpen: () => void;
};

export default function Header({ onCartOpen }: Props) {
  const { count, total } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-line shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-[70px] flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 font-display font-bold text-xl text-primary">
          <span className="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center shadow-sm">
            <Leaf size={18} />
          </span>
          Sprig
        </div>

        {/* Location */}
        <div className="hidden sm:flex items-center gap-1.5 text-ink-soft text-sm font-medium">
          <MapPin size={15} />
          <span>
            Deliver to <strong className="text-ink">Home · 21 Elm St</strong>
          </span>
        </div>

        {/* Cart button */}
        <button
          onClick={onCartOpen}
          className="ml-auto flex items-center gap-2.5 bg-primary hover:bg-primary-700 text-white px-4 py-2.5 rounded-full font-semibold text-sm shadow-sm transition-all hover:-translate-y-px"
        >
          <ShoppingBag size={17} />
          <span className="hidden sm:inline">
            {count > 0 ? `$${total.toFixed(2)}` : "Cart"}
          </span>
          {count > 0 && (
            <span className="bg-accent text-primary-700 text-xs font-extrabold min-w-[22px] h-[22px] rounded-full grid place-items-center px-1.5">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}