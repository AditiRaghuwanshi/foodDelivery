"use client";

import { Check, Receipt, ChefHat, Bike, Home } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

const STAGES: {
  key: OrderStatus;
  label: string;
  sub: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "received",
    label: "Order received",
    sub: "We've received your order",
    icon: <Receipt size={20} />,
  },
  {
    key: "preparing",
    label: "Preparing your food",
    sub: "Our kitchen is cooking it fresh",
    icon: <ChefHat size={20} />,
  },
  {
    key: "out_for_delivery",
    label: "Out for delivery",
    sub: "Your rider is on the way",
    icon: <Bike size={20} />,
  },
  {
    key: "delivered",
    label: "Delivered",
    sub: "Enjoy your meal!",
    icon: <Home size={20} />,
  },
];

const ORDER: OrderStatus[] = [
  "received",
  "preparing",
  "out_for_delivery",
  "delivered",
];

type Props = { status: OrderStatus };

export default function StatusStepper({ status }: Props) {
  const current = ORDER.indexOf(status);

  return (
    <div className="bg-surface border border-line-soft rounded-xl px-6 py-2 shadow-sm">
      {STAGES.map((stage, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={stage.key} className="flex gap-4 py-4 relative">
            {/* Connector line */}
            {i < STAGES.length - 1 && (
              <div
                className={`absolute left-[21px] top-[52px] w-[2.5px] h-[calc(100%-28px)] rounded-full transition-colors duration-500 ${
                  done || active ? "bg-accent" : "bg-line"
                }`}
              />
            )}

            {/* Dot */}
            <div
              className={`w-11 h-11 rounded-full flex-shrink-0 grid place-items-center border-2 transition-all duration-300 ${
                done
                  ? "bg-primary border-primary text-white"
                  : active
                  ? "bg-accent border-accent text-primary-700 shadow-[0_0_0_6px_rgba(168,213,186,0.3)]"
                  : "bg-surface-2 border-line text-ink-faint"
              }`}
            >
              {done ? <Check size={20} /> : stage.icon}
            </div>

            {/* Text */}
            <div className="pt-1">
              <div
                className={`font-bold text-base transition-colors duration-300 ${
                  done || active ? "text-ink" : "text-ink-faint"
                }`}
              >
                {stage.label}
              </div>
              <div className="text-ink-soft text-[13px] mt-0.5">
                {stage.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}