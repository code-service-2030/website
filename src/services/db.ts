import { Category, ServiceItem, FAQItem, Announcement } from "@/data/translations";
import { supabase } from "./supabaseClient";

// Helper to generate unique request ID matching format: KD-2026-123456
export const generateRequestId = (): string => {
  const year = new Date().getFullYear();
  const randNum = String(Math.floor(100000 + Math.random() * 900000));
  return `KD-${year}-${randNum}`;
};

// Interfaces for our entities
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: number;
}

export interface OrderItem {
  id: string;
  serviceId: string;
  titleAr: string;
  titleEn: string;
  price: string;
  quantity: number;
  notes?: string;
  categoryId?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  contactMethod: string;
  preferredTime: string;
  generalNotes?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  date: string;
  timestamp: number;
  services: OrderItem[];
  assignedStaffId?: string;
  customerCountry?: string;
  customerCountryCode?: string;
  paymentStatus?: "paid" | "unpaid";
  language?: string;
  // Future Payment Integration Architecture fields
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
  gatewayName?: string;
  amountPaid?: number;
  currency?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  appointmentDate?: string;
  appointmentTime?: string;
  date: string;
  status: "pending" | "completed";
  assignedStaffId?: string;
  country?: string;
  countryCode?: string;
}

export interface Staff {
  id: string;
  fullName: string;
  jobTitle: string;
  phone: string;
  whatsapp: string;
  email?: string;
  photoUrl?: string;
  active: boolean;
  signature?: string;
  role?: string;
  department?: string;
  permissions?: string[];
  createdAt?: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  body: string;
  createdAt?: number;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  staffId?: string;
  staffName: string;
  actionType: "status_changed" | "contacted" | "assigned" | "created" | "updated";
  templateName?: string;
  details: string;
  createdAt: number;
}

export interface SystemSettings {
  companyEmail: string;
  primaryPhone: string;
  whatsappNumber: string;
  supportName: string;
  supportDepartment: string;
  officeHours: string;
  emailSubject: string;
  emailTemplate: string;
  whatsappTemplate: string;
  emailSubjectEn?: string;
  emailTemplateEn?: string;
  whatsappTemplateEn?: string;
}

export interface ISystemSettingsRepository {
  getSettings(): Promise<SystemSettings>;
  saveSettings(settings: SystemSettings): Promise<void>;
}

export interface StatsConfig {
  completedServices: string;
  availableServices: string;
  activeClients: string;
  satisfactionRate: string;
}

// Repository Interfaces
export interface IOrderRepository {
  createOrder(order: Omit<Order, "id" | "timestamp" | "date">): Promise<Order>;
  getOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null>;
  assignStaff(orderId: string, staffId: string | null): Promise<boolean>;
  updatePaymentStatus(orderId: string, status: Order["paymentStatus"]): Promise<boolean>;
  deleteOrder(orderId: string): Promise<boolean>;
}

export interface IInquiryRepository {
  createInquiry(inquiry: Omit<Inquiry, "id" | "date">): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  updateInquiryStatus(inquiryId: string, status: Inquiry["status"]): Promise<Inquiry | null>;
  assignStaff(inquiryId: string, staffId: string | null): Promise<boolean>;
  deleteInquiry(inquiryId: string): Promise<boolean>;
}

export interface IStaffRepository {
  getStaff(): Promise<Staff[]>;
  createStaffMember(staff: Omit<Staff, "id" | "createdAt">): Promise<Staff>;
  updateStaffMember(id: string, staff: Partial<Staff>): Promise<Staff | null>;
  deleteStaffMember(id: string): Promise<boolean>;
}

export interface IMessageTemplateRepository {
  getTemplates(): Promise<MessageTemplate[]>;
  createTemplate(template: Omit<MessageTemplate, "createdAt">): Promise<MessageTemplate>;
  updateTemplate(id: string, name: string, body: string): Promise<MessageTemplate | null>;
  deleteTemplate(id: string): Promise<boolean>;
}

export interface IOrderHistoryRepository {
  getHistory(orderId: string): Promise<OrderHistory[]>;
  addHistoryEntry(entry: Omit<OrderHistory, "id" | "createdAt">): Promise<OrderHistory>;
}

export interface ICategoryRepository {
  getCategories(): Promise<Category[]>;
  saveCategories(categories: Category[]): Promise<void>;
}

export interface IServiceRepository {
  getServices(): Promise<ServiceItem[]>;
  saveServices(services: ServiceItem[]): Promise<void>;
}

export interface IFaqRepository {
  getFaqs(): Promise<FAQItem[]>;
  saveFaqs(faqs: FAQItem[]): Promise<void>;
}

export interface IAnnouncementRepository {
  getAnnouncement(): Promise<Announcement>;
  saveAnnouncement(announcement: Announcement): Promise<void>;
}

// ----------------------------------------------------
// SUPABASE IMPLEMENTATION
// ----------------------------------------------------

