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
  deleteOrder(orderId: string): Promise<boolean>;
}

export interface IInquiryRepository {
  createInquiry(inquiry: Omit<Inquiry, "id" | "date">): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  updateInquiryStatus(inquiryId: string, status: Inquiry["status"]): Promise<Inquiry | null>;
  deleteInquiry(inquiryId: string): Promise<boolean>;
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

// Supabase implementation of Order repository
export class SupabaseOrderRepository implements IOrderRepository {
  async createOrder(orderData: Omit<Order, "id" | "timestamp" | "date">): Promise<Order> {
    const id = generateRequestId();
    
    // 1. Insert order details
    const { error: orderError } = await supabase.from("orders").insert({
      id,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_email: orderData.customerEmail,
      contact_method: orderData.contactMethod,
      preferred_time: orderData.preferredTime,
      general_notes: orderData.generalNotes,
      status: "pending"
    });

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
      notes: s.notes
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
      status: "pending"
    };

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
      services: (o.services || []).map((item: any) => ({
        id: item.id,
        serviceId: item.service_id,
        titleAr: item.title_ar,
        titleEn: item.title_en,
        price: item.price || "",
        quantity: item.quantity,
        notes: item.notes || ""
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
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("requests_updated"));
    }
    
    return data;
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

// Supabase implementation of Inquiry repository
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
      status: "pending"
    });

    if (error) {
      console.error("Supabase Inquiry insertion failed:", error);
      throw error;
    }

    const inquiry: Inquiry = {
      ...inquiryData,
      id,
      date: new Date().toLocaleString("en-US"),
      status: "pending"
    };

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
      status: i.status
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
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("inquiries_updated"));
    }
    
    return data;
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

// Supabase implementation of Category repository
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

// LocalStorage implementations of repositories as development fallback
export class LocalOrderRepository implements IOrderRepository {
  async createOrder(orderData: Omit<Order, "id" | "timestamp" | "date">): Promise<Order> {
    const id = generateRequestId();
    const order: Order = {
      ...orderData,
      id,
      timestamp: Date.now(),
      date: new Date().toLocaleString("en-US"),
      status: "pending",
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("code_services_requests");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(order);
      localStorage.setItem("code_services_requests", JSON.stringify(list));
      window.dispatchEvent(new Event("requests_updated"));
    }
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
      return list[idx];
    }
    return null;
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
      status: "pending"
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("code_services_inquiries");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(inquiry);
      localStorage.setItem("code_services_inquiries", JSON.stringify(list));
      window.dispatchEvent(new Event("inquiries_updated"));
    }
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
      return list[idx];
    }
    return null;
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

// Database Service Layer Abstraction class
export class DatabaseService {
  private static instance: DatabaseService;
  
  public orders: IOrderRepository;
  public inquiries: IInquiryRepository;
  public categories: ICategoryRepository;
  public services: IServiceRepository;
  public faqs: IFaqRepository;
  public announcements: IAnnouncementRepository;

  private constructor() {
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (useSupabase) {
      console.log("Supabase credentials detected! Initializing Supabase repositories.");
      this.orders = new SupabaseOrderRepository();
      this.inquiries = new SupabaseInquiryRepository();
      this.categories = new SupabaseCategoryRepository();
      this.services = new SupabaseServiceRepository();
      this.faqs = new SupabaseFaqRepository();
      this.announcements = new SupabaseAnnouncementRepository();
    } else {
      console.log("No Supabase configuration. Initializing LocalStorage repositories.");
      this.orders = new LocalOrderRepository();
      this.inquiries = new LocalInquiryRepository();
      this.categories = new LocalCategoryRepository();
      this.services = new LocalServiceRepository();
      this.faqs = new LocalFaqRepository();
      this.announcements = new LocalAnnouncementRepository();
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
