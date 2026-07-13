import { Category, ServiceItem, FAQItem, Announcement } from "@/data/translations";

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

// LocalStorage implementations of repositories as development fallback
export class LocalOrderRepository implements IOrderRepository {
  async createOrder(orderData: Omit<Order, "id" | "timestamp" | "date">): Promise<Order> {
    const id = "REQ-" + Math.floor(100000 + Math.random() * 900000);
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
  public categories: ICategoryRepository;
  public services: IServiceRepository;
  public faqs: IFaqRepository;
  public announcements: IAnnouncementRepository;

  private constructor() {
    // Initialized to local storage. In a Supabase environment, you would swap these
    // with Supabase repositories if env keys like NEXT_PUBLIC_SUPABASE_URL are present
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (useSupabase) {
      // Stub bindings for Supabase SDK repositories would go here
      // For now, fall back cleanly to localStorage, making it ready to switch
      console.log("Supabase config detected - ready to connect!");
    }
    
    this.orders = new LocalOrderRepository();
    this.categories = new LocalCategoryRepository();
    this.services = new LocalServiceRepository();
    this.faqs = new LocalFaqRepository();
    this.announcements = new LocalAnnouncementRepository();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
}

export const db = DatabaseService.getInstance();