export class SupabaseOrderRepository implements IOrderRepository {
  async createOrder(orderData: Omit<Order, "id" | "timestamp" | "date">): Promise<Order> {
    const id = generateRequestId();
    
    // 1. Insert order details
    const insertData: any = {
      id,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_email: orderData.customerEmail,
      contact_method: orderData.contactMethod,
      preferred_time: orderData.preferredTime,
      general_notes: orderData.generalNotes,
      status: "pending",
      assigned_staff_id: orderData.assignedStaffId || null,
      customer_country: orderData.customerCountry || "Saudi Arabia",
      customer_country_code: orderData.customerCountryCode || "+966",
      payment_status: orderData.paymentStatus || "unpaid",
      language: orderData.language || "ar",
      // Future Payment fields stubs
      payment_method: orderData.paymentMethod || "",
      transaction_id: orderData.transactionId || "",
      payment_date: orderData.paymentDate || "",
      gateway_name: orderData.gatewayName || "",
      amount_paid: orderData.amountPaid || 0,
      currency: orderData.currency || "SAR"
    };

    let { error: orderError } = await supabase.from("orders").insert(insertData);

    // Fallback if the database schema is not updated yet (language column missing)
    if (orderError && (orderError.message.includes("column \"language\"") || orderError.message.includes("language") || orderError.code === "42703")) {
      console.warn("Language column does not exist in orders table. Retrying insert without it...");
      const fallbackData = { ...insertData };
      delete fallbackData.language;
      const retryResult = await supabase.from("orders").insert(fallbackData);
      orderError = retryResult.error;
    }

    if (orderError) {
      console.error("Supabase Order insertion failed:", orderError);
      throw orderError;
    }

    // 2. Insert order services/items
    const orderItems = orderData.services.map(s => ({
      order_id: id,
      service_id: s.serviceId,
      title_ar: s.titleAr,
      title_en: s.titleEn,
      price: s.price,
      quantity: s.quantity,
      notes: s.notes,
      category_id: s.categoryId || "general"
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Supabase OrderItems insertion failed:", itemsError);
      throw itemsError;
    }

    const order: Order = {
      ...orderData,
      id,
      timestamp: Date.now(),
      date: new Date().toLocaleString("en-US"),
      status: "pending",
      paymentStatus: orderData.paymentStatus || "unpaid",
      customerCountry: orderData.customerCountry || "Saudi Arabia",
      customerCountryCode: orderData.customerCountryCode || "+966"
    };

    // Log Request Creation to History
    await db.history.addHistoryEntry({
      orderId: id,
      staffName: "System",
      actionType: "created",
      details: "Request submitted successfully by customer."
    }).catch(console.error);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("requests_updated"));
    }

    return order;
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        services:order_items(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders from Supabase:", error);
      return [];
    }

    return (data || []).map((o: any) => ({
      id: o.id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email,
      contactMethod: o.contact_method,
      preferredTime: o.preferred_time,
      generalNotes: o.general_notes,
      status: o.status,
      date: new Date(o.created_at).toLocaleString("en-US"),
      timestamp: new Date(o.created_at).getTime(),
      assignedStaffId: o.assigned_staff_id || undefined,
      customerCountry: o.customer_country || "Saudi Arabia",
      customerCountryCode: o.customer_country_code || "+966",
      paymentStatus: o.payment_status || "unpaid",
      language: o.language || "ar",
      // Payment Integration fields mapping
      paymentMethod: o.payment_method || "",
      transactionId: o.transaction_id || "",
      paymentDate: o.payment_date || "",
      gatewayName: o.gateway_name || "",
      amountPaid: o.amount_paid !== undefined ? Number(o.amount_paid) : 0,
      currency: o.currency || "SAR",
      services: (o.services || []).map((item: any) => ({
        id: item.id,
        serviceId: item.service_id,
        titleAr: item.title_ar,
        titleEn: item.title_en,
        price: item.price || "",
        quantity: item.quantity,
        notes: item.notes || "",
        categoryId: item.category_id || "general"
      }))
    }));
  }

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    // Log status change
    await db.history.addHistoryEntry({
      orderId,
      staffName: "Admin",
      actionType: "status_changed",
      details: `Status updated to ${status}`
    }).catch(console.error);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("requests_updated"));
    }
    
    return data;
  }

  async assignStaff(orderId: string, staffId: string | null): Promise<boolean> {
    const { error } = await supabase
      .from("orders")
      .update({ assigned_staff_id: staffId })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to assign staff in Supabase:", error);
      return false;
    }

    let staffName = "Unassigned";
    if (staffId) {
      const staffList = await db.staff.getStaff();
      const member = staffList.find(s => s.id === staffId);
      if (member) staffName = member.fullName;
    }

    await db.history.addHistoryEntry({
      orderId,
      staffId: staffId || undefined,
      staffName: "Admin",
      actionType: "assigned",
      details: staffId ? `Assigned request to employee: ${staffName}` : "Removed assigned employee from request"
    }).catch(console.error);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("requests_updated"));
    }

    return true;
  }

  async updatePaymentStatus(orderId: string, status: Order["paymentStatus"]): Promise<boolean> {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to update payment status in Supabase:", error);
      return false;
    }

    await db.history.addHistoryEntry({
      orderId,
      staffName: "Admin",
      actionType: "updated",
      details: `Payment status marked as ${status}`
    }).catch(console.error);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("requests_updated"));
    }

    return true;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) return false;
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("requests_updated"));
    }
    
    return true;
  }
}

