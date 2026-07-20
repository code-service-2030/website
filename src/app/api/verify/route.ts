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
    const gateway = PaymentFactory.getGateway("Moyasar");
    const result = await gateway.verifyPayment(sessionId);

    // Get orderId from Moyasar invoice metadata if not provided by client
    const finalOrderId = orderId || result.gatewayRaw?.metadata?.orderId;

    if (!finalOrderId) {
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
