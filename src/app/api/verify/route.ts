import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/services/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_placeholder_key", {
  apiVersion: "2025-01-27.acacia" as any
});

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`[Stripe Verification] Verifying session: ${sessionId}`);

    // Retrieve Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const resolvedOrderId = orderId || session.metadata?.orderId;

    if (!resolvedOrderId) {
      console.error(`[Stripe Verification] Order ID not resolved for session: ${sessionId}`);
      return NextResponse.json({ error: "Order ID not resolved" }, { status: 400 });
    }

    if (session.payment_status === "paid") {
      // Fetch order details
      const orders = await db.orders.getOrders();
      const order = orders.find(o => o.id === resolvedOrderId);

      if (order) {
        // Update order status in Supabase securely on backend
        await db.orders.updatePaymentStatus(resolvedOrderId, "paid", {
          paymentMethod: session.payment_method_types?.[0] || "card",
          transactionId: session.id,
          paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
          paymentDate: new Date().toISOString(),
          gatewayName: "Stripe",
          amountPaid: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase() || "SAR"
        });
      }

      return NextResponse.json({ success: true, paymentStatus: "paid", orderId: resolvedOrderId });
    } else {
      return NextResponse.json({ success: false, paymentStatus: session.payment_status, orderId: resolvedOrderId });
    }
  } catch (err: any) {
    console.error("Stripe verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
