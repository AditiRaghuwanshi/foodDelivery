"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MenuGrid from "@/components/MenuGrid";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface-2">
      <Header onCartOpen={() => setCartOpen(true)} />
      <main>
        <MenuGrid />
      </main>
      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            router.push("/checkout");
          }}
        />
      )}
    </div>
  );
}