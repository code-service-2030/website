/**
 * Future Payment Gateways Architecture for Code Services
 * Supports: Mada, Apple Pay, STC Pay, Visa, Mastercard
 */

export type PaymentMethod = "mada" | "applepay" | "stcpay" | "visa" | "mastercard";
export type PaymentStatus = "pending" | "authorized" | "captured" | "failed" | "refunded";

export interface TransactionDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: "SAR";
  method: PaymentMethod;
  status: PaymentStatus;
  customerName: string;
  customerPhone: string;
  gatewayReference?: string;
  errorMessage?: string;
  timestamp: number;
}

export interface PaymentGatewayConfig {
  merchantId: string;
  publicKey: string;
  isSandbox: boolean;
  supportedMethods: PaymentMethod[];
}

export interface IPaymentService {
  initializePayment(amount: number, orderId: string, method: PaymentMethod, customerInfo: { name: string; phone: string }): Promise<TransactionDetails>;
  verifyPayment(transactionId: string): Promise<TransactionDetails>;
  refundPayment(transactionId: string, amount?: number): Promise<boolean>;
}

// Mock Payment Service implementing IPaymentService
export class MockPaymentService implements IPaymentService {
  private config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    console.log(`Payment Service initialized in ${config.isSandbox ? "Sandbox" : "Production"} mode.`);
  }

  /**
   * Mock payment initialization
   * To implement real payment:
   * 1. Integrate a provider like Moyasar, Checkout.com, or Tap Payments SDKs.
   * 2. Call their API to initiate the transaction session.
   * 3. Redirect the client to the 3DS secure verification screen.
   */
  async initializePayment(
    amount: number,
    orderId: string,
    method: PaymentMethod,
    customerInfo: { name: string; phone: string }
  ): Promise<TransactionDetails> {
    console.log(`Initiating mock ${method.toUpperCase()} payment of ${amount} SAR for Order: ${orderId}...`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const transactionId = "TXN-" + Math.floor(1000000 + Math.random() * 9000000);
    
    // Simulate successful authorization
    return {
      id: transactionId,
      orderId,
      amount,
      currency: "SAR",
      method,
      status: "authorized",
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      gatewayReference: "MOCK-REF-" + Math.floor(100000000 + Math.random() * 900000000),
      timestamp: Date.now()
    };
  }

  /**
   * Mock transaction verification callback/polling check
   */
  async verifyPayment(transactionId: string): Promise<TransactionDetails> {
    console.log(`Verifying payment status for Transaction: ${transactionId}...`);
    
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: transactionId,
      orderId: "REQ-UNKNOWN",
      amount: 0,
      currency: "SAR",
      method: "mada",
      status: "captured", // Captured means money has been settled
      customerName: "Mock Customer",
      customerPhone: "05XXXXXXXX",
      timestamp: Date.now()
    };
  }

  /**
   * Mock refund request
   */
  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    console.log(`Requesting mock refund for Transaction: ${transactionId} (Amount: ${amount || "Full"})...`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  }
}

// Tap Payments API Integration Example Configuration
// export const paymentService = new MockPaymentService({
//   merchantId: process.env.PAYMENT_MERCHANT_ID || "mock_merchant",
//   publicKey: process.env.PAYMENT_PUBLIC_KEY || "mock_pk",
//   isSandbox: process.env.NODE_ENV !== "production",
//   supportedMethods: ["mada", "applepay", "visa", "mastercard"]
// });

export const paymentService = new MockPaymentService({
  merchantId: "code_services_merch_id",
  publicKey: "pk_test_code_services_123456",
  isSandbox: true,
  supportedMethods: ["mada", "applepay", "stcpay", "visa", "mastercard"]
});
