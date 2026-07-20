import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/services/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_placeholder_key", {
  apiVersion: "2025-01-27.acacia" as any
});

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let failureReason = "Payment cancelled or declined by user";
    let stripeErrorCode = "payment_cancelled";
    let lastSessionId = sessionId || "";

    if (sessionId && sessionId.startsWith("cs_")) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["payment_intent"]
        });

        if (session.payment_intent && typeof session.payment_intent !== "string") {
          const pi = session.payment_intent as Stripe.PaymentIntent;
          if (pi.last_payment_error) {
            failureReason = pi.last_payment_error.message || failureReason;
            stripeErrorCode = pi.last_payment_error.code || stripeErrorCode;
          }
        }
      } catch (sessionErr) {
        console.error("Error retrieving Stripe session details:", sessionErr);
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
        gatewayName: "Stripe",
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
    console.error("Stripe verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
