"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { db } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import { 
  defaultCategories, 
  defaultServices, 
  defaultFAQs,
  defaultAnnouncement,
  Category, 
  ServiceItem, 
  FAQItem, 
  Announcement,
  getMigratedServices
} from "@/data/translations";
import { 
  Inbox, 
  Settings, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  Phone, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Globe,
  Search,
  Download,
  Printer,
  ChevronUp,
  ChevronDown,
  Info,
  Layers,
  HelpCircle,
  BarChart,
  Megaphone,
  Copy,
  Star,
  ShoppingCart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Inquiry {
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

interface StatsData {
  completedServices: string;
  availableServices: string;
  googleReviews: string;
  googleRating: string;
}

export default function AdminDashboard() {
  const { locale, t, toggleLanguage, theme, toggleTheme } = useLanguage();
  const router = useRouter();

  // Authentication check
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<"inquiries" | "requests" | "categories" | "services" | "announcements" | "faqs" | "stats">("requests");

  // Database States (loaded from localStorage)
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement>(defaultAnnouncement);
  const [stats, setStats] = useState<StatsData>({
    completedServices: "5000+",
    availableServices: "100+",
    googleReviews: "18+",
    googleRating: "4.9★"
  });
  const [featuredLimit, setFeaturedLimit] = useState(6);

  // Search & Filter state
  const [searchInquiries, setSearchInquiries] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [searchRequests, setSearchRequests] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  
  const [searchServices, setSearchServices] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals for CRUD operations
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [showAddFAQModal, setShowAddFAQModal] = useState(false);

  // Form states
  const [newCategory, setNewCategory] = useState({
    id: "",
    nameAr: "",
    nameEn: "",
    descAr: "",
    descEn: "",
    icon: "Briefcase",
    visible: true,
  });

  const [newService, setNewService] = useState({
    id: "",
    titleAr: "",
    titleEn: "",
    descAr: "",
    descEn: "",
    categoryId: "business",
    price: "",
    docsAr: "",
    docsEn: "",
    completionTimeAr: "",
    completionTimeEn: "",
    keywordsString: "",
    featured: false,
    featuredOrder: 1,
    visible: true,
  });

  const [newFAQ, setNewFAQ] = useState({
    qAr: "",
    qEn: "",
    aAr: "",
    aEn: "",
    visible: true
  });

  // Drag and Drop States
  const [draggedCatIdx, setDraggedCatIdx] = useState<number | null>(null);
  const [draggedServiceIdx, setDraggedServiceIdx] = useState<number | null>(null);

  // Verify auth on mount
  useEffect(() => {
    const session = localStorage.getItem("code_services_admin_session");
    if (session !== "true") {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
    setMounted(true);
  }, [router]);

  // Load database structures
  useEffect(() => {
    if (!authenticated) return;

    const loadData = async () => {
      // inquiries
      try {
        const inqs = await db.inquiries.getInquiries();
        setInquiries(inqs);
      } catch (e) {
        console.error("Error loading inquiries:", e);
      }

      // categories
      try {
        const cats = await db.categories.getCategories();
        if (cats && cats.length > 0) {
          setCategories(cats);
        } else {
          setCategories(defaultCategories);
          await db.categories.saveCategories(defaultCategories);
        }
      } catch (e) {
        console.error("Error loading categories:", e);
      }

      // services
      try {
        const svcs = await db.services.getServices();
        if (svcs && svcs.length > 0) {
          setServices(svcs);
        } else {
          const migrated = getMigratedServices();
          setServices(migrated);
          await db.services.saveServices(migrated);
        }
      } catch (e) {
        console.error("Error loading services:", e);
      }

      // FAQs
      try {
        const faqList = await db.faqs.getFaqs();
        if (faqList && faqList.length > 0) {
          setFaqs(faqList);
        } else {
          setFaqs(defaultFAQs);
          await db.faqs.saveFaqs(defaultFAQs);
        }
      } catch (e) {
        console.error("Error loading FAQs:", e);
      }

      // announcement
      try {
        const ann = await db.announcements.getAnnouncement();
        if (ann && ann.id) {
          setAnnouncement(ann);
        } else {
          setAnnouncement(defaultAnnouncement);
          await db.announcements.saveAnnouncement(defaultAnnouncement);
        }
      } catch (e) {
        console.error("Error loading announcement:", e);
      }

      // stats counters
      const savedStats = localStorage.getItem("code_services_stats");
      if (savedStats) {
        try { setStats(JSON.parse(savedStats)); } catch {}
      }
      
      const savedLimit = localStorage.getItem("code_services_featured_limit");
      if (savedLimit) {
        setFeaturedLimit(parseInt(savedLimit) || 6);
      }
    };

    loadData();

    // Listen to changes
    const reloadCatalog = async () => {
      try {
        const cats = await db.categories.getCategories();
        if (cats && cats.length > 0) setCategories(cats);
        const svcs = await db.services.getServices();
        if (svcs && svcs.length > 0) setServices(svcs);
      } catch (e) {}
    };

    const reloadFaqs = async () => {
      try {
        const faqList = await db.faqs.getFaqs();
        if (faqList && faqList.length > 0) setFaqs(faqList);
      } catch (e) {}
    };

    const reloadAnnouncement = async () => {
      try {
        const ann = await db.announcements.getAnnouncement();
        if (ann && ann.id) setAnnouncement(ann);
      } catch (e) {}
    };

    const reloadInquiries = async () => {
      try {
        const inqs = await db.inquiries.getInquiries();
        setInquiries(inqs);
      } catch (e) {}
    };

    window.addEventListener("catalog_updated", reloadCatalog);
    window.addEventListener("faqs_updated", reloadFaqs);
    window.addEventListener("announcement_updated", reloadAnnouncement);
    window.addEventListener("inquiries_updated", reloadInquiries);

    return () => {
      window.removeEventListener("catalog_updated", reloadCatalog);
      window.removeEventListener("faqs_updated", reloadFaqs);
      window.removeEventListener("announcement_updated", reloadAnnouncement);
      window.removeEventListener("inquiries_updated", reloadInquiries);
    };
  }, [authenticated]);

  // Load and listen to requests changes
  useEffect(() => {
    if (!authenticated) return;
    
    const loadRequests = async () => {
      try {
        const reqs = await db.orders.getOrders();
        setRequests(reqs);
      } catch (e) {
        console.error("Error loading requests:", e);
      }
    };

    const loadInquiries = async () => {
      try {
        const inqs = await db.inquiries.getInquiries();
        setInquiries(inqs);
      } catch (e) {
        console.error("Error loading inquiries:", e);
      }
    };
    
    loadRequests();
    window.addEventListener("requests_updated", loadRequests);
    
    // Realtime Supabase updates if keys present
    let channelOrders: any = null;
    let channelInquiries: any = null;
    const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (useSupabase) {
      channelOrders = supabase
        .channel("orders-db-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          () => {
            loadRequests();
          }
        )
        .subscribe();

      channelInquiries = supabase
        .channel("inquiries-db-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "inquiries" },
          () => {
            loadInquiries();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener("requests_updated", loadRequests);
      if (channelOrders) supabase.removeChannel(channelOrders);
      if (channelInquiries) supabase.removeChannel(channelInquiries);
    };
  }, [authenticated]);

  const handleLogout = () => {
    localStorage.removeItem("code_services_admin_session");
    router.push("/admin/login");
  };

  // Inquiry actions
  // Inquiry actions
  const toggleInquiryStatus = async (id: string) => {
    const inquiry = inquiries.find(i => i.id === id);
    if (!inquiry) return;
    const newStatus = inquiry.status === "pending" ? "completed" : "pending";
    try {
      await db.inquiries.updateInquiryStatus(id, newStatus);
    } catch (e) {
      console.error("Failed to update inquiry status:", e);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا الاستفسار؟" : "Delete this inquiry?")) {
      try {
        await db.inquiries.deleteInquiry(id);
      } catch (e) {
        console.error("Failed to delete inquiry:", e);
      }
    }
  };

  // Requests Action Handlers
  const updateRequestStatus = async (id: string, newStatus: any) => {
    try {
      await db.orders.updateOrderStatus(id, newStatus);
    } catch (e) {
      console.error("Failed to update request status:", e);
    }
  };

  const deleteRequest = async (id: string) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا الطلب؟" : "Delete this request?")) {
      try {
        const success = await db.orders.deleteOrder(id);
        if (success && selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(null);
        }
      } catch (e) {
        console.error("Failed to delete request:", e);
      }
    }
  };

  const exportRequestsToCSV = () => {
    const headers = [
      "الاسم / Customer Name",
      "الجوال / Phone Number",
      "البريد الإلكتروني / Email",
      "رقم الطلب / Request ID",
      "التاريخ / Date",
      "الحالة / Status",
      "طريقة التواصل / Contact Method",
      "الوقت المفضل / Preferred Time",
      "الخدمات المطلوبة / Requested Services",
      "ملاحظات إضافية / General Notes"
    ];
    const rows = requests.map((req) => [
      req.customerName,
      `'${req.customerPhone}`,
      req.customerEmail || "",
      req.id,
      req.date,
      req.status,
      req.contactMethod,
      req.preferredTime,
      req.services.map((s: any) => `${s.titleAr || s.titleEn} (x${s.quantity || 1})`).join(" | "),
      req.generalNotes ? req.generalNotes.replace(/\n/g, " ") : ""
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "الاسم / Customer Name",
      "الجوال / Phone Number",
      "البريد الإلكتروني / Email",
      "الرقم / ID",
      "القسم / Service Category",
      "الرسالة / Message",
      "تاريخ الموعد / Appointment Date",
      "وقت الموعد / Appointment Time",
      "تاريخ التقديم / Date Submitted",
      "الحالة / Status"
    ];
    const rows = inquiries.map((inq) => [
      inq.name,
      `'${inq.phone}`,
      inq.email || "",
      inq.id,
      inq.service,
      inq.message.replace(/\n/g, " "),
      inq.appointmentDate || "",
      inq.appointmentTime || "",
      inq.date,
      inq.status
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrintPDF = () => {
    window.print();
  };

  // CATEGORIES CRUD handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.id || !newCategory.nameAr || !newCategory.nameEn) return;

    const added: Category = {
      id: newCategory.id.toLowerCase().trim(),
      nameAr: newCategory.nameAr.trim(),
      nameEn: newCategory.nameEn.trim(),
      descAr: newCategory.descAr.trim(),
      descEn: newCategory.descEn.trim(),
      icon: newCategory.icon,
      visible: newCategory.visible,
      order: categories.length + 1
    };

    const updated = [...categories, added];
    setCategories(updated);
    localStorage.setItem("code_services_categories", JSON.stringify(updated));
    db.categories.saveCategories(updated).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));

    // Reset
    setNewCategory({ id: "", nameAr: "", nameEn: "", descAr: "", descEn: "", icon: "Briefcase", visible: true });
    setShowAddCategoryModal(false);
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const updated = categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat));
    setCategories(updated);
    localStorage.setItem("code_services_categories", JSON.stringify(updated));
    db.categories.saveCategories(updated).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
    setEditingCategory(null);
  };

  const deleteCategory = (id: string) => {
    const servicesInCat = services.filter((s) => s.categoryId === id).length;
    if (servicesInCat > 0) {
      alert(locale === "ar" 
        ? `لا يمكن حذف هذا القسم لأنه يحتوي على ${servicesInCat} خدمة. قم بنقلها أولاً.`
        : `Cannot delete category. It contains ${servicesInCat} services. Move them first.`);
      return;
    }

    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا القسم؟" : "Delete this category?")) {
      const updated = categories.filter((cat) => cat.id !== id).map((cat, idx) => ({ ...cat, order: idx + 1 }));
      setCategories(updated);
      localStorage.setItem("code_services_categories", JSON.stringify(updated));
      db.categories.saveCategories(updated).catch(console.error);
      window.dispatchEvent(new Event("catalog_updated"));
    }
  };

  // SERVICES CRUD handlers
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.titleAr || !newService.titleEn) return;

    const cleanKeywords = newService.keywordsString
      ? newService.keywordsString.split(",").map(k => k.trim()).filter(Boolean)
      : [];

    const added: ServiceItem = {
      id: "service-" + Date.now().toString(),
      titleAr: newService.titleAr.trim(),
      titleEn: newService.titleEn.trim(),
      descAr: newService.descAr.trim(),
      descEn: newService.descEn.trim(),
      categoryId: newService.categoryId,
      price: newService.price ? newService.price.trim() : undefined,
      docsAr: newService.docsAr ? newService.docsAr.trim() : undefined,
      docsEn: newService.docsEn ? newService.docsEn.trim() : undefined,
      completionTimeAr: newService.completionTimeAr ? newService.completionTimeAr.trim() : undefined,
      completionTimeEn: newService.completionTimeEn ? newService.completionTimeEn.trim() : undefined,
      keywords: cleanKeywords,
      featured: newService.featured,
      featuredOrder: newService.featuredOrder,
      visible: newService.visible,
      order: services.length + 1
    };

    const updated = [...services, added];
    setServices(updated);
    localStorage.setItem("code_services_catalog", JSON.stringify(updated));
    db.services.saveServices(updated).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));

    // Reset
    setNewService({
      id: "", titleAr: "", titleEn: "", descAr: "", descEn: "", categoryId: "business",
      price: "", docsAr: "", docsEn: "", completionTimeAr: "", completionTimeEn: "",
      keywordsString: "", featured: false, featuredOrder: 1, visible: true
    });
    setShowAddServiceModal(false);
  };

  const handleEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const updated = services.map((s) => (s.id === editingService.id ? editingService : s));
    setServices(updated);
    localStorage.setItem("code_services_catalog", JSON.stringify(updated));
    db.services.saveServices(updated).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
    setEditingService(null);
  };

  const deleteService = (id: string) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذه الخدمة؟" : "Delete this service?")) {
      const updated = services.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
      setServices(updated);
      localStorage.setItem("code_services_catalog", JSON.stringify(updated));
      db.services.saveServices(updated).catch(console.error);
      window.dispatchEvent(new Event("catalog_updated"));
    }
  };

  const duplicateService = (service: ServiceItem) => {
    const duplicated: ServiceItem = {
      ...service,
      id: "service-dup-" + Date.now().toString(),
      titleAr: service.titleAr + " (نسخة)",
      titleEn: service.titleEn + " (Copy)",
      order: services.length + 1,
      featured: false
    };

    const updated = [...services, duplicated];
    setServices(updated);
    localStorage.setItem("code_services_catalog", JSON.stringify(updated));
    db.services.saveServices(updated).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
  };

  // FAQs CRUD handlers
  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFAQ.qAr || !newFAQ.aAr) return;

    const added: FAQItem = {
      id: "faq-" + Date.now().toString(),
      qAr: newFAQ.qAr.trim(),
      qEn: newFAQ.qEn.trim() || newFAQ.qAr.trim(),
      aAr: newFAQ.aAr.trim(),
      aEn: newFAQ.aEn.trim() || newFAQ.aAr.trim(),
      visible: newFAQ.visible,
      order: faqs.length + 1
    };

    const updated = [...faqs, added];
    setFaqs(updated);
    localStorage.setItem("code_services_faqs", JSON.stringify(updated));
    db.faqs.saveFaqs(updated).catch(console.error);
    window.dispatchEvent(new Event("faqs_updated"));

    setNewFAQ({ qAr: "", qEn: "", aAr: "", aEn: "", visible: true });
    setShowAddFAQModal(false);
  };

  const handleEditFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ) return;

    const updated = faqs.map((f) => (f.id === editingFAQ.id ? editingFAQ : f));
    setFaqs(updated);
    localStorage.setItem("code_services_faqs", JSON.stringify(updated));
    db.faqs.saveFaqs(updated).catch(console.error);
    window.dispatchEvent(new Event("faqs_updated"));
    setEditingFAQ(null);
  };

  const deleteFAQ = (id: string) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا السؤال؟" : "Delete this FAQ?")) {
      const updated = faqs.filter((f) => f.id !== id).map((f, idx) => ({ ...f, order: idx + 1 }));
      setFaqs(updated);
      localStorage.setItem("code_services_faqs", JSON.stringify(updated));
      db.faqs.saveFaqs(updated).catch(console.error);
      window.dispatchEvent(new Event("faqs_updated"));
    }
  };

  // Announcement triggers
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("code_services_announcement", JSON.stringify(announcement));
    db.announcements.saveAnnouncement(announcement).catch(console.error);
    window.dispatchEvent(new Event("announcement_updated"));
    alert(locale === "ar" ? "تم حفظ التنبيه بنجاح!" : "Announcement saved successfully!");
  };

  // Stats save triggers
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("code_services_stats", JSON.stringify(stats));
    localStorage.setItem("code_services_featured_limit", featuredLimit.toString());
    window.dispatchEvent(new Event("stats_updated"));
    window.dispatchEvent(new Event("featured_updated"));
    alert(locale === "ar" ? "تم حفظ الإحصائيات بنجاح!" : "Statistics saved successfully!");
  };

  // HTML5 Drag and Drop Sorting for Categories
  const handleCatDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCatIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleCatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleCatDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCatIdx === null || draggedCatIdx === index) return;

    const list = [...categories];
    const [removed] = list.splice(draggedCatIdx, 1);
    list.splice(index, 0, removed);

    const reordered = list.map((cat, idx) => ({ ...cat, order: idx + 1 }));
    setCategories(reordered);
    localStorage.setItem("code_services_categories", JSON.stringify(reordered));
    db.categories.saveCategories(reordered).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
    setDraggedCatIdx(null);
  };

  const moveCat = (index: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= categories.length) return;

    const list = [...categories];
    const temp = list[index];
    list[index] = list[nextIdx];
    list[nextIdx] = temp;

    const reordered = list.map((cat, idx) => ({ ...cat, order: idx + 1 }));
    setCategories(reordered);
    localStorage.setItem("code_services_categories", JSON.stringify(reordered));
    db.categories.saveCategories(reordered).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
  };

  // HTML5 Drag and Drop Sorting for Services
  const handleServiceDragStart = (e: React.DragEvent, index: number) => {
    setDraggedServiceIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleServiceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleServiceDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedServiceIdx === null || draggedServiceIdx === index) return;

    const list = [...services];
    const [removed] = list.splice(draggedServiceIdx, 1);
    list.splice(index, 0, removed);

    const reordered = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    setServices(reordered);
    localStorage.setItem("code_services_catalog", JSON.stringify(reordered));
    db.services.saveServices(reordered).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
    setDraggedServiceIdx(null);
  };

  const moveService = (index: number, dir: "up" | "down") => {
    const nextIdx = dir === "up" ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= services.length) return;

    const list = [...services];
    const temp = list[index];
    list[index] = list[nextIdx];
    list[nextIdx] = temp;

    const reordered = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    setServices(reordered);
    localStorage.setItem("code_services_catalog", JSON.stringify(reordered));
    db.services.saveServices(reordered).catch(console.error);
    window.dispatchEvent(new Event("catalog_updated"));
  };

  // Filtering Lists
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch = 
        inq.name.toLowerCase().includes(searchInquiries.toLowerCase()) ||
        inq.phone.toLowerCase().includes(searchInquiries.toLowerCase()) ||
        inq.message.toLowerCase().includes(searchInquiries.toLowerCase()) ||
        inq.service.toLowerCase().includes(searchInquiries.toLowerCase());

      const matchStatus = statusFilter === "all" ? true : inq.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inquiries, searchInquiries, statusFilter]);

  const filteredRequestsList = useMemo(() => {
    return requests
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((req) => {
        const term = searchRequests.toLowerCase().trim();
        const matchSearch =
          req.id.toLowerCase().includes(term) ||
          req.customerName.toLowerCase().includes(term) ||
          req.customerPhone.toLowerCase().includes(term) ||
          (req.customerEmail && req.customerEmail.toLowerCase().includes(term));

        const matchStatus = requestStatusFilter === "all" ? true : req.status === requestStatusFilter;
        return matchSearch && matchStatus;
      });
  }, [requests, searchRequests, requestStatusFilter]);

  const filteredServicesList = useMemo(() => {
    return services
      .sort((a, b) => a.order - b.order)
      .filter((s) => {
        const matchSearch = 
          s.titleAr.toLowerCase().includes(searchServices.toLowerCase()) ||
          s.titleEn.toLowerCase().includes(searchServices.toLowerCase()) ||
          s.descAr.toLowerCase().includes(searchServices.toLowerCase()) ||
          s.descEn.toLowerCase().includes(searchServices.toLowerCase()) ||
          s.keywords.some(k => k.toLowerCase().includes(searchServices.toLowerCase()));

        const matchCat = categoryFilter === "all" ? true : s.categoryId === categoryFilter;
        return matchSearch && matchCat;
      });
  }, [services, searchServices, categoryFilter]);

  if (!mounted || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-gray text-gray-500 font-bold">
        <span>{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-gray text-gray-900 dark:text-gray-100 transition-colors flex flex-col font-sans select-none printing:bg-white printing:text-black">
      
      {/* Admin Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-gray/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 py-4 px-6 flex items-center justify-between shadow-sm printing:hidden">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-xl border border-primary/10"
          />
          <div>
            <h1 className="text-lg font-black text-primary dark:text-primary-light">
              {locale === "ar" ? "لوحة الإدارة | كود خدمات" : "Admin Panel | Code Services"}
            </h1>
            <span className="text-xxs text-gray-400 font-bold">
              {locale === "ar" ? "تحكم كامل بالموقع بدون أكواد" : "Control website dynamically without code"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gray-100 dark:bg-medium-gray text-gray-600 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Lang switcher */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl bg-gray-100 dark:bg-medium-gray text-gray-600 dark:text-gray-300 hover:bg-gray-200 cursor-pointer flex items-center gap-1.5 font-bold text-xs"
          >
            <Globe size={16} />
            <span>{locale === "ar" ? "English" : "عربي"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs"
            title="Log Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{locale === "ar" ? "تسجيل خروج" : "Log Out"}</span>
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-8 printing:p-0">
        
        {/* Statistics Summary Widgets row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 printing:hidden">
          {/* Pending Inquiries */}
          <div className="glass p-5 rounded-2xl border border-primary/5 shadow-sm text-start flex items-center justify-between">
            <div>
              <span className="text-xxs font-black text-gray-400 uppercase">
                {locale === "ar" ? "الطلبات المعلقة" : "Pending Requests"}
              </span>
              <h3 className="text-2xl font-black mt-1 text-primary dark:text-primary-light">
                {requests.filter((r) => r.status === "pending").length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-primary-light flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          {/* Total Requests */}
          <div className="glass p-5 rounded-2xl border border-primary/5 shadow-sm text-start flex items-center justify-between">
            <div>
              <span className="text-xxs font-black text-gray-400 uppercase">
                {locale === "ar" ? "إجمالي الطلبات" : "Total Requests"}
              </span>
              <h3 className="text-2xl font-black mt-1">
                {requests.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
          </div>

          {/* Total Categories */}
          <div className="glass p-5 rounded-2xl border border-primary/5 shadow-sm text-start flex items-center justify-between">
            <div>
              <span className="text-xxs font-black text-gray-400 uppercase">
                {locale === "ar" ? "أقسام الخدمات" : "Total Categories"}
              </span>
              <h3 className="text-2xl font-black mt-1">
                {categories.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Layers size={20} />
            </div>
          </div>

          {/* Total Services */}
          <div className="glass p-5 rounded-2xl border border-primary/5 shadow-sm text-start flex items-center justify-between">
            <div>
              <span className="text-xxs font-black text-gray-400 uppercase">
                {locale === "ar" ? "الخدمات بالكتالوج" : "Total Services"}
              </span>
              <h3 className="text-2xl font-black mt-1">
                {services.length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Tab Selector Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-200 dark:border-white/5 scrollbar-none select-none printing:hidden">
          {[
            { id: "requests", labelAr: "🛒 طلبات الخدمات", labelEn: "🛒 Service Requests", icon: <ShoppingCart size={15} /> },
            { id: "inquiries", labelAr: "📨 رسائل الاتصال", labelEn: "📨 Contact Messages", icon: <Inbox size={15} /> },
            { id: "categories", labelAr: "📁 إدارة الأقسام", labelEn: "📁 Categories CRUD", icon: <Layers size={15} /> },
            { id: "services", labelAr: "🛠️ إدارة الخدمات", labelEn: "🛠️ Services Catalog", icon: <Settings size={15} /> },
            { id: "announcements", labelAr: "📢 شريط الإعلانات", labelEn: "📢 Announcements", icon: <Megaphone size={15} /> },
            { id: "faqs", labelAr: "❓ الأسئلة الشائعة", labelEn: "❓ FAQs Manager", icon: <HelpCircle size={15} /> },
            { id: "stats", labelAr: "📊 إحصائيات وعدادات", labelEn: "📊 Statistics/Counters", icon: <BarChart size={15} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-gray-100 dark:bg-medium-gray/30 dark:hover:bg-primary/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              {tab.icon}
              <span>{locale === "ar" ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </div>

        {/* TAB WORKSPACE */}
        <div className="flex-grow">
          
          {/* TAB: Requests Panel */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {/* Header actions & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 printing:hidden select-none">
                <div className="relative w-full sm:max-w-xs">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder={locale === "ar" ? "ابحث بالرقم، الاسم، الجوال..." : "Search ID, name, phone..."}
                    value={searchRequests}
                    onChange={(e) => setSearchRequests(e.target.value)}
                    className="w-full ps-9 pe-3 py-2 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={requestStatusFilter}
                    onChange={(e) => setRequestStatusFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                  >
                    <option value="all">{locale === "ar" ? "جميع الحالات" : "All Status"}</option>
                    <option value="pending">{locale === "ar" ? "معلق" : "Pending"}</option>
                    <option value="in_progress">{locale === "ar" ? "قيد الإنجاز" : "In Progress"}</option>
                    <option value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</option>
                    <option value="cancelled">{locale === "ar" ? "ملغي" : "Cancelled"}</option>
                  </select>

                  <button
                    onClick={exportRequestsToCSV}
                    className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
                    title="Export CSV"
                  >
                    <Download size={15} />
                    <span className="hidden md:inline">{locale === "ar" ? "تصدير Excel" : "Export CSV"}</span>
                  </button>

                  <button
                    onClick={triggerPrintPDF}
                    className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Print / PDF"
                  >
                    <Printer size={15} />
                    <span className="hidden md:inline">{locale === "ar" ? "طباعة PDF" : "Print PDF"}</span>
                  </button>
                </div>
              </div>

              {/* Requests Table */}
              <div className="glass rounded-2xl border border-primary/5 shadow-sm overflow-hidden text-start">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-medium-gray/30 text-gray-500 dark:text-gray-400 font-bold select-none border-b border-gray-100 dark:border-border-dark">
                      <tr>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider">{locale === "ar" ? "رقم الطلب" : "Request ID"}</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider">{locale === "ar" ? "العميل" : "Customer"}</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider">{locale === "ar" ? "الجوال" : "Phone"}</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider">{locale === "ar" ? "الخدمات المطلوبة" : "Services"}</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider">{locale === "ar" ? "التاريخ" : "Date"}</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider">{locale === "ar" ? "الحالة" : "Status"}</th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider printing:hidden">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-border-dark">
                      {filteredRequestsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-semibold">
                            {locale === "ar" ? "لا توجد طلبات مطابقة للبحث." : "No requests found."}
                          </td>
                        </tr>
                      ) : (
                        filteredRequestsList.map((req) => {
                          const statusColors = 
                            req.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                            req.status === "in_progress" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                            req.status === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            "bg-red-500/10 text-red-600 dark:text-red-400";

                          const statusLabel = 
                            req.status === "pending" ? (locale === "ar" ? "معلق" : "Pending") :
                            req.status === "in_progress" ? (locale === "ar" ? "قيد الإنجاز" : "In Progress") :
                            req.status === "completed" ? (locale === "ar" ? "مكتمل" : "Completed") :
                            (locale === "ar" ? "ملغي" : "Cancelled");

                          return (
                            <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-medium-gray/10 transition-colors font-medium">
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-primary dark:text-primary-light">
                                {req.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{req.customerName}</div>
                                {req.customerEmail && (
                                  <div className="text-xxs text-gray-400">{req.customerEmail}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-mono select-all">
                                {req.customerPhone}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {req.services.map((s: any) => (
                                    <span 
                                      key={s.id}
                                      className="px-2 py-0.5 rounded bg-primary/5 border border-primary/10 text-xxs font-semibold"
                                    >
                                      {locale === "ar" ? s.titleAr : s.titleEn} (x{s.quantity || 1})
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                {req.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-lg text-xxs font-black ${statusColors}`}>
                                  {statusLabel}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs font-bold space-x-1 space-x-reverse printing:hidden">
                                <button
                                  onClick={() => setSelectedRequest(req)}
                                  className="text-primary hover:underline px-1 cursor-pointer"
                                >
                                  {locale === "ar" ? "تفاصيل" : "Details"}
                                </button>
                                <button
                                  onClick={() => deleteRequest(req.id)}
                                  className="text-red-500 hover:underline px-1 cursor-pointer"
                                >
                                  {locale === "ar" ? "حذف" : "Delete"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Inquiries Panel */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              
              {/* Header actions & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 printing:hidden select-none">
                <div className="relative w-full sm:max-w-xs">
                  <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder={locale === "ar" ? "ابحث بالاسم، الجوال..." : "Search name, phone..."}
                    value={searchInquiries}
                    onChange={(e) => setSearchInquiries(e.target.value)}
                    className="w-full ps-9 pe-3 py-2 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                  >
                    <option value="all">{locale === "ar" ? "جميع الحالات" : "All Status"}</option>
                    <option value="pending">{locale === "ar" ? "معلق" : "Pending"}</option>
                    <option value="completed">{locale === "ar" ? "مكتمل" : "Completed"}</option>
                  </select>

                  <button
                    onClick={exportToCSV}
                    className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
                    title="Export CSV"
                  >
                    <Download size={16} />
                    <span className="hidden md:inline">{locale === "ar" ? "تصدير Excel" : "Export CSV"}</span>
                  </button>

                  <button
                    onClick={triggerPrintPDF}
                    className="p-2.5 rounded-xl bg-primary/10 text-primary dark:text-primary-light hover:bg-primary hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Print / PDF"
                  >
                    <Printer size={16} />
                    <span className="hidden md:inline">{locale === "ar" ? "طباعة / PDF" : "Print / PDF"}</span>
                  </button>
                </div>
              </div>

              {/* Table of Inquiries */}
              <div className="glass rounded-3xl border border-primary/5 overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100/50 dark:bg-medium-gray/20 border-b border-gray-100 dark:border-white/5 font-extrabold text-gray-500 uppercase tracking-wider select-none">
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "العميل والاتصال" : "Client Info"}</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "الخدمة / الموعد" : "Service / Booking"}</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "تفاصيل الرسالة" : "Message Detail"}</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "التاريخ" : "Submitted"}</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                        <th className="px-5 py-4 text-center printing:hidden">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-12 text-center text-gray-400 font-bold">
                            {locale === "ar" ? "لا توجد استفسارات مطابقة للفلترة." : "No inquiries match filters."}
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-gray-50/50 dark:hover:bg-medium-gray/10 transition-colors">
                            {/* Client */}
                            <td className="px-5 py-4">
                              <div className="font-extrabold text-gray-900 dark:text-white">{inq.name}</div>
                              <div className="text-xxs text-gray-400 mt-0.5">{inq.phone}</div>
                              {inq.email && <div className="text-xxs text-gray-505">{inq.email}</div>}
                            </td>

                            {/* Service & Booking */}
                            <td className="px-5 py-4">
                              <span className="px-2 py-0.5 rounded bg-primary/15 text-primary dark:text-primary-light font-black text-xxs inline-block mb-1.5 uppercase">
                                {categories.find(c => c.id === inq.service)?.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim() || inq.service}
                              </span>
                              {inq.appointmentDate && (
                                <div className="text-xxs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                                  <span>📅 {inq.appointmentDate}</span>
                                  {inq.appointmentTime && <span>({inq.appointmentTime})</span>}
                                </div>
                              )}
                            </td>

                            {/* Message */}
                            <td className="px-5 py-4 max-w-xs sm:max-w-md">
                              <p className="whitespace-pre-wrap leading-relaxed font-semibold text-gray-700 dark:text-gray-300">
                                {inq.message}
                              </p>
                            </td>

                            {/* Submission Date */}
                            <td className="px-5 py-4 text-gray-505 font-bold whitespace-nowrap">
                              {inq.date}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <button
                                onClick={() => toggleInquiryStatus(inq.id)}
                                className={`px-2.5 py-1 rounded-full text-xxs font-black flex items-center gap-1 cursor-pointer transition-colors printing:bg-transparent ${
                                  inq.status === "completed"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {inq.status === "completed" ? (
                                  <>
                                    <CheckCircle size={10} />
                                    <span>{locale === "ar" ? "مكتمل" : "Completed"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={10} />
                                    <span>{locale === "ar" ? "معلق" : "Pending"}</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 text-center whitespace-nowrap printing:hidden select-none">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* Call */}
                                <a
                                  href={`tel:${inq.phone}`}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary hover:text-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                                  title="Call Client"
                                >
                                  <Phone size={14} />
                                </a>

                                {/* WhatsApp */}
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/^0/, "966")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-500 hover:text-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                                  title="Reply via WhatsApp"
                                >
                                  <MessageSquare size={14} />
                                </a>

                                {/* Delete */}
                                <button
                                  onClick={() => deleteInquiry(inq.id)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-medium-gray text-red-500 dark:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                                  title="Delete Inq"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Categories Manager */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              
              {/* Header Action */}
              <div className="flex justify-between items-center select-none">
                <h3 className="text-lg font-black">
                  {locale === "ar" ? "أقسام وتصنيفات الخدمات" : "Services Categories"}
                </h3>
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>{locale === "ar" ? "إضافة قسم جديد" : "Create Category"}</span>
                </button>
              </div>

              {/* Notice */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-2.5 text-xs text-primary dark:text-primary-light font-bold select-none text-start">
                <Info size={18} className="flex-shrink-0" />
                <p>
                  {locale === "ar" 
                    ? "إرشادات: يمكنك إعادة ترتيب الأقسام على القائمة الرئيسية للموقع بسحب الكروت وإسقاطها (Drag & Drop) أو استخدام الأسهم التوضيحية."
                    : "Tip: Drag and drop cards to reorder categories dynamically, or use helper arrows."}
                </p>
              </div>

              {/* Grid of Categories (Drag and Drop enabled) */}
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                onDragOver={handleCatDragOver}
              >
                {categories.map((cat, index) => {
                  const servicesCount = services.filter(s => s.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={(e) => handleCatDragStart(e, index)}
                      onDrop={(e) => handleCatDrop(e, index)}
                      className="glass p-6 rounded-3xl border border-primary/5 dark:border-white/5 shadow-md flex flex-col justify-between text-start cursor-move select-none relative group hover:border-primary/20 transition-all"
                    >
                      <div>
                        {/* Drag Handle & Ordering controls */}
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-white/5 pb-2">
                          <span className="text-xxs font-black text-gray-400">
                            ID: {cat.id}
                          </span>
                          
                          {/* Ordering helpers */}
                          <div className="flex items-center gap-1">
                            <button
                              disabled={index === 0}
                              onClick={() => moveCat(index, "up")}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray disabled:opacity-30 cursor-pointer text-gray-505"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              disabled={index === categories.length - 1}
                              onClick={() => moveCat(index, "down")}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray disabled:opacity-30 cursor-pointer text-gray-550"
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Title and details */}
                        <h4 className="text-lg font-black text-gray-900 dark:text-white flex items-center justify-between">
                          <span>{locale === "ar" ? cat.nameAr : cat.nameEn}</span>
                          <span className="text-xxs font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-light">
                            {servicesCount} {locale === "ar" ? "خدمات" : "Services"}
                          </span>
                        </h4>
                        
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                          {locale === "ar" ? cat.descAr : cat.descEn}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        {/* Visibility check */}
                        <span className={`text-xxs font-black px-2 py-0.5 rounded ${
                          cat.visible ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"
                        }`}>
                          {cat.visible ? (locale === "ar" ? "نشط ومكشوف" : "Visible") : (locale === "ar" ? "مخفي" : "Hidden")}
                        </span>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary hover:text-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit3 size={14} />
                          </button>
                          
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-medium-gray text-red-500 dark:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: Services Catalog Manager */}
          {activeTab === "services" && (
            <div className="space-y-6">
              
              {/* Header and filters row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-2 w-full md:max-w-md">
                  {/* Search */}
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder={locale === "ar" ? "ابحث باسم الخدمة..." : "Search service title..."}
                      value={searchServices}
                      onChange={(e) => setSearchServices(e.target.value)}
                      className="w-full ps-9 py-2 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold"
                    />
                  </div>

                  {/* Filter by Category */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="py-2 px-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                  >
                    <option value="all">{locale === "ar" ? "جميع الأقسام" : "All Categories"}</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                >
                  <Plus size={16} />
                  <span>{locale === "ar" ? "إضافة خدمة جديدة" : "Create Service"}</span>
                </button>
              </div>

              {/* Notice */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-2.5 text-xs text-primary dark:text-primary-light font-bold select-none text-start">
                <Info size={18} className="flex-shrink-0" />
                <p>
                  {locale === "ar"
                    ? "إرشادات: يمكنك التحكم بوضع الخدمة المميزة (Featured) والتحكم بترتيب عرضها لكي تظهر في واجهة الموقع الأكثر شعبية مباشرة."
                    : "Tip: Mark any service as Featured to showcase it dynamically on the homepage."}
                </p>
              </div>

              {/* Table list of Services */}
              <div 
                className="glass rounded-3xl border border-primary/5 overflow-hidden shadow-md"
                onDragOver={handleCatDragOver}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100/50 dark:bg-medium-gray/20 border-b border-gray-100 dark:border-white/5 font-extrabold text-gray-505 uppercase tracking-wider select-none">
                        <th className="px-5 py-4 text-center w-12">#</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "الخدمة" : "Service Details"}</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "القسم" : "Category"}</th>
                        <th className="px-5 py-4 text-start">{locale === "ar" ? "الرسوم" : "Price"}</th>
                        <th className="px-5 py-4 text-center">{locale === "ar" ? "مميز؟" : "Featured"}</th>
                        <th className="px-5 py-4 text-center">{locale === "ar" ? "الحالة" : "Visibility"}</th>
                        <th className="px-5 py-4 text-center">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                      {filteredServicesList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-gray-400 font-bold">
                            {locale === "ar" ? "لا توجد خدمات مطابقة." : "No services found."}
                          </td>
                        </tr>
                      ) : (
                        filteredServicesList.map((service, index) => {
                          const categoryName = categories.find(c => c.id === service.categoryId)?.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim() || service.categoryId;
                          return (
                            <tr
                              key={service.id}
                              draggable
                              onDragStart={(e) => handleServiceDragStart(e, index)}
                              onDrop={(e) => handleServiceDrop(e, index)}
                              className="hover:bg-gray-50/50 dark:hover:bg-medium-gray/10 transition-colors cursor-move"
                            >
                              {/* Order & Manual helpers */}
                              <td className="px-5 py-4 text-center select-none">
                                <div className="flex flex-col items-center gap-0.5">
                                  <button
                                    disabled={index === 0}
                                    onClick={() => moveService(index, "up")}
                                    className="p-0.5 rounded bg-gray-100 dark:bg-medium-gray text-gray-500 disabled:opacity-20 cursor-pointer"
                                  >
                                    <ChevronUp size={10} />
                                  </button>
                                  <span className="font-extrabold text-gray-400 text-xxs">
                                    {index + 1}
                                  </span>
                                  <button
                                    disabled={index === filteredServicesList.length - 1}
                                    onClick={() => moveService(index, "down")}
                                    className="p-0.5 rounded bg-gray-100 dark:bg-medium-gray text-gray-500 disabled:opacity-20 cursor-pointer"
                                  >
                                    <ChevronDown size={10} />
                                  </button>
                                </div>
                              </td>

                              {/* Service Title */}
                              <td className="px-5 py-4">
                                <div className="font-extrabold text-gray-900 dark:text-white">
                                  {service.titleAr}
                                </div>
                                <div className="text-xxs text-gray-400 mt-0.5">
                                  {service.titleEn}
                                </div>
                              </td>

                              {/* Category */}
                              <td className="px-5 py-4 font-bold text-gray-500">
                                {categoryName}
                              </td>

                              {/* Price */}
                              <td className="px-5 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                                {service.price || (locale === "ar" ? "حسب المعاملة" : "Variable")}
                              </td>

                              {/* Featured Status checkbox toggle inline */}
                              <td className="px-5 py-4 text-center select-none">
                                <button
                                  onClick={() => {
                                    const updated = services.map(s => s.id === service.id ? { ...s, featured: !s.featured } : s);
                                    setServices(updated);
                                    localStorage.setItem("code_services_catalog", JSON.stringify(updated));
                                    db.services.saveServices(updated).catch(console.error);
                                    window.dispatchEvent(new Event("catalog_updated"));
                                  }}
                                  className={`px-2 py-0.5 rounded-full text-xxs font-black cursor-pointer ${
                                    service.featured 
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      : "bg-gray-100 text-gray-400 dark:bg-medium-gray/40 dark:text-gray-500"
                                  }`}
                                >
                                  {service.featured ? (locale === "ar" ? "مميز ★" : "Featured ★") : (locale === "ar" ? "عادي" : "Standard")}
                                </button>
                              </td>

                              {/* Visibility */}
                              <td className="px-5 py-4 text-center select-none">
                                <button
                                  onClick={() => {
                                    const updated = services.map(s => s.id === service.id ? { ...s, visible: !s.visible } : s);
                                    setServices(updated);
                                    localStorage.setItem("code_services_catalog", JSON.stringify(updated));
                                    db.services.saveServices(updated).catch(console.error);
                                    window.dispatchEvent(new Event("catalog_updated"));
                                  }}
                                  className={`px-2 py-0.5 rounded text-xxs font-black cursor-pointer ${
                                    service.visible 
                                      ? "bg-emerald-500/10 text-emerald-600"
                                      : "bg-red-500/10 text-red-500"
                                  }`}
                                >
                                  {service.visible ? (locale === "ar" ? "مكشوف" : "Visible") : (locale === "ar" ? "مخفي" : "Hidden")}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4 text-center select-none whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Duplicate */}
                                  <button
                                    onClick={() => duplicateService(service)}
                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-500 hover:text-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                                    title="Duplicate Service"
                                  >
                                    <Copy size={13} />
                                  </button>

                                  {/* Edit */}
                                  <button
                                    onClick={() => setEditingService(service)}
                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary hover:text-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                                    title="Edit Service"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  
                                  {/* Delete */}
                                  <button
                                    onClick={() => deleteService(service.id)}
                                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-medium-gray text-red-500 dark:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                                    title="Delete Service"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Announcement Manager */}
          {activeTab === "announcements" && (
            <div className="max-w-2xl mx-auto glass p-6 sm:p-10 rounded-3xl border border-primary/10 shadow-lg text-start">
              <h3 className="text-xl font-black mb-6">
                {locale === "ar" ? "شريط الإعلانات أعلى الموقع" : "Top Banner Announcements"}
              </h3>
              
              <form onSubmit={handleSaveAnnouncement} className="space-y-6">
                
                {/* Active Toggle */}
                <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl">
                  <div>
                    <h4 className="font-extrabold text-sm">{locale === "ar" ? "تفعيل الشريط الإعلاني" : "Publish Announcement Bar"}</h4>
                    <p className="text-xxs text-gray-400">{locale === "ar" ? "إظهار أو إخفاء الإعلان أعلى الموقع فوراً" : "Show or hide announcement bar on top of homepage"}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={announcement.active}
                    onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                </div>

                {/* Announcement text Arabic */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    {locale === "ar" ? "نص الإعلان (بالعربية)" : "Announcement Text (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={announcement.textAr}
                    onChange={(e) => setAnnouncement({ ...announcement, textAr: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-semibold"
                  />
                </div>

                {/* Announcement text English */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    {locale === "ar" ? "نص الإعلان (بالانجليزية)" : "Announcement Text (English)"}
                  </label>
                  <input
                    type="text"
                    value={announcement.textEn}
                    onChange={(e) => setAnnouncement({ ...announcement, textEn: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-semibold"
                  />
                </div>

                {/* Bg color select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    {locale === "ar" ? "لون شريط الإعلان" : "Banner Color Theme"}
                  </label>
                  <div className="flex flex-wrap gap-2 select-none">
                    {[
                      { id: "bg-primary", nameAr: "البنفسجي كود", nameEn: "Purple" },
                      { id: "bg-emerald-600", nameAr: "الأخضر الزمردي", nameEn: "Emerald Green" },
                      { id: "bg-amber-600", nameAr: "البرتقالي الكهرماني", nameEn: "Amber Orange" },
                      { id: "bg-slate-800", nameAr: "الرمادي الداكن", nameEn: "Charcoal Slate" }
                    ].map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setAnnouncement({ ...announcement, bgColor: col.id })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          announcement.bgColor === col.id
                            ? "bg-primary text-white border-primary"
                            : "bg-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 border-gray-200 dark:border-border-dark"
                        }`}
                      >
                        {locale === "ar" ? col.nameAr : col.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>

              </form>
            </div>
          )}

          {/* TAB 5: FAQ Manager */}
          {activeTab === "faqs" && (
            <div className="space-y-6">
              
              {/* Header Action */}
              <div className="flex justify-between items-center select-none">
                <h3 className="text-lg font-black">
                  {locale === "ar" ? "إدارة الأسئلة الشائعة" : "FAQ Manager"}
                </h3>
                <button
                  onClick={() => setShowAddFAQModal(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>{locale === "ar" ? "إضافة سؤال وجواب" : "Add FAQ Item"}</span>
                </button>
              </div>

              {/* List of FAQs */}
              <div className="grid grid-cols-1 gap-4 text-start">
                {faqs.sort((a,b)=>a.order - b.order).map((faq, index) => (
                  <div
                    key={faq.id}
                    className="glass p-5 rounded-2xl border border-primary/5 dark:border-white/5 shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {/* Question */}
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                          AR: {faq.qAr}
                        </h4>
                        <h4 className="font-semibold text-xs text-gray-505 dark:text-gray-400 mt-0.5">
                          EN: {faq.qEn}
                        </h4>

                        {/* Answer */}
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 leading-relaxed font-medium bg-gray-50 dark:bg-medium-gray/20 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                          {faq.aAr}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 select-none">
                        {/* Move indicators */}
                        <div className="flex gap-1">
                          <button
                            disabled={index === 0}
                            onClick={() => {
                              const list = [...faqs];
                              const temp = list[index];
                              list[index] = list[index-1];
                              list[index-1] = temp;
                              const reorder = list.map((f, i) => ({ ...f, order: i + 1 }));
                              setFaqs(reorder);
                              localStorage.setItem("code_services_faqs", JSON.stringify(reorder));
                              db.faqs.saveFaqs(reorder).catch(console.error);
                              window.dispatchEvent(new Event("faqs_updated"));
                            }}
                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray disabled:opacity-20 cursor-pointer text-gray-505"
                          >
                            <ChevronUp size={12} />
                          </button>
                          
                          <button
                            disabled={index === faqs.length - 1}
                            onClick={() => {
                              const list = [...faqs];
                              const temp = list[index];
                              list[index] = list[index+1];
                              list[index+1] = temp;
                              const reorder = list.map((f, i) => ({ ...f, order: i + 1 }));
                              setFaqs(reorder);
                              localStorage.setItem("code_services_faqs", JSON.stringify(reorder));
                              db.faqs.saveFaqs(reorder).catch(console.error);
                              window.dispatchEvent(new Event("faqs_updated"));
                            }}
                            className="p-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray disabled:opacity-20 cursor-pointer text-gray-550"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>

                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => setEditingFAQ(faq)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary hover:text-white dark:bg-medium-gray text-gray-600 dark:text-gray-300 transition-colors flex items-center justify-center cursor-pointer"
                            title="Edit FAQ"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => deleteFAQ(faq.id)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-500 hover:text-white dark:bg-medium-gray text-red-500 dark:text-red-400 transition-colors flex items-center justify-center cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 6: Statistics & Configurations Manager */}
          {activeTab === "stats" && (
            <div className="max-w-2xl mx-auto glass p-6 sm:p-10 rounded-3xl border border-primary/10 shadow-lg text-start">
              <h3 className="text-xl font-black mb-6">
                {locale === "ar" ? "أرقام وإحصائيات مكتب كود" : "Code Office Statistics Configuration"}
              </h3>

              <form onSubmit={handleSaveStats} className="space-y-6">
                
                {/* Stats widgets input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Completed Services */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
                      {locale === "ar" ? "المعاملات المنجزة (مثال: +5000)" : "Completed Services (e.g. +5000)"}
                    </label>
                    <input
                      type="text"
                      value={stats.completedServices}
                      onChange={(e) => setStats({ ...stats, completedServices: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-semibold"
                    />
                  </div>

                  {/* Available Services */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
                      {locale === "ar" ? "الخدمات المتوفرة (مثال: +100)" : "Available Services (e.g. +100)"}
                    </label>
                    <input
                      type="text"
                      value={stats.availableServices}
                      onChange={(e) => setStats({ ...stats, availableServices: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-semibold"
                    />
                  </div>

                  {/* Google Reviews */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
                      {locale === "ar" ? "تقييمات جوجل (مثال: +18)" : "Google Reviews (e.g. +18)"}
                    </label>
                    <input
                      type="text"
                      value={stats.googleReviews}
                      onChange={(e) => setStats({ ...stats, googleReviews: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-semibold"
                    />
                  </div>

                  {/* Google Rating */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
                      {locale === "ar" ? "معدل التقييم (مثال: ★4.9)" : "Google Rating (e.g. 4.9★)"}
                    </label>
                    <input
                      type="text"
                      value={stats.googleRating}
                      onChange={(e) => setStats({ ...stats, googleRating: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Featured limit config */}
                <div className="border-t border-gray-100 dark:border-white/5 pt-6">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    {locale === "ar" ? "الحد الأقصى للخدمات المميزة في الصفحة الرئيسية" : "Max Featured Services on Homepage"}
                  </label>
                  <select
                    value={featuredLimit}
                    onChange={(e) => setFeaturedLimit(parseInt(e.target.value))}
                    className="py-3 px-4 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-sm font-extrabold cursor-pointer"
                  >
                    {[3, 4, 6, 8, 9, 12].map(n => (
                      <option key={n} value={n}>{n} {locale === "ar" ? "خدمات" : "Services"}</option>
                    ))}
                  </select>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>

              </form>
            </div>
          )}

        </div>

      </div>

      {/* --- CRUD MODALS WRAPPER --- */}

      {/* MODAL 1: ADD CATEGORY */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5 mb-6">
                <h3 className="text-lg font-black">{locale === "ar" ? "إضافة قسم جديد" : "Create Category"}</h3>
                <button onClick={() => setShowAddCategoryModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">ID (معرف فريد بالانجليزية)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. visas"
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الاسم بالعربية</label>
                    <input
                      type="text"
                      required
                      value={newCategory.nameAr}
                      onChange={(e) => setNewCategory({ ...newCategory, nameAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الاسم بالانجليزية</label>
                    <input
                      type="text"
                      required
                      value={newCategory.nameEn}
                      onChange={(e) => setNewCategory({ ...newCategory, nameEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف بالعربية</label>
                  <textarea
                    rows={2}
                    value={newCategory.descAr}
                    onChange={(e) => setNewCategory({ ...newCategory, descAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف بالانجليزية</label>
                  <textarea
                    rows={2}
                    value={newCategory.descEn}
                    onChange={(e) => setNewCategory({ ...newCategory, descEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">اسم الأيقونة (من مكتبة Lucide)</label>
                  <select
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                  >
                    {["Briefcase", "UserCheck", "Users", "Settings", "GraduationCap", "Printer", "ShieldCheck", "FileText", "DollarSign", "MapPin"].map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={newCategory.visible}
                    onChange={(e) => setNewCategory({ ...newCategory, visible: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">ظهور هذا القسم في الموقع</span>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md transition-colors cursor-pointer">
                  {locale === "ar" ? "تأكيد الإضافة" : "Confirm Create"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT CATEGORY */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5 mb-6">
                <h3 className="text-lg font-black">{locale === "ar" ? "تعديل القسم" : "Edit Category"}</h3>
                <button onClick={() => setEditingCategory(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الاسم بالعربية</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.nameAr}
                      onChange={(e) => setEditingCategory({ ...editingCategory, nameAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الاسم بالانجليزية</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.nameEn}
                      onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف بالعربية</label>
                  <textarea
                    rows={2}
                    value={editingCategory.descAr}
                    onChange={(e) => setEditingCategory({ ...editingCategory, descAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف بالانجليزية</label>
                  <textarea
                    rows={2}
                    value={editingCategory.descEn}
                    onChange={(e) => setEditingCategory({ ...editingCategory, descEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">اسم الأيقونة</label>
                  <select
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                  >
                    {["Briefcase", "UserCheck", "Users", "Settings", "GraduationCap", "Printer", "ShieldCheck", "FileText", "DollarSign", "MapPin"].map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={editingCategory.visible}
                    onChange={(e) => setEditingCategory({ ...editingCategory, visible: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">ظهور هذا القسم في الموقع</span>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md transition-colors cursor-pointer">
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: ADD SERVICE */}
      <AnimatePresence>
        {showAddServiceModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5 mb-4 flex-shrink-0">
                <h3 className="text-lg font-black">{locale === "ar" ? "إضافة خدمة جديدة" : "Add Service"}</h3>
                <button onClick={() => setShowAddServiceModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-4 overflow-y-auto pr-1 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category map */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">القسم / التصنيف</label>
                    <select
                      value={newService.categoryId}
                      onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الرسوم والأسعار (أدخل الرقم فقط أو اتركه فارغاً)</label>
                    <input
                      type="text"
                      placeholder="e.g. 150 ريال"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">عنوان الخدمة بالعربية</label>
                    <input
                      type="text"
                      required
                      value={newService.titleAr}
                      onChange={(e) => setNewService({ ...newService, titleAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>

                  {/* Title En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">عنوان الخدمة بالانجليزية</label>
                    <input
                      type="text"
                      required
                      value={newService.titleEn}
                      onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Desc Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف والتعريف (بالعربية)</label>
                    <textarea
                      rows={2}
                      required
                      value={newService.descAr}
                      onChange={(e) => setNewService({ ...newService, descAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>

                  {/* Desc En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف والتعريف (بالانجليزية)</label>
                    <textarea
                      rows={2}
                      required
                      value={newService.descEn}
                      onChange={(e) => setNewService({ ...newService, descEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Docs Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">المستندات المطلوبة (بالعربية)</label>
                    <textarea
                      rows={2}
                      value={newService.docsAr}
                      onChange={(e) => setNewService({ ...newService, docsAr: e.target.value })}
                      placeholder="رقم الهوية الوطنية، فحص طبي..."
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>

                  {/* Docs En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">المستندات المطلوبة (بالانجليزية)</label>
                    <textarea
                      rows={2}
                      value={newService.docsEn}
                      onChange={(e) => setNewService({ ...newService, docsEn: e.target.value })}
                      placeholder="National ID Card, Medical test results..."
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Completion Time Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">مدة الإنجاز بالعربية</label>
                    <input
                      type="text"
                      placeholder="e.g. يوم عمل واحد / فوري"
                      value={newService.completionTimeAr}
                      onChange={(e) => setNewService({ ...newService, completionTimeAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>

                  {/* Completion Time En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">مدة الإنجاز بالانجليزية</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 working day / Instant"
                      value={newService.completionTimeEn}
                      onChange={(e) => setNewService({ ...newService, completionTimeEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Keywords helper */}
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الكلمات الدلالية المساعدة للبحث (افصل بينها بفاصلة)</label>
                  <input
                    type="text"
                    placeholder="سجل، تأسيس، شركة، رخصة، absher, license"
                    value={newService.keywordsString}
                    onChange={(e) => setNewService({ ...newService, keywordsString: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 select-none bg-gray-50 dark:bg-medium-gray/25 p-3 rounded-xl">
                  {/* Featured toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newService.featured}
                      onChange={(e) => setNewService({ ...newService, featured: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-primary"
                    />
                    <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">تمييز الخدمة في الرئيسية</span>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newService.visible}
                      onChange={(e) => setNewService({ ...newService, visible: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-primary"
                    />
                    <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">ظهور الخدمة بالموقع</span>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md transition-colors cursor-pointer select-none">
                  {locale === "ar" ? "تأكيد الإضافة" : "Confirm Add"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: EDIT SERVICE */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5 mb-4 flex-shrink-0">
                <h3 className="text-lg font-black">{locale === "ar" ? "تعديل الخدمة" : "Edit Service"}</h3>
                <button onClick={() => setEditingService(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditService} className="space-y-4 overflow-y-auto pr-1 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category map */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">القسم / التصنيف</label>
                    <select
                      value={editingService.categoryId}
                      onChange={(e) => setEditingService({ ...editingService, categoryId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-bold cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الرسوم والأسعار</label>
                    <input
                      type="text"
                      value={editingService.price || ""}
                      onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">عنوان الخدمة بالعربية</label>
                    <input
                      type="text"
                      required
                      value={editingService.titleAr}
                      onChange={(e) => setEditingService({ ...editingService, titleAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>

                  {/* Title En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">عنوان الخدمة بالانجليزية</label>
                    <input
                      type="text"
                      required
                      value={editingService.titleEn}
                      onChange={(e) => setEditingService({ ...editingService, titleEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Desc Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف والتعريف (بالعربية)</label>
                    <textarea
                      rows={2}
                      required
                      value={editingService.descAr}
                      onChange={(e) => setEditingService({ ...editingService, descAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>

                  {/* Desc En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">الوصف والتعريف (بالانجليزية)</label>
                    <textarea
                      rows={2}
                      required
                      value={editingService.descEn}
                      onChange={(e) => setEditingService({ ...editingService, descEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Docs Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">المستندات المطلوبة (بالعربية)</label>
                    <textarea
                      rows={2}
                      value={editingService.docsAr || ""}
                      onChange={(e) => setEditingService({ ...editingService, docsAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>

                  {/* Docs En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">المستندات المطلوبة (بالانجليزية)</label>
                    <textarea
                      rows={2}
                      value={editingService.docsEn || ""}
                      onChange={(e) => setEditingService({ ...editingService, docsEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Completion Time Ar */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">مدة الإنجاز بالعربية</label>
                    <input
                      type="text"
                      value={editingService.completionTimeAr || ""}
                      onChange={(e) => setEditingService({ ...editingService, completionTimeAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>

                  {/* Completion Time En */}
                  <div>
                    <label className="block text-xxs font-bold text-gray-400 mb-1">مدة الإنجاز بالانجليزية</label>
                    <input
                      type="text"
                      value={editingService.completionTimeEn || ""}
                      onChange={(e) => setEditingService({ ...editingService, completionTimeEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الكلمات الدلالية المساعدة (افصل بينها بفاصلة)</label>
                  <input
                    type="text"
                    value={editingService.keywords.join(", ")}
                    onChange={(e) => setEditingService({ ...editingService, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 select-none bg-gray-50 dark:bg-medium-gray/25 p-3 rounded-xl">
                  {/* Featured toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingService.featured}
                      onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-primary"
                    />
                    <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">تمييز الخدمة في الرئيسية</span>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingService.visible}
                      onChange={(e) => setEditingService({ ...editingService, visible: e.target.checked })}
                      className="w-4 h-4 cursor-pointer accent-primary"
                    />
                    <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">ظهور الخدمة بالموقع</span>
                  </div>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md transition-colors cursor-pointer select-none">
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: ADD FAQ */}
      <AnimatePresence>
        {showAddFAQModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5 mb-6">
                <h3 className="text-lg font-black">{locale === "ar" ? "إضافة سؤال وجواب جديد" : "Add FAQ Item"}</h3>
                <button onClick={() => setShowAddFAQModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddFAQ} className="space-y-4">
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">السؤال بالعربية</label>
                  <input
                    type="text"
                    required
                    value={newFAQ.qAr}
                    onChange={(e) => setNewFAQ({ ...newFAQ, qAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">السؤال بالانجليزية</label>
                  <input
                    type="text"
                    value={newFAQ.qEn}
                    onChange={(e) => setNewFAQ({ ...newFAQ, qEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الجواب بالعربية</label>
                  <textarea
                    rows={3}
                    required
                    value={newFAQ.aAr}
                    onChange={(e) => setNewFAQ({ ...newFAQ, aAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الجواب بالانجليزية</label>
                  <textarea
                    rows={3}
                    value={newFAQ.aEn}
                    onChange={(e) => setNewFAQ({ ...newFAQ, aEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={newFAQ.visible}
                    onChange={(e) => setNewFAQ({ ...newFAQ, visible: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">ظهور هذا السؤال بالموقع</span>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md transition-colors cursor-pointer select-none">
                  {locale === "ar" ? "تأكيد الإضافة" : "Confirm Add"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: EDIT FAQ */}
      <AnimatePresence>
        {editingFAQ && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start"
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-white/5 mb-6">
                <h3 className="text-lg font-black">{locale === "ar" ? "تعديل السؤال والجواب" : "Edit FAQ Item"}</h3>
                <button onClick={() => setEditingFAQ(null)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditFAQ} className="space-y-4">
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">السؤال بالعربية</label>
                  <input
                    type="text"
                    required
                    value={editingFAQ.qAr}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, qAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">السؤال بالانجليزية</label>
                  <input
                    type="text"
                    required
                    value={editingFAQ.qEn}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, qEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الجواب بالعربية</label>
                  <textarea
                    rows={3}
                    required
                    value={editingFAQ.aAr}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, aAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold text-gray-400 mb-1">الجواب بالانجليزية</label>
                  <textarea
                    rows={3}
                    required
                    value={editingFAQ.aEn}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, aEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-xs font-semibold resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={editingFAQ.visible}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ, visible: e.target.checked })}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="text-xxs font-bold text-gray-600 dark:text-gray-300">ظهور هذا السؤال بالموقع</span>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md transition-colors cursor-pointer select-none">
                  {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Request Details View */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-gray max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/15 text-start flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-border-dark mb-6">
                <div>
                  <span className="text-xxs font-black text-primary uppercase">
                    {locale === "ar" ? "تفاصيل الطلب" : "Request Details"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight mt-0.5">
                    {selectedRequest.id}
                  </h3>
                </div>
                
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-medium-gray text-gray-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-grow overflow-y-auto space-y-6 pr-1 pl-1">
                
                {/* Customer Information Section */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-medium-gray/40 border border-gray-100 dark:border-border-dark space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase border-b border-gray-200 dark:border-border-dark pb-2 mb-2">
                    {locale === "ar" ? "معلومات العميل" : "Customer Info"}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "الاسم" : "Name"}:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold text-sm">{selectedRequest.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "الجوال" : "Phone"}:</span>
                      <a href={`tel:${selectedRequest.customerPhone}`} className="text-primary dark:text-primary-light hover:underline font-mono text-sm block mt-0.5">{selectedRequest.customerPhone}</a>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "البريد الإلكتروني" : "Email"}:</span>
                      <span className="text-gray-900 dark:text-white">{selectedRequest.customerEmail || "-"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "طريقة التواصل المفضلة" : "Preferred Contact"}:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold capitalize">{selectedRequest.contactMethod}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "وقت التواصل المفضل" : "Preferred Time"}:</span>
                      <span className="text-gray-900 dark:text-white font-extrabold capitalize">{selectedRequest.preferredTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "تاريخ الطلب" : "Submitted Date"}:</span>
                      <span className="text-gray-900 dark:text-white">{selectedRequest.date}</span>
                    </div>
                  </div>

                  {selectedRequest.generalNotes && (
                    <div className="pt-2 border-t border-gray-200 dark:border-border-dark text-xs">
                      <span className="text-gray-400 font-bold block">{locale === "ar" ? "ملاحظات إضافية" : "General Notes"}:</span>
                      <p className="text-gray-700 dark:text-gray-200 mt-1 whitespace-pre-line leading-relaxed">{selectedRequest.generalNotes}</p>
                    </div>
                  )}
                </div>

                {/* Requested Services list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                    {locale === "ar" ? "الخدمات المطلوبة" : "Requested Services"}
                  </h4>
                  
                  <div className="space-y-3">
                    {selectedRequest.services.map((s: any, idx: number) => (
                      <div 
                        key={s.id} 
                        className="p-4 rounded-xl border border-gray-100 dark:border-border-dark bg-white dark:bg-medium-gray/20 flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-sm font-extrabold text-gray-900 dark:text-white">
                              {idx + 1}- {locale === "ar" ? s.titleAr : s.titleEn}
                            </h5>
                            {s.price && (
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                                {s.price}
                              </span>
                            )}
                          </div>
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xxs font-black">
                            {locale === "ar" ? `الكمية: ${s.quantity || 1}` : `Qty: ${s.quantity || 1}`}
                          </span>
                        </div>

                        {s.notes && s.notes.trim() && (
                          <div className="text-xxs bg-gray-50 dark:bg-dark-gray/40 border border-gray-100 dark:border-border-dark rounded-lg p-2.5">
                            <span className="text-gray-400 font-bold block mb-0.5">{locale === "ar" ? "ملاحظات الخدمة" : "Service Notes"}:</span>
                            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{s.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status update & Call-to-actions */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-medium-gray/40 border border-gray-100 dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto font-sans">
                    <span className="text-xxs font-black text-gray-400 block mb-1">
                      {locale === "ar" ? "تعديل حالة الطلب" : "Update Request Status"}
                    </span>
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => updateRequestStatus(selectedRequest.id, e.target.value as any)}
                      className="py-2.5 px-4 rounded-xl bg-white dark:bg-dark-gray border border-gray-200 dark:border-border-dark text-xs font-extrabold cursor-pointer outline-none focus:border-primary"
                    >
                      <option value="pending">{locale === "ar" ? "معلق (Pending)" : "Pending"}</option>
                      <option value="in_progress">{locale === "ar" ? "قيد الإنجاز (In Progress)" : "In Progress"}</option>
                      <option value="completed">{locale === "ar" ? "مكتمل (Completed)" : "Completed"}</option>
                      <option value="cancelled">{locale === "ar" ? "ملغي (Cancelled)" : "Cancelled"}</option>
                    </select>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto sm:mt-auto">
                    <a
                      href={`https://wa.me/${selectedRequest.customerPhone.replace(/[\s+]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <MessageSquare size={14} fill="currentColor" />
                      <span>{locale === "ar" ? "مراسلة العميل" : "Chat client"}</span>
                    </a>
                    
                    <button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-colors text-xs font-black cursor-pointer"
                    >
                      {locale === "ar" ? "حذف الطلب" : "Delete Request"}
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