export class SupabaseInquiryRepository implements IInquiryRepository {
  async createInquiry(inquiryData: Omit<Inquiry, "id" | "date">): Promise<Inquiry> {
    const id = generateRequestId();
    
    const { error } = await supabase.from("inquiries").insert({
      id,
      name: inquiryData.name,
      phone: inquiryData.phone,
      email: inquiryData.email,
      service: inquiryData.service,
      message: inquiryData.message,
      appointment_date: inquiryData.appointmentDate,
      appointment_time: inquiryData.appointmentTime,
      status: "pending",
      assigned_staff_id: inquiryData.assignedStaffId || null,
      country: inquiryData.country || "Saudi Arabia",
      country_code: inquiryData.countryCode || "+966"
    });

    if (error) {
      console.error("Supabase Inquiry insertion failed:", error);
      throw error;
    }

    const inquiry: Inquiry = {
      ...inquiryData,
      id,
      date: new Date().toLocaleString("en-US"),
      status: "pending",
      country: inquiryData.country || "Saudi Arabia",
      countryCode: inquiryData.countryCode || "+966"
    };

    // Log Inquiry Creation
    await db.history.addHistoryEntry({
      orderId: id,
      staffName: "System",
      actionType: "created",
      details: "Contact inquiry/booking submitted successfully."
    }).catch(console.error);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inquiries_updated"));
    }

    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries from Supabase:", error);
      return [];
    }

    return (data || []).map((i: any) => ({
      id: i.id,
      name: i.name,
      phone: i.phone,
      email: i.email || "",
      service: i.service || "General",
      message: i.message,
      appointmentDate: i.appointment_date || "",
      appointmentTime: i.appointment_time || "",
      date: new Date(i.created_at).toLocaleString("en-US"),
      status: i.status,
      assignedStaffId: i.assigned_staff_id || undefined,
      country: i.country || "Saudi Arabia",
      countryCode: i.country_code || "+966"
    }));
  }

  async updateInquiryStatus(inquiryId: string, status: Inquiry["status"]): Promise<Inquiry | null> {
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", inquiryId)
      .select()
      .single();

    if (error) throw error;

    await db.history.addHistoryEntry({
      orderId: inquiryId,
      staffName: "Admin",
      actionType: "status_changed",
      details: `Status updated to ${status}`
    }).catch(console.error);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inquiries_updated"));
    }
    
    return data;
  }

  async assignStaff(inquiryId: string, staffId: string | null): Promise<boolean> {
    const { error } = await supabase
      .from("inquiries")
      .update({ assigned_staff_id: staffId })
      .eq("id", inquiryId);

    if (error) {
      console.error("Failed to assign staff to inquiry in Supabase:", error);
      return false;
    }

    let staffName = "Unassigned";
    if (staffId) {
      const staffList = await db.staff.getStaff();
      const member = staffList.find(s => s.id === staffId);
      if (member) staffName = member.fullName;
    }

    await db.history.addHistoryEntry({
      orderId: inquiryId,
      staffId: staffId || undefined,
      staffName: "Admin",
      actionType: "assigned",
      details: staffId ? `Assigned message to employee: ${staffName}` : "Removed assigned employee from message"
    }).catch(console.error);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inquiries_updated"));
    }

    return true;
  }

  async deleteInquiry(inquiryId: string): Promise<boolean> {
    const { error } = await supabase.from("inquiries").delete().eq("id", inquiryId);
    if (error) return false;
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inquiries_updated"));
    }
    
    return true;
  }
}

export class SupabaseStaffRepository implements IStaffRepository {
  async getStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching staff from Supabase:", error);
      return [];
    }

    return (data || []).map((s: any) => ({
      id: s.id,
      fullName: s.full_name,
      jobTitle: s.job_title,
      phone: s.phone,
      whatsapp: s.whatsapp,
      email: s.email || "",
      photoUrl: s.photo_url || "",
      active: s.active,
      signature: s.signature || "",
      role: s.role || "staff",
      department: s.department || "services",
      permissions: s.permissions || [],
      createdAt: new Date(s.created_at).getTime()
    }));
  }

  async createStaffMember(staff: Omit<Staff, "id" | "createdAt">): Promise<Staff> {
    const { data, error } = await supabase
      .from("staff")
      .insert({
        full_name: staff.fullName,
        job_title: staff.jobTitle,
        phone: staff.phone,
        whatsapp: staff.whatsapp,
        email: staff.email,
        photo_url: staff.photoUrl,
        active: staff.active,
        signature: staff.signature,
        role: staff.role || "staff",
        department: staff.department || "services",
        permissions: staff.permissions || []
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating staff in Supabase:", error);
      throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("staff_updated"));
    }

    return {
      id: data.id,
      fullName: data.full_name,
      jobTitle: data.job_title,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      photoUrl: data.photo_url,
      active: data.active,
      signature: data.signature,
      role: data.role,
      department: data.department,
      permissions: data.permissions
    };
  }

  async updateStaffMember(id: string, staff: Partial<Staff>): Promise<Staff | null> {
    const payload: any = {};
    if (staff.fullName !== undefined) payload.full_name = staff.fullName;
    if (staff.jobTitle !== undefined) payload.job_title = staff.jobTitle;
    if (staff.phone !== undefined) payload.phone = staff.phone;
    if (staff.whatsapp !== undefined) payload.whatsapp = staff.whatsapp;
    if (staff.email !== undefined) payload.email = staff.email;
    if (staff.photoUrl !== undefined) payload.photo_url = staff.photoUrl;
    if (staff.active !== undefined) payload.active = staff.active;
    if (staff.signature !== undefined) payload.signature = staff.signature;
    if (staff.role !== undefined) payload.role = staff.role;
    if (staff.department !== undefined) payload.department = staff.department;
    if (staff.permissions !== undefined) payload.permissions = staff.permissions;

    const { data, error } = await supabase
      .from("staff")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating staff in Supabase:", error);
      throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("staff_updated"));
      window.dispatchEvent(new Event("requests_updated"));
      window.dispatchEvent(new Event("inquiries_updated"));
    }

    return {
      id: data.id,
      fullName: data.full_name,
      jobTitle: data.job_title,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      photoUrl: data.photo_url,
      active: data.active,
      signature: data.signature,
      role: data.role,
      department: data.department,
      permissions: data.permissions
    };
  }

  async deleteStaffMember(id: string): Promise<boolean> {
    const { error } = await supabase.from("staff").delete().eq("id", id);
    if (error) {
      console.error("Error deleting staff in Supabase:", error);
      return false;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("staff_updated"));
    }

    return true;
  }
}

