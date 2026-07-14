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

// Future-ready template dictionary supporting multiple languages
const LOCALIZED_TEMPLATES: Record<string, {
  emailSubject: string;
  whatsappMessage: string;
}> = {
  ar: {
    emailSubject: "طلب جديد - رقم الطلب {RequestID}",
    whatsappMessage: `السلام عليكم ورحمة الله وبركاته،

أرغب بطلب الخدمات التالية من مكتب كود خدمات.

رقم الطلب:
{RequestID}

----------------------------------------

الخدمات المطلوبة:

{ServicesList}

----------------------------------------

إجمالي السعر التقريبي:

{TotalPrice} ريال سعودي

----------------------------------------

معلومات العميل:

الاسم:
{CustomerName}

الجوال:
{PhoneNumber}

البريد الإلكتروني:
{Email}

طريقة التواصل المفضلة:
{PreferredContactMethod}

وقت التواصل المفضل:
{PreferredContactTime}

----------------------------------------

شكراً لكم،

كود خدمات`
  },
  en: {
    emailSubject: "New Request - {RequestID}",
    whatsappMessage: `Hello,

I would like to request the following services from Code Services.

Request Number:
{RequestID}

----------------------------------------

Requested Services:

{ServicesList}

----------------------------------------

Estimated Total:

{TotalPrice} SAR

----------------------------------------

Customer Information:

Name:
{CustomerName}

Phone:
{PhoneNumber}

Email:
{Email}

Preferred Contact Method:
{PreferredContactMethod}

Preferred Contact Time:
{PreferredContactTime}

----------------------------------------

Thank you.

Code Services`
  }
};

export function buildLocalizedMessage(payload: CommunicationPayload, lang: string): { subject: string; body: string } {
  const selectedLang = LOCALIZED_TEMPLATES[lang] ? lang : "ar";
  const tpl = LOCALIZED_TEMPLATES[selectedLang];

  let servicesList = "";
  if (payload.items && payload.items.length > 0) {
    servicesList = payload.items.map((item, idx) => {
      if (selectedLang === "ar") {
        return `${idx + 1}- ${item.name}\nالكمية: ${item.quantity}\nالسعر المتوقع: ${item.price} ريال`;
      } else {
        return `${idx + 1}. ${item.name}\nQuantity: ${item.quantity}\nEstimated Price: ${item.price} SAR`;
      }
    }).join("\n\n");
  } else {
    servicesList = payload.servicesSummary;
  }

  const subject = tpl.emailSubject.replace(/\{RequestID\}/g, payload.requestId);

  let body = tpl.whatsappMessage;
  body = body.replace(/\{RequestID\}/g, payload.requestId);
  body = body.replace(/\{ServicesList\}/g, servicesList);
  body = body.replace(/\{TotalPrice\}/g, payload.totalPrice || "0");
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
    const { body } = buildLocalizedMessage(payload, lang);

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
    const { subject, body } = buildLocalizedMessage(payload, lang);

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
 * 3. PHONE DIALER ROUTING HANDLER
 */
export class PhoneHandler implements ICommunicationHandler {
  channelName = "Phone";

  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[PhoneHandler] Generating tel dialer link...");
    const telUrl = `tel:${settings.primaryPhone.replace(/[\s]/g, "")}`;
    return {
      success: true,
      actionTaken: "Opened Phone Dialer",
      redirectUrl: telUrl
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
    call: new PhoneHandler(),
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
