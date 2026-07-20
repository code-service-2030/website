import { NextResponse } from "next/server";
import { PaymentFactory } from "@/services/payment";
import { db } from "@/services/db";

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    let failureReason = "Payment cancelled or declined by user";
    let stripeErrorCode = "payment_cancelled"; // keep variable for compatibility
    let lastSessionId = sessionId || "";
    let finalOrderId = orderId;

    if (sessionId && sessionId.startsWith("inv_")) {
      try {
        const gateway = PaymentFactory.getGateway("Moyasar");
        const result = await gateway.verifyPayment(sessionId);
        
        if (!finalOrderId && result.gatewayRaw?.metadata?.orderId) {
          finalOrderId = result.gatewayRaw.metadata.orderId;
        }

        if (result.gatewayRaw) {
          const raw = result.gatewayRaw;
          if (raw.payments && raw.payments.length > 0) {
            const lastPayment = raw.payments[0];
            if (lastPayment.status === "failed") {
              failureReason = lastPayment.source?.message || lastPayment.description || failureReason;
              stripeErrorCode = lastPayment.source?.error_code || stripeErrorCode;
            }
          }
        }
      } catch (sessionErr) {
        console.error("Error retrieving Moyasar invoice details:", sessionErr);
      }
    }

    if (!finalOrderId) {
      return NextResponse.json({ error: "Order ID not found" }, { status: 400 });
    }

    // Fetch order details
    const orders = await db.orders.getOrders();
    const order = orders.find(o => o.id === finalOrderId);

    if (order) {
      // Update order status in Supabase securely on backend
      await db.orders.updatePaymentStatus(finalOrderId, "failed", {
        transactionId: lastSessionId,
        paymentDate: new Date().toISOString(),
        gatewayName: "Moyasar",
        failureReason,
        failureTime: new Date().toISOString(),
        stripeErrorCode
      });
    }

    return NextResponse.json({ 
      success: true, 
      paymentStatus: "failed",
      failureReason,
      stripeErrorCode,
      orderId: finalOrderId,
      order
    });
  } catch (err: any) {
    console.error("Moyasar cancellation handling failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
