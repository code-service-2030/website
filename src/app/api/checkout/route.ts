import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_placeholder_key", {
  apiVersion: "2025-01-27.acacia" as any
});

export async function POST(req: Request) {
  try {
    const { orderId, customerName, customerEmail, amount, services } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const origin = req.headers.get("origin");

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sar",
            product_data: {
              name: `Code Services Order #${orderId}`,
              description: services || "Consulting/Application Services"
            },
            unit_amount: Math.round(amount * 100) // Stripe expects amount in Cents/Halalas
          },
          quantity: 1
        }
      ],
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${origin}/payment/cancel?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        orderId,
        customerName
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
