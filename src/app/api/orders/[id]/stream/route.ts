import { NextRequest } from "next/server";
import { getOrder } from "@/lib/store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Send current status immediately on connect
      const initial = getOrder(id);
      if (!initial) {
        controller.close();
        return;
      }
      send({ status: initial.status, updatedAt: Date.now() });

      const interval = setInterval(() => {
        const order = getOrder(id);
        if (!order) {
          clearInterval(interval);
          controller.close();
          return;
        }
        send({ status: order.status, updatedAt: Date.now() });
        if (order.status === "delivered") {
          clearInterval(interval);
          setTimeout(() => controller.close(), 500);
        }
      }, 2000);

      _req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}