export class SupabaseMessageTemplateRepository implements IMessageTemplateRepository {
  async getTemplates(): Promise<MessageTemplate[]> {
    const { data, error } = await supabase
      .from("message_templates")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching templates from Supabase:", error);
      return [];
    }

    return (data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      body: t.body,
      createdAt: new Date(t.created_at).getTime()
    }));
  }

  async createTemplate(template: Omit<MessageTemplate, "createdAt">): Promise<MessageTemplate> {
    const { data, error } = await supabase
      .from("message_templates")
      .insert({
        id: template.id,
        name: template.name,
        body: template.body
      })
      .select()
      .single();

    if (error) throw error;

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("templates_updated"));
    }

    return {
      id: data.id,
      name: data.name,
      body: data.body
    };
  }

  async updateTemplate(id: string, name: string, body: string): Promise<MessageTemplate | null> {
    const { data, error } = await supabase
      .from("message_templates")
      .update({ name, body })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("templates_updated"));
    }

    return {
      id: data.id,
      name: data.name,
      body: data.body
    };
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const { error } = await supabase.from("message_templates").delete().eq("id", id);
    if (error) return false;

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("templates_updated"));
    }

    return true;
  }
}

export class SupabaseOrderHistoryRepository implements IOrderHistoryRepository {
  async getHistory(orderId: string): Promise<OrderHistory[]> {
    const { data, error } = await supabase
      .from("order_history")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading order history from Supabase:", error);
      return [];
    }

    return (data || []).map((h: any) => ({
      id: h.id,
      orderId: h.order_id,
      staffId: h.staff_id || undefined,
      staffName: h.staff_name,
      actionType: h.action || h.action_type || "status_changed",
      templateName: h.template_name || undefined,
      details: h.details,
      createdAt: new Date(h.created_at).getTime()
    }));
  }

  async addHistoryEntry(entry: Omit<OrderHistory, "id" | "createdAt">): Promise<OrderHistory> {
    const dbAction = (actionType: string): string => {
      const map: Record<string, string> = {
        status_changed: "status_changed",
        contacted: "contact_customer",
        assigned: "staff_assigned",
        created: "request_created",
        payment_received: "payment_received",
        request_completed: "request_completed"
      };
      return map[actionType] || actionType;
    };

    const { data, error } = await supabase
      .from("order_history")
      .insert({
        order_id: entry.orderId,
        staff_id: entry.staffId || null,
        staff_name: entry.staffName,
        action: dbAction(entry.actionType),
        action_type: entry.actionType,
        template_name: entry.templateName || null,
        details: entry.details
      })
      .select()
      .single();

    if (error) {
      console.error("Error writing history entry to Supabase:", error);
      throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("history_updated"));
    }

    return {
      id: data.id,
      orderId: data.order_id,
      staffId: data.staff_id || undefined,
      staffName: data.staff_name,
      actionType: data.action || data.action_type || "status_changed",
      templateName: data.template_name || undefined,
      details: data.details,
      createdAt: new Date(data.created_at).getTime()
    };
  }
}

export class SupabaseCategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching categories from Supabase:", error);
      return [];
    }

    return (data || []).map((c: any) => ({
      id: c.id,
      nameAr: c.name_ar,
      nameEn: c.name_en,
      descAr: c.desc_ar || "",
      descEn: c.desc_en || "",
      icon: c.icon,
      visible: c.visible,
      order: c.order
    }));
  }

  async saveCategories(categories: Category[]): Promise<void> {
    const payloads = categories.map(c => ({
      id: c.id,
      name_ar: c.nameAr,
      name_en: c.nameEn,
      desc_ar: c.descAr,
      desc_en: c.descEn,
      icon: c.icon,
      visible: c.visible,
      order: c.order
    }));

    const { error } = await supabase.from("categories").upsert(payloads);
    if (error) throw error;
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("catalog_updated"));
    }
  }
}

// Supabase implementation of Service repository
export class SupabaseServiceRepository implements IServiceRepository {
  async getServices(): Promise<ServiceItem[]> {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching services from Supabase:", error);
      return [];
    }

    return (data || []).map((s: any) => ({
      id: s.id,
      titleAr: s.title_ar,
      titleEn: s.title_en,
      descAr: s.desc_ar || "",
      descEn: s.desc_en || "",
      categoryId: s.category_id,
      price: s.price,
      docsAr: s.docs_ar,
      docsEn: s.docs_en,
      completionTimeAr: s.completion_time_ar,
      completionTimeEn: s.completion_time_en,
      keywords: s.keywords || [],
      featured: s.featured,
      featuredOrder: s.featured_order,
      visible: s.visible,
      order: s.order
    }));
  }

  async saveServices(services: ServiceItem[]): Promise<void> {
    const payloads = services.map(s => ({
      id: s.id,
      title_ar: s.titleAr,
      title_en: s.titleEn,
      desc_ar: s.descAr,
      desc_en: s.descEn,
      category_id: s.categoryId,
      price: s.price,
      docs_ar: s.docsAr,
      docs_en: s.docsEn,
      completion_time_ar: s.completionTimeAr,
      completion_time_en: s.completionTimeEn,
      keywords: s.keywords,
      featured: s.featured,
      featured_order: s.featuredOrder,
      visible: s.visible,
      order: s.order
    }));

    const { error } = await supabase.from("services").upsert(payloads);
    if (error) throw error;
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("catalog_updated"));
    }
  }
}

// Supabase implementation of FAQ repository
export class SupabaseFaqRepository implements IFaqRepository {
  async getFaqs(): Promise<FAQItem[]> {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching FAQs from Supabase:", error);
      return [];
    }

