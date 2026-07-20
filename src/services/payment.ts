/**
 * PAYMENT GATEWAY ARCHITECTURE LAYER
 * Prepared for future integration with HyperPay, Moyasar, PayTabs, and MyFatoorah.
 */

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string; // Redirect URL for hosted payment pages (e.g., MyFatoorah/PayTabs/HyperPay)
  error?: string;
  gatewayRaw?: any; // Raw response from the gateway
}

export interface VerificationResponse {
  success: boolean;
  status: "paid" | "failed" | "pending";
  transactionId: string;
  paymentMethod: string;
  paymentDate: string;
  amountPaid: number;
  currency: string;
  gatewayRaw?: any;
}

export interface IPaymentGateway {
  name: string;
  initiatePayment(details: PaymentDetails): Promise<PaymentResponse>;
  verifyPayment(transactionId: string): Promise<VerificationResponse>;
}

/**
 * 1. HYPERPAY INTEGRATION STUB
 */
export class HyperPayGateway implements IPaymentGateway {
  name = "HyperPay";

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`[HyperPay] Initiating payment request for order: ${details.orderId}`);
    // FUTURE TODO:
    // 1. Send POST request to HyperPay API (e.g. /v1/checkouts) with authentication headers
    // 2. Obtain a checkoutId
    // 3. Return paymentUrl (linking to a page rendering the HyperPay widget using the checkoutId)
    return {
      success: true,
      transactionId: "hp_stub_" + Math.random().toString(36).substr(2, 9),
      paymentUrl: `https://test.copyandpay.com/payment-widget?checkoutId=stub_checkout_id`
    };
  }

  async verifyPayment(transactionId: string): Promise<VerificationResponse> {
    console.log(`[HyperPay] Verifying payment for transaction: ${transactionId}`);
    // FUTURE TODO: Query HyperPay transaction status endpoint /v1/checkouts/{id}/payment
    return {
      success: true,
      status: "paid",
      transactionId,
      paymentMethod: "CreditCard",
      paymentDate: new Date().toISOString(),
      amountPaid: 0, // Should read actual from gateway response
      currency: "SAR"
    };
  }
}

/**
 * 2. MOYASAR INTEGRATION STUB
 */
export class MoyasarGateway implements IPaymentGateway {
  name = "Moyasar";

