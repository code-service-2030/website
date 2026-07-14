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

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    console.log(`[Moyasar] Initiating payment request for order: ${details.orderId}`);
    // FUTURE TODO:
    // 1. Send request to https://api.moyasar.com/v1/payments
    // 2. Set authorization: Basic (Base64 Secret Key)
    // 3. Set callback_url in the request payload
    // 4. Return invoice URL/payment url
    return {
      success: true,
      transactionId: "moy_stub_" + Math.random().toString(36).substr(2, 9),
      paymentUrl: `https://api.moyasar.com/v1/payments/stub/redirect`
    };
  }

  async verifyPayment(transactionId: string): Promise<VerificationResponse> {
    console.log(`[Moyasar] Verifying payment status for: ${transactionId}`);
    // FUTURE TODO: GET https://api.moyasar.com/v1/payments/{id}
    return {
      success: true,
      status: "paid",
      transactionId,
      paymentMethod: "Mada",
      paymentDate: new Date().toISOString(),
      amountPaid: 0,
      currency: "SAR"
    };
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
