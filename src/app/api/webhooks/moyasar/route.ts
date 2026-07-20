import { NextResponse } from "next/server";
import { db } from "@/services/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("[Moyasar Webhook] Received webhook payload event:", payload.event);

    const event = payload.event;
    const paymentData = payload.data;

    if (event === "payment.paid" && paymentData) {
      const paymentId = paymentData.id;
      const orderId = paymentData.metadata?.orderId;
      const amount = paymentData.amount ? paymentData.amount / 100 : 0;
      const currency = paymentData.currency || "SAR";
      const paymentMethod = paymentData.source?.type || "Mada/Card";
      const paidAt = paymentData.paid_at || new Date().toISOString();

      if (orderId) {
        console.log(`[Moyasar Webhook] Processing successful payment ${paymentId} for order ${orderId}`);
        
        // Update order status in database to paid
        const success = await db.orders.updatePaymentStatus(orderId, "paid", {
          paymentMethod,
          transactionId: paymentId,
          paymentDate: paidAt,
          gatewayName: "Moyasar",
          amountPaid: amount,
          currency
        });

        if (success) {
          console.log(`[Moyasar Webhook] Order ${orderId} successfully marked as PAID`);
          return NextResponse.json({ success: true, message: "Order updated to paid" });
        } else {
          console.error(`[Moyasar Webhook] Failed to update order status for order ${orderId}`);
          return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 });
        }
      } else {
        console.warn("[Moyasar Webhook] Missing orderId in event metadata");
      }
    }

    // Acknowledge other events gracefully
    return NextResponse.json({ success: true, message: "Webhook acknowledged" });
  } catch (err: any) {
    console.error("[Moyasar Webhook] Error processing webhook:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
