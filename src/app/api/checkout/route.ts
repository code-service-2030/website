import { NextResponse } from "next/server";
import { PaymentFactory } from "@/services/payment";

export async function POST(req: Request) {
  try {
    const { orderId, customerName, customerEmail, amount } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const origin = req.headers.get("origin");

    // Initiate payment via Moyasar
    const gateway = PaymentFactory.getGateway("Moyasar");
    const result = await gateway.initiatePayment({
      orderId,
      amount,
      currency: "SAR",
      customerName: customerName || "Customer",
      customerEmail: customerEmail || "",
      customerPhone: "",
      callbackUrl: `${origin}/checkout/result`
    });

    if (!result.success || !result.paymentUrl) {
      throw new Error(result.error || "Moyasar payment initiation failed");
    }

    return NextResponse.json({ url: result.paymentUrl });
  } catch (err: any) {
    console.error("Moyasar session creation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