  private getSecretKey(): string {
    return (process.env.MOYASAR_SECRET_KEY || "").trim();
  }

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`[Moyasar] Initiating payment request for order: ${details.orderId}`);
    try {
      const authHeader = 'Basic ' + Buffer.from(this.getSecretKey() + ':').toString('base64');
      
      const payload = {
        amount: Math.round(details.amount * 100), // Moyasar expects Halalas
        currency: details.currency || "SAR",
        description: `Code Services Order #${details.orderId}`,
        back_url: details.callbackUrl || `http://localhost:3000/payment/callback?orderId=${details.orderId}`,
        callback_url: details.callbackUrl || `http://localhost:3000/payment/callback?orderId=${details.orderId}`,
        metadata: {
          orderId: details.orderId,
          customerName: details.customerName,
          ...details.metadata
        }
      };

      const response = await fetch("https://api.moyasar.com/v1/invoices", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Moyasar API error: ${response.statusText} - ${errText}`);
      }

      const data = await response.json();

      return {
        success: true,
        transactionId: data.id,
        paymentUrl: data.url,
        gatewayRaw: data
      };
    } catch (error: any) {
      console.error("[Moyasar] Initiation failed:", error);
      return {
        success: false,
        error: error.message || "Failed to initiate payment with Moyasar"
      };
    }
  }

  async verifyPayment(invoiceId: string): Promise<VerificationResponse> {
    console.log(`[Moyasar] Verifying payment status for invoice: ${invoiceId}`);
    try {
      const authHeader = 'Basic ' + Buffer.from(this.getSecretKey() + ':').toString('base64');
      
      const response = await fetch(`https://api.moyasar.com/v1/invoices/${invoiceId}`, {
        method: "GET",
        headers: {
          "Authorization": authHeader
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice ${invoiceId}`);
      }

      const data = await response.json();

      const isPaid = data.status === "paid";
      let paymentMethod = "CreditCard";
      if (data.payments && data.payments.length > 0) {
        paymentMethod = data.payments[0].source.type || "Mada/Card";
      }

      return {
        success: isPaid,
        status: isPaid ? "paid" : data.status === "failed" ? "failed" : "pending",
        transactionId: data.id,
        paymentMethod,
        paymentDate: data.paid_at || new Date().toISOString(),
        amountPaid: data.amount / 100, // Convert Halalas to SAR
        currency: data.currency,
        gatewayRaw: data
      };
    } catch (error: any) {
      console.error("[Moyasar] Verification failed:", error);
      return {
        success: false,
        status: "pending",
        transactionId: invoiceId,
        paymentMethod: "Unknown",
        paymentDate: new Date().toISOString(),
        amountPaid: 0,
        currency: "SAR",
        gatewayRaw: error
      };
    }
  }
}

/**
 * 3. PAYTABS INTEGRATION STUB
 */
export class PayTabsGateway implements IPaymentGateway {
  name = "PayTabs";

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`[PayTabs] Initiating transaction request for order: ${details.orderId}`);
    // FUTURE TODO:
    // 1. POST request to https://secure.paytabs.com/payment/request
    // 2. Pass profile_id, server_key, cart_id, cart_description, cart_amount, etc.
    // 3. Return redirect_url from response JSON
    return {
      success: true,
      transactionId: "pt_stub_" + Math.random().toString(36).substr(2, 9),
      paymentUrl: `https://secure.paytabs.com/payment/page/stub`
    };
  }

  async verifyPayment(transactionId: string): Promise<VerificationResponse> {
    console.log(`[PayTabs] Querying transaction status on PayTabs: ${transactionId}`);
    // FUTURE TODO: POST query transaction API
    return {
      success: true,
      status: "paid",
      transactionId,
      paymentMethod: "ApplePay",
      paymentDate: new Date().toISOString(),
      amountPaid: 0,
      currency: "SAR"
    };
  }
}

/**
 * 4. MYFATOORAH INTEGRATION STUB
 */
export class MyFatoorahGateway implements IPaymentGateway {
  name = "MyFatoorah";

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`[MyFatoorah] Creating direct invoice for order: ${details.orderId}`);
    // FUTURE TODO:
    // 1. POST request to MyFatoorah API (e.g. /v2/SendPayment or /v2/InitiateSession)
    // 2. Set Authorization: Bearer token
    // 3. Parse invoice redirect link (PaymentURL)
    return {
      success: true,
      transactionId: "mf_stub_" + Math.random().toString(36).substr(2, 9),
      paymentUrl: `https://demo.myfatoorah.com/stub/checkout`
    };
  }

  async verifyPayment(transactionId: string): Promise<VerificationResponse> {
    console.log(`[MyFatoorah] Verifying MyFatoorah payment status for invoice: ${transactionId}`);
    // FUTURE TODO: POST /v2/GetPaymentStatus with KeyType: 'InvoiceId'
    return {
      success: true,
      status: "paid",
      transactionId,
      paymentMethod: "Visa",
      paymentDate: new Date().toISOString(),
      amountPaid: 0,
      currency: "SAR"
    };
  }
}

/**
 * FACTORY MANAGER TO RESOLVE ACTIVE GATEWAY
 */
export class PaymentFactory {
  static getGateway(gatewayName: "HyperPay" | "Moyasar" | "PayTabs" | "MyFatoorah"): IPaymentGateway {
    switch (gatewayName) {
      case "HyperPay":
        return new HyperPayGateway();
      case "Moyasar":
        return new MoyasarGateway();
      case "PayTabs":
        return new PayTabsGateway();
      case "MyFatoorah":
        return new MyFatoorahGateway();
      default:
        throw new Error(`Unsupported payment gateway: ${gatewayName}`);
    }
  }
}