    return (data || []).map((f: any) => ({
      id: f.id,
      qAr: f.q_ar,
      qEn: f.q_en,
      aAr: f.a_ar,
      aEn: f.a_en,
      visible: f.visible,
      order: f.order
    }));
  }

  async saveFaqs(faqs: FAQItem[]): Promise<void> {
    const payloads = faqs.map(f => ({
      id: f.id,
      q_ar: f.qAr,
      q_en: f.qEn,
      a_ar: f.aAr,
      a_en: f.aEn,
      visible: f.visible,
      order: f.order
    }));

    const { error } = await supabase.from("faq").upsert(payloads);
    if (error) throw error;
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("faqs_updated"));
    }
  }
}

// Supabase implementation of Announcement repository
export class SupabaseAnnouncementRepository implements IAnnouncementRepository {
  async getAnnouncement(): Promise<Announcement> {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("active", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching announcements from Supabase:", error);
      return {} as Announcement;
    }

    if (!data) return {} as Announcement;

    return {
      id: data.id,
      textAr: data.text_ar,
      textEn: data.text_en,
      active: data.active,
      bgColor: data.bg_color
    };
  }

  async saveAnnouncement(announcement: Announcement): Promise<void> {
    const payload = {
      id: announcement.id,
      text_ar: announcement.textAr,
      text_en: announcement.textEn,
      active: announcement.active,
      bg_color: announcement.bgColor
    };

    const { error } = await supabase.from("announcements").upsert(payload);
    if (error) throw error;
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("announcement_updated"));
    }
  }
}

export const defaultSystemSettings: SystemSettings = {
  companyEmail: "eyadk0444@gmail.com",
  primaryPhone: "+966537073161",
  whatsappNumber: "+966537073161",
  supportName: "Support Agent",
  supportDepartment: "Customer Care",
  officeHours: "9:00 AM - 5:00 PM",
  emailSubject: "طلب جديد - رقم الطلب {RequestID}",
  emailSubjectEn: "New Request - {RequestID}",
  emailTemplate: `السلام عليكم ورحمة الله وبركاته،

أرغب بطلب الخدمات التالية من مكتب كود خدمات.

رقم الطلب:

{RequestID}

الخدمات المطلوبة:

{ServicesList}

إجمالي السعر التقريبي:

{TotalPrice} ريال سعودي

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

شكراً لكم،

كود خدمات`,
  emailTemplateEn: `Hello,

I would like to request the following services from Code Services.

Request Number:

{RequestID}

Requested Services:

{ServicesList}

Estimated Total:

{TotalPrice} SAR

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

Thank you.

Code Services`,
  whatsappTemplate: `السلام عليكم ورحمة الله وبركاته،

أرغب بطلب الخدمات التالية من مكتب كود خدمات.

رقم الطلب:

{RequestID}

الخدمات المطلوبة:

{ServicesList}

إجمالي السعر التقريبي:

{TotalPrice} ريال سعودي

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

شكراً لكم،

كود خدمات`,
  whatsappTemplateEn: `Hello,

I would like to request the following services from Code Services.

Request Number:

{RequestID}

Requested Services:

{ServicesList}

Estimated Total:

{TotalPrice} SAR

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

Thank you.

Code Services`
};

export class SupabaseSystemSettingsRepository implements ISystemSettingsRepository {
  async getSettings(): Promise<SystemSettings> {
    const { data, error } = await supabase
      .from("system_settings")
      .select("*")
      .eq("id", "communication")
      .maybeSingle();

    if (error) {
      console.error("Error fetching system settings from Supabase:", error);
      return defaultSystemSettings;
    }

    if (!data) {
      // Seed default settings row if missing
      try {
        await this.saveSettings(defaultSystemSettings);
      } catch (e) {
        console.error("Failed to seed default settings:", e);
      }
      return defaultSystemSettings;
    }

    return {
      companyEmail: data.company_email,
      primaryPhone: data.primary_phone,
      whatsappNumber: data.whatsapp_number,
      supportName: data.support_name,
      supportDepartment: data.support_department,
      officeHours: data.office_hours,
      emailSubject: data.email_subject,
      emailTemplate: data.email_template,
      whatsappTemplate: data.whatsapp_template,
      emailSubjectEn: data.email_subject_en || defaultSystemSettings.emailSubjectEn,
      emailTemplateEn: data.email_template_en || defaultSystemSettings.emailTemplateEn,
      whatsappTemplateEn: data.whatsapp_template_en || defaultSystemSettings.whatsappTemplateEn
    };
  }

  async saveSettings(settings: SystemSettings): Promise<void> {
    const payload: any = {
      id: "communication",
      company_email: settings.companyEmail,
      primary_phone: settings.primaryPhone,
      whatsapp_number: settings.whatsappNumber,
      support_name: settings.supportName,
      support_department: settings.supportDepartment,
      office_hours: settings.officeHours,
      email_subject: settings.emailSubject,
      email_template: settings.emailTemplate,
      whatsapp_template: settings.whatsappTemplate,
      email_subject_en: settings.emailSubjectEn || "",
      email_template_en: settings.emailTemplateEn || "",
      whatsapp_template_en: settings.whatsappTemplateEn || "",
      updated_at: new Date().toISOString()
    };

    let { error } = await supabase.from("system_settings").upsert(payload);
    
    // Fallback if the database doesn't have the new English template columns yet
    if (error && (error.message.includes("column") || error.code === "42703")) {
      console.warn("New English settings columns do not exist yet. Retrying save without them...");
      const fallbackPayload = { ...payload };
      delete fallbackPayload.email_subject_en;
      delete fallbackPayload.email_template_en;
      delete fallbackPayload.whatsapp_template_en;
      const retryResult = await supabase.from("system_settings").upsert(fallbackPayload);
      error = retryResult.error;
    }

    if (error) {
      console.error("Error saving system settings to Supabase:", error);
      throw error;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("settings_updated"));
    }
  }
}

