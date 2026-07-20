import { NextResponse } from "next/server";
import { PaymentFactory } from "@/services/payment";
import { db } from "@/services/db";

export async function POST(req: Request) {
  try {
    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify invoice payment status via Moyasar
    const gateway = PaymentFactory.getGateway("Moyasar");
    const result = await gateway.verifyPayment(sessionId);

    if (result.success && result.status === "paid") {
      // Fetch order details
      const orders = await db.orders.getOrders();
      const order = orders.find(o => o.id === orderId);

      if (order) {
        // Update order status in Supabase securely on backend
        await db.orders.updatePaymentStatus(orderId, "paid", {
          paymentMethod: result.paymentMethod || "Mada/Card",
          transactionId: result.transactionId,
          paymentDate: result.paymentDate,
          gatewayName: "Moyasar",
          amountPaid: result.amountPaid,
          currency: result.currency || "SAR"
        });
      }

      return NextResponse.json({ success: true, paymentStatus: "paid" });
    } else {
      return NextResponse.json({ success: false, paymentStatus: result.status });
    }
  } catch (err: any) {
    console.error("Moyasar verification failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
