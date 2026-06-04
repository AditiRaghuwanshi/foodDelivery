"use client";

import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { money } from "@/lib/data";

type Props = {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onSub: () => void;
};

export default function MenuCard({ item, qty, onAdd, onSub }: Props) {
  const bg = `linear-gradient(150deg, ${item.g[0]}, ${item.g[1]})`;

  return (
    <div className="bg-surface border border-line-soft rounded-xl overflow-hidden flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
<div className="h-36 relative overflow-hidden">
  <img
    src={item.image}
    alt={item.name}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  <span className="absolute left-3 top-3 bg-white/90 text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
    {item.kcal} kcal
  </span>
</div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="font-bold text-[16px] leading-tight">{item.name}</div>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] font-bold uppercase tracking-wide text-primary-700 bg-primary-tint px-2 py-0.5 rounded-md"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-ink-soft text-[13px] leading-relaxed flex-1">
          {item.desc}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-extrabold text-[17px]">{money(item.price)}</span>

          {qty > 0 ? (
            <div className="flex items-center gap-1 bg-primary rounded-full p-1 shadow-sm">
              <button
                onClick={onSub}
                className="w-7 h-7 rounded-full text-white grid place-items-center hover:bg-white/20 transition-colors"
                aria-label="Remove one"
              >
                <Minus size={14} />
              </button>
              <span className="text-white font-extrabold text-sm min-w-[20px] text-center">
                {qty}
              </span>
              <button
                onClick={onAdd}
                className="w-7 h-7 rounded-full text-white grid place-items-center hover:bg-white/20 transition-colors"
                aria-label="Add one"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 bg-primary-tint text-primary-700 hover:bg-primary hover:text-white font-bold text-sm px-4 py-2 rounded-full transition-all"
            >
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}