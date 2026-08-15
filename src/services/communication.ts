/**
 * FUTURE-READY COMMUNICATION ROUTING ARCHITECTURE
 * Prepared for future communication channels (Live Chat, Telegram, SMS, Teams, Meet, Zoom).
 */

import { SystemSettings } from "./db";

export interface CommunicationPayload {
  requestId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  preferredContact: string;
  preferredTime: string;
  generalNotes: string;
  servicesSummary: string;
  categoriesSummary: string;
  items?: Array<{ name: string; quantity: number; price: string }>;
  totalPrice?: string;
  language?: string;
}

export interface RouteResponse {
  success: boolean;
  actionTaken: string;
  redirectUrl?: string;
  error?: string;
  gmailUrl?: string;
  mailtoUrl?: string;
  orderId?: string;
}

export interface ICommunicationHandler {
  channelName: string;
  handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse>;
}

export function formatPrice(price: string, lang: string): string {
  const cleanPrice = (price || "").trim();
  if (!cleanPrice) {
    return lang === "en" ? "Per agreement" : "حسب الاتفاق";
  }
  
  if (cleanPrice === "حسب الاتفاق" || cleanPrice.toLowerCase().includes("agreement") || cleanPrice === "0" || cleanPrice === "0 ريال") {
    return lang === "en" ? "Per agreement" : "حسب الاتفاق";
  }

  const numOnly = cleanPrice.replace(/[^\d.,]/g, "");
  if (!numOnly) {
    return cleanPrice;
  }
  
  const hasArCurrency = cleanPrice.includes("ريال") || cleanPrice.includes("ر.س");
  const hasEnCurrency = cleanPrice.toUpperCase().includes("SAR") || cleanPrice.toUpperCase().includes("SR");
  
  if (lang === "en") {
    if (hasEnCurrency) return cleanPrice;
    return `${cleanPrice} SAR`;
  } else {
    if (hasArCurrency) return cleanPrice;
    return `${cleanPrice} ريال`;
  }
}

export function buildLocalizedMessage(
  payload: CommunicationPayload,
  lang: string,
  settings: SystemSettings
): { subject: string; body: string } {
  const selectedLang = lang === "en" ? "en" : "ar";

  const emailSubjectTpl = selectedLang === "en"
    ? (settings.emailSubjectEn || "New Request - {RequestID}")
    : (settings.emailSubject || "طلب جديد - رقم الطلب {RequestID}");

  // Check if it is a price inquiry request
  const isPriceInquiry = payload.items?.some(item => {
    const p = (item.price || "").trim();
    return p === "حسب الاتفاق" || p === "" || p === "0" || p === "0 ريال" || p.toLowerCase().includes("agreement");
  }) || payload.items?.length === 0 || payload.totalPrice === "حسب الاتفاق";

  let whatsappMessageTpl = "";
  if (isPriceInquiry) {
    whatsappMessageTpl = selectedLang === "en"
      ? `Hello,\n\nI would like to inquire about the price of the following service from Code Services.\n\nService:\n{ServiceName}\n\nRequest Number:\n{RequestID}\n\nCustomer Information:\nName: {CustomerName}\nPhone: {PhoneNumber}\nEmail: {Email}\nPreferred Contact Method: {PreferredContactMethod}\nPreferred Contact Time: {PreferredContactTime}\n\nPlease provide the expected price and relevant service details.\n\nThank you.\n\nCode Services`
      : `السلام عليكم ورحمة الله وبركاته،\n\nأرغب في الاستفسار عن سعر الخدمة التالية من مكتب كود خدمات.\n\nالخدمة:\n{ServiceName}\n\nرقم الطلب:\n{RequestID}\n\nمعلومات العميل:\nالاسم: {CustomerName}\nالجوال: {PhoneNumber}\nالبريد الإلكتروني: {Email}\nطريقة التواصل المفضلة: {PreferredContactMethod}\nوقت التواصل المفضل: {PreferredContactTime}\n\nأرجو توضيح السعر المتوقع للخدمة والتفاصيل المتعلقة بها.\n\nشكراً لكم.\n\nكود خدمات`;
  } else {
    whatsappMessageTpl = selectedLang === "en"
      ? (settings.whatsappTemplateEn || "Hello, I would like to request the following services...")
      : (settings.whatsappTemplate || "السلام عليكم ورحمة الله وبركاته، أرغب بطلب الخدمات التالية...");
  }

  let servicesList = "";
  if (payload.items && payload.items.length > 0) {
    servicesList = payload.items.map((item, idx) => {
      const formattedItemPrice = formatPrice(item.price || "", selectedLang);
      if (selectedLang === "ar") {
        return `${idx + 1}- ${item.name}\nالكمية: ${item.quantity}\nالسعر المتوقع: ${formattedItemPrice}`;
      } else {
        return `${idx + 1}. ${item.name}\nQuantity: ${item.quantity}\nEstimated Price: ${formattedItemPrice}`;
      }
    }).join("\n\n");
  } else {
    servicesList = payload.servicesSummary;
  }

  const serviceName = payload.items && payload.items.length > 0
    ? payload.items.map(item => item.name).join(", ")
    : payload.servicesSummary;

  const subject = emailSubjectTpl.replace(/\{RequestID\}/g, payload.requestId);

  let body = whatsappMessageTpl;
  
  // Resolve escaped line breaks
  body = body.replace(/\\n/g, "\n");
  
  body = body.replace(/\{RequestID\}/g, payload.requestId);
  body = body.replace(/\{ServicesList\}/g, servicesList);
  body = body.replace(/\{ServiceName\}/g, serviceName);
  body = body.replace(/\{TotalPrice\}/g, formatPrice(payload.totalPrice || "0", selectedLang));
  body = body.replace(/\{CustomerName\}/g, payload.customerName);
  body = body.replace(/\{PhoneNumber\}/g, payload.customerPhone);
  body = body.replace(/\{Email\}/g, payload.customerEmail || "-");
  body = body.replace(/\{PreferredContactMethod\}/g, payload.preferredContact);
  body = body.replace(/\{PreferredContactTime\}/g, payload.preferredTime);

  return { subject, body };
}

