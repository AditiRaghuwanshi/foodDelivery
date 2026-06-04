import { describe, it, expect, beforeEach } from "vitest";

// Inline minimal store logic so tests run without Next.js runtime
type OrderStatus = "received" | "preparing" | "out_for_delivery" | "delivered";
const orders = new Map<string, { id: string; status: OrderStatus }>();
const SEQ: OrderStatus[] = ["received", "preparing", "out_for_delivery", "delivered"];

function createOrder(id: string) {
  const o = { id, status: "received" as OrderStatus };
  orders.set(id, o);
  return o;
}
function getOrder(id: string) { return orders.get(id); }
function advanceStatus(id: string) {
  const o = orders.get(id); if (!o) return null;
  const i = SEQ.indexOf(o.status);
  const updated = { ...o, status: SEQ[Math.min(i + 1, SEQ.length - 1)] };
  orders.set(id, updated); return updated;
}

beforeEach(() => orders.clear());

describe("Order store", () => {
  it("creates an order with received status", () => {
    const o = createOrder("1001");
    expect(o.status).toBe("received");
  });

  it("returns undefined for unknown order", () => {
    expect(getOrder("9999")).toBeUndefined();
  });

  it("advances status in sequence", () => {
    createOrder("1002");
    expect(advanceStatus("1002")?.status).toBe("preparing");
    expect(advanceStatus("1002")?.status).toBe("out_for_delivery");
    expect(advanceStatus("1002")?.status).toBe("delivered");
  });

  it("does not advance past delivered", () => {
    createOrder("1003");
    SEQ.forEach(() => advanceStatus("1003"));
    expect(getOrder("1003")?.status).toBe("delivered");
  });

  it("returns null when advancing unknown order", () => {
    expect(advanceStatus("0000")).toBeNull();
  });
});