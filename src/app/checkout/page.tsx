"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, User, Phone, MapPin, Home,
  Hash, StickyNote, Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MENU, money } from "@/lib/data";
import type { DeliveryDetails } from "@/lib/types";

type FieldConfig = {
  k: keyof DeliveryDetails;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  area?: boolean;
  form: Partial<DeliveryDetails>;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  onChange: (k: keyof DeliveryDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (k: string) => () => void;
};

function Field({ k, label, icon, placeholder, type = "text", area, form, touched, errors, onChange, onBlur }: FieldConfig) {
  const hasError = touched[k] && errors[k];
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-ink mb-1.5">{label}</label>
      <div
        className={`flex items-center gap-2.5 bg-surface-2 border-[1.5px] rounded-xl px-3.5 transition-all ${
          hasError
            ? "border-berry shadow-[0_0_0_4px_rgba(192,57,90,0.1)]"
            : "border-line focus-within:border-primary focus-within:shadow-[0_0_0_4px_#EAF2EC]"
        }`}
      >
        <span className="text-ink-faint flex-shrink-0">{icon}</span>
        {area ? (
          <textarea
            rows={2}
            placeholder={placeholder}
            value={form[k] || ""}
            onChange={onChange(k)}
            onBlur={onBlur(k)}
            className="flex-1 border-none bg-transparent outline-none py-3 text-[15px] text-ink resize-none"
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={form[k] || ""}
            onChange={onChange(k)}
            onBlur={onBlur(k)}
            className="flex-1 border-none bg-transparent outline-none py-3 text-[15px] text-ink"
          />
        )}
      </div>
      {hasError && (
        <p className="text-berry text-xs font-semibold mt-1.5">{errors[k]}</p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, deliveryFee, tax, total, clear } = useCart();

  const [form, setForm] = useState<Partial<DeliveryDetails>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  const errors: Record<string, string> = {
    name: !form.name?.trim() ? "Enter your name" : "",
    phone: !form.phone?.trim()
      ? "Enter a phone number"
      : form.phone.replace(/\D/g, "").length < 7
      ? "Enter a valid number"
      : "",
    address: !form.address?.trim() ? "Enter your street address" : "",
  };

  const valid = !errors.name && !errors.phone && !errors.address;

  const handleChange = (k: keyof DeliveryDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleBlur = (k: string) => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const submit = async () => {
    setTouched({ name: true, phone: true, address: true });
    if (!valid) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, delivery: form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.errors?.join(", ") || "Something went wrong.");
        return;
      }
      clear();
      router.push(`/orders/${data.order.id}`);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = { form, touched, errors, onChange: handleChange, onBlur: handleBlur };

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-line-soft">
        <div className="max-w-5xl mx-auto px-6 h-[70px] flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full border border-line grid place-items-center text-ink hover:bg-surface-2 transition-colors"
          >
            <ArrowLeft size={17} />
          </button>
          <h2 className="font-display font-bold text-xl tracking-tight">Checkout</h2>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-7 items-start">
        <div className="bg-surface border border-line-soft rounded-xl p-6 shadow-sm">
          <h3 className="font-display font-bold text-xl tracking-tight mb-1">Delivery details</h3>
          <p className="text-ink-soft text-sm mb-6">Where should we bring your order?</p>

          <Field k="name" label="Full name" icon={<User size={17} />} placeholder="Alex Green" {...fieldProps} />
          <Field k="phone" label="Phone number" icon={<Phone size={17} />} placeholder="(555) 123-4567" type="tel" {...fieldProps} />
          <Field k="address" label="Street address" icon={<MapPin size={17} />} placeholder="21 Elm Street, Apt 4B" area {...fieldProps} />

          <div className="grid grid-cols-2 gap-4">
            <Field k="city" label="City (optional)" icon={<Home size={17} />} placeholder="Portland" {...fieldProps} />
            <Field k="zip" label="ZIP (optional)" icon={<Hash size={17} />} placeholder="97201" {...fieldProps} />
          </div>

          <Field k="notes" label="Delivery notes (optional)" icon={<StickyNote size={17} />} placeholder="Leave at the door, buzz 4B" area {...fieldProps} />

          {serverError && (
            <p className="text-berry text-sm font-semibold mb-3">{serverError}</p>
          )}
        </div>

        <div className="bg-surface border border-line-soft rounded-xl p-6 shadow-sm lg:sticky lg:top-[90px]">
          <h3 className="font-display font-bold text-xl tracking-tight mb-1">Order summary</h3>
          <p className="text-ink-soft text-sm mb-4">
            {ids.reduce((n, id) => n + cart[id], 0)} items
          </p>

          <div className="max-h-56 overflow-y-auto mb-4 space-y-2">
            {ids.map((id) => {
              const item = MENU.find((m) => m.id === id)!;
              return (
                <div key={id} className="flex justify-between text-sm text-ink-soft">
                  <span>
                    <span className="text-primary font-extrabold">{cart[id]}×</span>{" "}
                    {item.name}
                  </span>
                  <strong className="text-ink">{money(item.price * cart[id])}</strong>
                </div>
              );
            })}
          </div>

          <div className="space-y-1.5 text-sm border-t border-line pt-3">
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
            <div className="flex justify-between text-ink font-extrabold text-lg pt-3 mt-1 border-t border-dashed border-line">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-5 bg-primary hover:bg-primary-700 disabled:bg-line disabled:text-ink-faint disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-px"
          >
            {loading ? "Placing order…" : (
              <><Check size={18} /> Place order · {money(total)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}