/**
 * 1. WHATSAPP ROUTING HANDLER
 */
export class WhatsAppHandler implements ICommunicationHandler {
  channelName = "WhatsApp";

  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[WhatsAppHandler] Generating message using templates...");
    
    const lang = payload.language || "ar";
    const { body } = buildLocalizedMessage(payload, lang, settings);

    const whatsappPhone = settings.whatsappNumber.replace(/[\s+]/g, "");
    const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(body)}`;
    
    return {
      success: true,
      actionTaken: "Opened WhatsApp",
      redirectUrl: waUrl,
      orderId: payload.requestId
    };
  }
}

/**
 * 2. EMAIL ROUTING HANDLER
 */
export class EmailHandler implements ICommunicationHandler {
  channelName = "Email";

  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[EmailHandler] Resolving email template...");

    const lang = payload.language || "ar";
    const { subject, body } = buildLocalizedMessage(payload, lang, settings);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.companyEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const mailtoUrl = `mailto:${settings.companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return {
      success: true,
      actionTaken: "Opened Gmail Compose",
      redirectUrl: gmailUrl,
      gmailUrl,
      mailtoUrl,
      orderId: payload.requestId
    };
  }
}

/**
 * 4. FUTURE Live Chat INTEGRATION STUB
 */
export class LiveChatHandler implements ICommunicationHandler {
  channelName = "LiveChat";
  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[LiveChat] Stub triggered. Future custom chatbot widget initialization goes here.");
    return { success: true, actionTaken: "Live Chat widget simulated." };
  }
}

/**
 * 5. FUTURE Telegram INTEGRATION STUB
 */
export class TelegramHandler implements ICommunicationHandler {
  channelName = "Telegram";
  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[Telegram] Stub triggered. Redirecting to telegram bot or channel chat.");
    return { success: true, actionTaken: "Telegram routing stub." };
  }
}

/**
 * 6. FUTURE SMS INTEGRATION STUB
 */
export class SMSHandler implements ICommunicationHandler {
  channelName = "SMS";
  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[SMS] Stub triggered. Integration with Twilio/Unifonic gateways goes here.");
    return { success: true, actionTaken: "SMS routing stub." };
  }
}

/**
 * 7. FUTURE Microsoft Teams / Google Meet / Zoom MEETING STUBS
 */
export class MeetingHandler implements ICommunicationHandler {
  channelName = "Meeting";
  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[Meeting] Stub triggered. Automated calendaring invitation goes here.");
    return { success: true, actionTaken: "Meeting appointment stub." };
  }
}

/**
 * MAIN ROUTER FOR HANDLING CHANNELS
 */
export class CommunicationRouter {
  private static handlers: Record<string, ICommunicationHandler> = {
    whatsapp: new WhatsAppHandler(),
    email: new EmailHandler(),
    livechat: new LiveChatHandler(),
    telegram: new TelegramHandler(),
    sms: new SMSHandler(),
    meeting: new MeetingHandler()
  };

  static async route(method: string, payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    const handler = this.handlers[method.toLowerCase()];
    if (!handler) {
      return {
        success: false,
        actionTaken: "None",
        error: `Unsupported communication channel method: ${method}`
      };
    }
    return await handler.handleRoute(payload, settings);
  }
}