// ----------------------------------------------------
// LOCALSTORAGE FALLBACK IMPLEMENTATION
// ----------------------------------------------------

export class LocalOrderRepository implements IOrderRepository {
  async createOrder(orderData: Omit<Order, "id" | "timestamp" | "date">): Promise<Order> {
    const id = generateRequestId();
    const order: Order = {
      ...orderData,
      id,
      timestamp: Date.now(),
      date: new Date().toLocaleString("en-US"),
      status: "pending",
      paymentStatus: orderData.paymentStatus || "unpaid",
      customerCountry: orderData.customerCountry || "Saudi Arabia",
      customerCountryCode: orderData.customerCountryCode || "+966"
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("code_services_requests");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(order);
      localStorage.setItem("code_services_requests", JSON.stringify(list));
      window.dispatchEvent(new Event("requests_updated"));
    }

    await db.history.addHistoryEntry({
      orderId: id,
      staffName: "System",
      actionType: "created",
      details: "Request submitted successfully by customer."
    }).catch(console.error);

    return order;
  }

  async getOrders(): Promise<Order[]> {
    if (typeof window === "undefined") return [];
    const existing = localStorage.getItem("code_services_requests");
    return existing ? JSON.parse(existing) : [];
  }

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<Order | null> {
    if (typeof window === "undefined") return null;
    const existing = localStorage.getItem("code_services_requests");
    const list: Order[] = existing ? JSON.parse(existing) : [];
    const idx = list.findIndex(o => o.id === orderId);
    if (idx > -1) {
      list[idx].status = status;
      localStorage.setItem("code_services_requests", JSON.stringify(list));
      window.dispatchEvent(new Event("requests_updated"));

      await db.history.addHistoryEntry({
        orderId,
        staffName: "Admin",
        actionType: "status_changed",
        details: `Status updated to ${status}`
      }).catch(console.error);

      return list[idx];
    }
    return null;
  }

  async assignStaff(orderId: string, staffId: string | null): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const existing = localStorage.getItem("code_services_requests");
    const list: Order[] = existing ? JSON.parse(existing) : [];
    const idx = list.findIndex(o => o.id === orderId);
    if (idx > -1) {
      list[idx].assignedStaffId = staffId || undefined;
      localStorage.setItem("code_services_requests", JSON.stringify(list));
      window.dispatchEvent(new Event("requests_updated"));

      let staffName = "Unassigned";
      if (staffId) {
        const staffList = await db.staff.getStaff();
        const member = staffList.find(s => s.id === staffId);
        if (member) staffName = member.fullName;
      }

      await db.history.addHistoryEntry({
        orderId,
        staffId: staffId || undefined,
        staffName: "Admin",
        actionType: "assigned",
        details: staffId ? `Assigned request to employee: ${staffName}` : "Removed assigned employee from request"
      }).catch(console.error);

      return true;
    }
    return false;
  }

  async updatePaymentStatus(orderId: string, status: Order["paymentStatus"]): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const existing = localStorage.getItem("code_services_requests");
    const list: Order[] = existing ? JSON.parse(existing) : [];
    const idx = list.findIndex(o => o.id === orderId);
    if (idx > -1) {
      list[idx].paymentStatus = status;
      localStorage.setItem("code_services_requests", JSON.stringify(list));
      window.dispatchEvent(new Event("requests_updated"));

      await db.history.addHistoryEntry({
        orderId,
        staffName: "Admin",
        actionType: "updated",
        details: `Payment status marked as ${status}`
      }).catch(console.error);

      return true;
    }
    return false;
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const existing = localStorage.getItem("code_services_requests");
    const list: Order[] = existing ? JSON.parse(existing) : [];
    const filtered = list.filter(o => o.id !== orderId);
    if (filtered.length !== list.length) {
      localStorage.setItem("code_services_requests", JSON.stringify(filtered));
      window.dispatchEvent(new Event("requests_updated"));
      return true;
    }
    return false;
  }
}

export class LocalInquiryRepository implements IInquiryRepository {
  async createInquiry(inquiryData: Omit<Inquiry, "id" | "date">): Promise<Inquiry> {
    const id = generateRequestId();
    const inquiry: Inquiry = {
      ...inquiryData,
      id,
      date: new Date().toLocaleString("en-US"),
      status: "pending",
      country: inquiryData.country || "Saudi Arabia",
      countryCode: inquiryData.countryCode || "+966"
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("code_services_inquiries");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(inquiry);
      localStorage.setItem("code_services_inquiries", JSON.stringify(list));
      window.dispatchEvent(new Event("inquiries_updated"));
    }

    await db.history.addHistoryEntry({
      orderId: id,
      staffName: "System",
      actionType: "created",
      details: "Contact inquiry/booking submitted successfully."
    }).catch(console.error);

    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    if (typeof window === "undefined") return [];
    const existing = localStorage.getItem("code_services_inquiries");
    return existing ? JSON.parse(existing) : [];
  }

  async updateInquiryStatus(inquiryId: string, status: Inquiry["status"]): Promise<Inquiry | null> {
    if (typeof window === "undefined") return null;
    const existing = localStorage.getItem("code_services_inquiries");
    const list: Inquiry[] = existing ? JSON.parse(existing) : [];
    const idx = list.findIndex(i => i.id === inquiryId);
    if (idx > -1) {
      list[idx].status = status;
      localStorage.setItem("code_services_inquiries", JSON.stringify(list));
      window.dispatchEvent(new Event("inquiries_updated"));

      await db.history.addHistoryEntry({
        orderId: inquiryId,
        staffName: "Admin",
        actionType: "status_changed",
        details: `Status updated to ${status}`
      }).catch(console.error);

      return list[idx];
    }
    return null;
  }

