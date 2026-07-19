import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/services/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any
});

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Fetch order details
      const orders = await db.orders.getOrders();
      const order = orders.find(o => o.id === orderId);

      if (order) {
        // Update order status in Supabase securely on backend
        await db.orders.updatePaymentStatus(orderId, "paid", {
          paymentMethod: session.payment_method_types?.[0] || "card",
          transactionId: session.id,
          paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
          paymentDate: new Date().toISOString(),
          gatewayName: "Stripe",
          amountPaid: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase() || "SAR"
        });
      }

      return NextResponse.json({ success: true, paymentStatus: "paid" });
    } else {
      return NextResponse.json({ success: false, paymentStatus: session.payment_status });
    }
  } catch (err: any) {
    console.error("Stripe verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
