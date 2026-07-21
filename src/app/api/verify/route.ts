import { NextResponse } from "next/server";
import { PaymentFactory } from "@/services/payment";
import { db } from "@/services/db";

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify invoice payment status via Moyasar
    console.log(`[Moyasar Verification] Verifying payment for sessionId/paymentId: ${sessionId}`);
    console.log(`[Moyasar Verification] Secret Key Configured: ${process.env.MOYASAR_SECRET_KEY ? `YES (Length: ${process.env.MOYASAR_SECRET_KEY.length})` : "NO"}`);

    const gateway = PaymentFactory.getGateway("Moyasar");
    const result = await gateway.verifyPayment(sessionId);

    console.log(`[Moyasar Verification] Verification result success: ${result.success}, status: ${result.status}`);
    console.log(`[Moyasar Verification] Raw Moyasar Response metadata:`, JSON.stringify(result.gatewayRaw?.metadata || {}));

    // Get orderId from Moyasar invoice metadata if not provided by client
    const finalOrderId = orderId || result.gatewayRaw?.metadata?.orderId;
    console.log(`[Moyasar Verification] Resolved finalOrderId: ${finalOrderId}`);

    if (!finalOrderId) {
      console.error(`[Moyasar Verification] Failed to resolve finalOrderId for sessionId: ${sessionId}`);
      return NextResponse.json({ error: "Order ID not found in query or invoice metadata" }, { status: 400 });
    }

    if (result.success && result.status === "paid") {
      // Fetch order details
      const orders = await db.orders.getOrders();
      const order = orders.find(o => o.id === finalOrderId);

      if (order) {
        // Update order status in Supabase securely on backend
        await db.orders.updatePaymentStatus(finalOrderId, "paid", {
          paymentMethod: result.paymentMethod || "Mada/Card",
          transactionId: result.transactionId,
          paymentDate: result.paymentDate,
          gatewayName: "Moyasar",
          amountPaid: result.amountPaid,
          currency: result.currency || "SAR"
        });
      }

      return NextResponse.json({ success: true, paymentStatus: "paid", orderId: finalOrderId });
    } else {
      return NextResponse.json({ success: false, paymentStatus: result.status, orderId: finalOrderId });
    }
  } catch (err: any) {
    console.error("Moyasar verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