  async assignStaff(inquiryId: string, staffId: string | null): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const existing = localStorage.getItem("code_services_inquiries");
    const list: Inquiry[] = existing ? JSON.parse(existing) : [];
    const idx = list.findIndex(i => i.id === inquiryId);
    if (idx > -1) {
      list[idx].assignedStaffId = staffId || undefined;
      localStorage.setItem("code_services_inquiries", JSON.stringify(list));
      window.dispatchEvent(new Event("inquiries_updated"));

      let staffName = "Unassigned";
      if (staffId) {
        const staffList = await db.staff.getStaff();
        const member = staffList.find(s => s.id === staffId);
        if (member) staffName = member.fullName;
      }

      await db.history.addHistoryEntry({
        orderId: inquiryId,
        staffId: staffId || undefined,
        staffName: "Admin",
        actionType: "assigned",
        details: staffId ? `Assigned message to employee: ${staffName}` : "Removed assigned employee from message"
      }).catch(console.error);

      return true;
    }
    return false;
  }

  async deleteInquiry(inquiryId: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const existing = localStorage.getItem("code_services_inquiries");
    const list: Inquiry[] = existing ? JSON.parse(existing) : [];
    const filtered = list.filter(i => i.id !== inquiryId);
    if (filtered.length !== list.length) {
      localStorage.setItem("code_services_inquiries", JSON.stringify(filtered));
      window.dispatchEvent(new Event("inquiries_updated"));
      return true;
    }
    return false;
  }
}

export class LocalStaffRepository implements IStaffRepository {
  async getStaff(): Promise<Staff[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("code_services_staff");
    return saved ? JSON.parse(saved) : [];
  }

  async createStaffMember(staff: Omit<Staff, "id" | "createdAt">): Promise<Staff> {
    const id = "staff-" + Date.now().toString();
    const created: Staff = {
      ...staff,
      id,
      createdAt: Date.now()
    };

    if (typeof window !== "undefined") {
      const list = await this.getStaff();
      list.push(created);
      localStorage.setItem("code_services_staff", JSON.stringify(list));
      window.dispatchEvent(new Event("staff_updated"));
    }
    return created;
  }

  async updateStaffMember(id: string, staff: Partial<Staff>): Promise<Staff | null> {
    if (typeof window === "undefined") return null;
    const list = await this.getStaff();
    const idx = list.findIndex(s => s.id === id);
    if (idx > -1) {
      const updated = { ...list[idx], ...staff };
      list[idx] = updated;
      localStorage.setItem("code_services_staff", JSON.stringify(list));
      window.dispatchEvent(new Event("staff_updated"));
      window.dispatchEvent(new Event("requests_updated"));
      window.dispatchEvent(new Event("inquiries_updated"));
      return updated;
    }
    return null;
  }

  async deleteStaffMember(id: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const list = await this.getStaff();
    const filtered = list.filter(s => s.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem("code_services_staff", JSON.stringify(filtered));
      window.dispatchEvent(new Event("staff_updated"));
      return true;
    }
    return false;
  }
}

export class LocalMessageTemplateRepository implements IMessageTemplateRepository {
  private defaultTemplates: MessageTemplate[] = [
    {
      id: "welcome",
      name: "Welcome Message",
      body: "السلام عليكم أستاذ/ة {Customer Name}\n\nنرحب بك في كود خدمات.\n\nأنا {Staff Name} وسأكون المسؤول عن تنفيذ طلبكم ومتابعته حتى الانتهاء بإذن الله.\n\nرقم الطلب:\n{Request ID}\n\nالخدمة المطلوبة:\n{Requested Services}\n\nإذا احتجتم أي استفسار فأنا في خدمتكم.\n\nشكراً لاختياركم كود خدمات."
    },
    {
      id: "received",
      name: "Request Received",
      body: "السلام عليكم أستاذ/ة {Customer Name}\n\nنسعد بإبلاغكم بأن طلبكم رقم {Request ID} قد تم استلامه وهو قيد المراجعة حالياً.\n\nالخدمات:\n{Requested Services}\n\nالمسؤول عن طلبكم: {Staff Name}.\n\nشكراً لثقتكم بنا."
    },
    {
      id: "missing_docs",
      name: "Missing Documents",
      body: "السلام عليكم أستاذ/ة {Customer Name}\n\nبخصوص طلبكم رقم {Request ID}، نرجو منكم تزويدنا بالمستندات التالية لإكمال المعاملة:\n\n[اكتب المستندات المطلوبة هنا]\n\nشاكرين ومقدرين تعاونكم."
    },
    {
      id: "payment_reminder",
      name: "Payment Reminder",
      body: "السلام عليكم أستاذ/ة {Customer Name}\n\nنود تذكيركم بصدور الفاتورة الخاصة بطلبكم رقم {Request ID} للخدمات التالية:\n{Requested Services}\n\nالرجاء إتمام عملية السداد للمتابعة.\n\nشكراً لكم."
    },
    {
      id: "completed",
      name: "Request Completed",
      body: "السلام عليكم أستاذ/ة {Customer Name}\n\nنسعد بإبلاغكم بإنجاز طلبكم رقم {Request ID} بنجاح!\n\nيمكنكم تحميل المستندات أو استلامها الآن.\n\nيسعدنا تقييمكم لخدمتنا.\n\nشكراً لاختياركم كود خدمات."
    }
  ];

  async getTemplates(): Promise<MessageTemplate[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("code_services_templates");
    if (!saved) {
      localStorage.setItem("code_services_templates", JSON.stringify(this.defaultTemplates));
      return this.defaultTemplates;
    }
    return JSON.parse(saved);
  }

