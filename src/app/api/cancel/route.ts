import { NextResponse } from "next/server";
import { PaymentFactory } from "@/services/payment";
import { db } from "@/services/db";

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let failureReason = "Payment cancelled or declined by user";
    let stripeErrorCode = "payment_cancelled"; // keep variable for compatibility, representing gateway error code
    let lastSessionId = sessionId || "";

    if (sessionId && sessionId.startsWith("inv_")) {
      try {
        const gateway = PaymentFactory.getGateway("Moyasar");
        const result = await gateway.verifyPayment(sessionId);
        
        if (result.gatewayRaw) {
          // Extract error message or details from Moyasar raw invoice response
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

    // Fetch order details
    const orders = await db.orders.getOrders();
    const order = orders.find(o => o.id === orderId);

    if (order) {
      // Update order status in Supabase securely on backend
      await db.orders.updatePaymentStatus(orderId, "failed", {
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
      order
    });
  } catch (err: any) {
    console.error("Moyasar cancellation handling failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
