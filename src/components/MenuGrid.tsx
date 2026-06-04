"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { MENU, CATEGORIES } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import MenuCard from "./MenuCard";

export default function MenuGrid() {
  const { cart, add, sub } = useCart();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = (m: (typeof MENU)[0]) =>
    !q ||
    m.name.toLowerCase().includes(q) ||
    m.desc.toLowerCase().includes(q) ||
    m.tags.some((t) => t.toLowerCase().includes(q));

  const sections = CATEGORIES.map((c) => ({
    ...c,
    items: MENU.filter((m) => m.cat === c.id && matches(m)),
  })).filter((c) => c.items.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-24 pt-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-4xl text-ink leading-tight tracking-tight mb-2">
          Fresh food,{" "}
          <em className="not-italic text-primary">delivered green.</em>
        </h1>
        <p className="text-ink-soft text-[15px] max-w-xl leading-relaxed">
          Cold-press juices, grain bowls and garden salads made to order — at
          your door in about 30 minutes.
        </p>
        <div className="flex flex-wrap gap-2.5 mt-4">
          {["25–35 min", "4.9 · 2.1k ratings", "100% plant-forward"].map(
            (chip) => (
              <span
                key={chip}
                className="text-[13px] font-semibold text-ink bg-surface border border-line px-3 py-1.5 rounded-full shadow-sm"
              >
                {chip}
              </span>
            )
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 bg-surface border-[1.5px] border-line rounded-full px-4 shadow-sm focus-within:border-primary focus-within:shadow-[0_0_0_4px_#EAF2EC] transition-all">
        <Search size={18} className="text-ink-faint flex-shrink-0" />
        <input
          type="text"
          placeholder="Search bowls, salads, juices…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-0 border-none bg-transparent outline-none py-3 text-[15px] text-ink placeholder:text-ink-faint"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="w-6 h-6 rounded-full grid place-items-center text-ink-soft hover:text-ink hover:bg-line-soft transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="text-center py-20 text-ink-soft">
          <div className="w-16 h-16 rounded-full bg-primary-tint text-primary grid place-items-center mx-auto mb-4">
            <Search size={28} />
          </div>
          <h3 className="font-display font-bold text-xl text-ink mb-1">
            No matches for &ldquo;{query}&rdquo;
          </h3>
          <p>Try another dish, ingredient, or tag like &ldquo;vegan&rdquo;.</p>
        </div>
      ) : (
        sections.map((section) => (
          <section key={section.id} className="mb-10">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="font-display font-bold text-2xl text-ink tracking-tight">
                {section.label}
              </h2>
              <span className="text-ink-faint text-sm font-semibold">
                {section.items.length} item
                {section.items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={cart[item.id] || 0}
                  onAdd={() => add(item.id)}
                  onSub={() => sub(item.id)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}