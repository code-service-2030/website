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
  // Check if it is a non-numeric/custom text (e.g. "حسب الاتفاق" or "Per agreement")
  // We clean up numbers and see if anything is left. If it contains arabic or non-digit chars that aren't dot/comma, it's non-numeric
  const numOnly = cleanPrice.replace(/[^\d.,]/g, "");
  if (!numOnly) {
    return cleanPrice;
  }
  
  // Check if it already contains currency keywords
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

  const whatsappMessageTpl = selectedLang === "en"
    ? (settings.whatsappTemplateEn || "Hello, I would like to request the following services...")
    : (settings.whatsappTemplate || "السلام عليكم ورحمة الله وبركاته، أرغب بطلب الخدمات التالية...");

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

  const subject = emailSubjectTpl.replace(/\{RequestID\}/g, payload.requestId);

  let body = whatsappMessageTpl;
  body = body.replace(/\{RequestID\}/g, payload.requestId);
  body = body.replace(/\{ServicesList\}/g, servicesList);
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
