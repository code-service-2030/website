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
}

export interface RouteResponse {
  success: boolean;
  actionTaken: string;
  redirectUrl?: string;
  error?: string;
}

export interface ICommunicationHandler {
  channelName: string;
  handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse>;
}

/**
 * 1. WHATSAPP ROUTING HANDLER
 */
export class WhatsAppHandler implements ICommunicationHandler {
  channelName = "WhatsApp";

  async handleRoute(payload: CommunicationPayload, settings: SystemSettings): Promise<RouteResponse> {
    console.log("[WhatsAppHandler] Generating message using templates...");
    
    let text = settings.whatsappTemplate || "";
    // If template is empty, use a standard fallback
    if (!text) {
      text = `السلام عليكم ورحمة الله وبركاته،\nأرغب بطلب الخدمات التالية (رقم الطلب: {Request ID}):\n\n{Requested Services}\n\nطريقة التواصل: {Preferred Contact Method}`;
    }

    text = text.replace(/\{Customer Name\}/g, payload.customerName);
    text = text.replace(/\{Phone Number\}/g, payload.customerPhone);
    text = text.replace(/\{Request ID\}/g, payload.requestId);
    text = text.replace(/\{Requested Services\}/g, payload.servicesSummary);
    text = text.replace(/\{Category\}/g, payload.categoriesSummary);
    text = text.replace(/\{Notes\}/g, payload.generalNotes || "-");
    text = text.replace(/\{Preferred Contact Method\}/g, payload.preferredContact);

    const whatsappPhone = settings.whatsappNumber.replace(/[\s+]/g, "");
    const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`;
    
    return {
      success: true,
      actionTaken: "Opened WhatsApp",
      redirectUrl: waUrl
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

    let subject = settings.emailSubject || "New Service Request - {Request ID}";
    subject = subject.replace(/\{Request ID\}/g, payload.requestId);

    let body = settings.emailTemplate || "";
    if (!body) {
      body = `Name: {Customer Name}\nPhone: {Phone Number}\nServices: {Requested Services}\nCategory: {Category}\nNotes: {Notes}\nContact Method: {Preferred Contact Method}\nRequest ID: {Request ID}`;
    }

    body = body.replace(/\{Customer Name\}/g, payload.customerName);
    body = body.replace(/\{Phone Number\}/g, payload.customerPhone);
    body = body.replace(/\{Request ID\}/g, payload.requestId);
    body = body.replace(/\{Requested Services\}/g, payload.servicesSummary);
    body = body.replace(/\{Category\}/g, payload.categoriesSummary);
    body = body.replace(/\{Notes\}/g, payload.generalNotes || "-");
    body = body.replace(/\{Preferred Contact Method\}/g, payload.preferredContact);

    const bodyFormatted = `Customer Name:\n${payload.customerName}\n\nPhone:\n${payload.customerPhone}\n\nRequested Services:\n${payload.servicesSummary}\n\nCategory:\n${payload.categoriesSummary}\n\nNotes:\n${payload.generalNotes || "-"}\n\nPreferred Contact Method:\nEmail\n\nRequest Number:\n${payload.requestId}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.companyEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyFormatted)}`;

    return {
      success: true,
      actionTaken: "Opened Gmail Compose",
      redirectUrl: gmailUrl
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