  async createTemplate(template: Omit<MessageTemplate, "createdAt">): Promise<MessageTemplate> {
    const created: MessageTemplate = {
      ...template,
      createdAt: Date.now()
    };
    if (typeof window !== "undefined") {
      const list = await this.getTemplates();
      list.push(created);
      localStorage.setItem("code_services_templates", JSON.stringify(list));
      window.dispatchEvent(new Event("templates_updated"));
    }
    return created;
  }

  async updateTemplate(id: string, name: string, body: string): Promise<MessageTemplate | null> {
    if (typeof window === "undefined") return null;
    const list = await this.getTemplates();
    const idx = list.findIndex(t => t.id === id);
    if (idx > -1) {
      list[idx].name = name;
      list[idx].body = body;
      localStorage.setItem("code_services_templates", JSON.stringify(list));
      window.dispatchEvent(new Event("templates_updated"));
      return list[idx];
    }
    return null;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const list = await this.getTemplates();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem("code_services_templates", JSON.stringify(filtered));
      window.dispatchEvent(new Event("templates_updated"));
      return true;
    }
    return false;
  }
}

export class LocalOrderHistoryRepository implements IOrderHistoryRepository {
  async getHistory(orderId: string): Promise<OrderHistory[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("code_services_history");
    const list: OrderHistory[] = saved ? JSON.parse(saved) : [];
    return list.filter(h => h.orderId === orderId);
  }

  async addHistoryEntry(entry: Omit<OrderHistory, "id" | "createdAt">): Promise<OrderHistory> {
    const id = "hist-" + Date.now().toString() + "-" + Math.random().toString().substring(2, 6);
    const created: OrderHistory = {
      ...entry,
      id,
      createdAt: Date.now()
    };

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("code_services_history");
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(created);
      localStorage.setItem("code_services_history", JSON.stringify(list));
      window.dispatchEvent(new Event("history_updated"));
    }
    return created;
  }
}

export class LocalCategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<Category[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("code_services_categories");
    return saved ? JSON.parse(saved) : [];
  }

  async saveCategories(categories: Category[]): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem("code_services_categories", JSON.stringify(categories));
      window.dispatchEvent(new Event("catalog_updated"));
    }
  }
}

export class LocalServiceRepository implements IServiceRepository {
  async getServices(): Promise<ServiceItem[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("code_services_catalog");
    return saved ? JSON.parse(saved) : [];
  }

  async saveServices(services: ServiceItem[]): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem("code_services_catalog", JSON.stringify(services));
      window.dispatchEvent(new Event("catalog_updated"));
    }
  }
}

export class LocalFaqRepository implements IFaqRepository {
  async getFaqs(): Promise<FAQItem[]> {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("code_services_faqs");
    return saved ? JSON.parse(saved) : [];
  }

  async saveFaqs(faqs: FAQItem[]): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem("code_services_faqs", JSON.stringify(faqs));
      window.dispatchEvent(new Event("faqs_updated"));
    }
  }
}

export class LocalAnnouncementRepository implements IAnnouncementRepository {
  async getAnnouncement(): Promise<Announcement> {
    if (typeof window === "undefined") return {} as Announcement;
    const saved = localStorage.getItem("code_services_announcement");
    return saved ? JSON.parse(saved) : {} as Announcement;
  }

  async saveAnnouncement(announcement: Announcement): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem("code_services_announcement", JSON.stringify(announcement));
      window.dispatchEvent(new Event("announcement_updated"));
    }
  }
}

export class LocalSystemSettingsRepository implements ISystemSettingsRepository {
  async getSettings(): Promise<SystemSettings> {
    if (typeof window === "undefined") return defaultSystemSettings;
    const saved = localStorage.getItem("code_services_settings");
    return saved ? JSON.parse(saved) : defaultSystemSettings;
  }

  async saveSettings(settings: SystemSettings): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem("code_services_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event("settings_updated"));
    }
  }
}

// ----------------------------------------------------
// DATABASE SERVICE LAYER ABSTRACTION
// ----------------------------------------------------

export class DatabaseService {
  private static instance: DatabaseService;
  
  public orders: IOrderRepository;
  public inquiries: IInquiryRepository;
  public staff: IStaffRepository;
  public templates: IMessageTemplateRepository;
  public history: IOrderHistoryRepository;
  public categories: ICategoryRepository;
  public services: IServiceRepository;
  public faqs: IFaqRepository;
  public announcements: IAnnouncementRepository;
  public settings: ISystemSettingsRepository;

  private constructor() {
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (useSupabase) {
      console.log("Supabase credentials detected! Initializing Supabase repositories.");
      this.orders = new SupabaseOrderRepository();
      this.inquiries = new SupabaseInquiryRepository();
      this.staff = new SupabaseStaffRepository();
      this.templates = new SupabaseMessageTemplateRepository();
      this.history = new SupabaseOrderHistoryRepository();
      this.categories = new SupabaseCategoryRepository();
      this.services = new SupabaseServiceRepository();
      this.faqs = new SupabaseFaqRepository();
      this.announcements = new SupabaseAnnouncementRepository();
      this.settings = new SupabaseSystemSettingsRepository();
    } else {
      console.log("No Supabase configuration. Initializing LocalStorage repositories.");
      this.orders = new LocalOrderRepository();
      this.inquiries = new LocalInquiryRepository();
      this.staff = new LocalStaffRepository();
      this.templates = new LocalMessageTemplateRepository();
      this.history = new LocalOrderHistoryRepository();
      this.categories = new LocalCategoryRepository();
      this.services = new LocalServiceRepository();
      this.faqs = new LocalFaqRepository();
      this.announcements = new LocalAnnouncementRepository();
      this.settings = new LocalSystemSettingsRepository();
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
}

export const db = DatabaseService.getInstance();
