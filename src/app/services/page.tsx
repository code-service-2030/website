"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/services/db";
import { 
  Category, 
  ServiceItem, 
  defaultCategories, 
  getMigratedServices 
} from "@/data/translations";
import { 
  Search, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Globe, 
  Clock, 
  SlidersHorizontal, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Briefcase,
  Building,
  Activity,
  UserCheck,
  Home as HomeIcon,
  Users,
  XCircle,
  ArrowUpDown,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper component to resolve icons dynamically
const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const icons: Record<string, any> = {
    Briefcase,
    Building,
    Activity,
    UserCheck,
    Home: HomeIcon,
    Users
  };
  const IconComp = icons[name] || HelpCircle;
  return <IconComp className={className} size={20} />;
};

// Gradient themed card visuals representing premium Saudi digital platform identity
const getServiceGradient = (catId: string) => {
  const themes: Record<string, string> = {
    business: "from-[#3F0E6D] to-[#5A179B]",
    absher: "from-[#8E6E53] to-[#BFA18F]",
    qiwa: "from-[#0F5A7B] to-[#17859B]",
    municipality: "from-[#1F3D6F] to-[#2B548F]",
    najiz: "from-[#0F6F54] to-[#199B75]",
    ejar: "from-[#7F5F2F] to-[#A88A4F]",
    "human-resources": "from-[#5F1F6F] to-[#882F9B]"
  };
  return themes[catId] || "from-primary to-primary-light";
};

export default function ServicesMarketplace() {
  const { locale, toggleLanguage, theme, toggleTheme } = useLanguage();
  const { cartItems, openCart, addToCart } = useCart();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & discovery state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "popular" | "newest" | "price_asc" | "price_desc" | "fastest" | "longest" | "featured">("default");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addingServiceId, setAddingServiceId] = useState<string | null>(null);
  
  // DOM Scroll state
  const [scrolled, setScrolled] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination on filter changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCatId, searchTerm, sortBy]);

  // Track window scroll for glass-morphic layout changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse URL parameters for cross-page navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      const search = params.get("search");
      if (cat) setSelectedCatId(cat);
      if (search) setSearchTerm(search);
    }
  }, []);

  // Sync / Load database catalog
  useEffect(() => {
    async function loadCatalog() {
      try {
        const cats = await db.categories.getCategories();
        const servs = await db.services.getServices();
        
        if (cats && cats.length > 0) {
          setCategories(cats.filter(c => c.visible).sort((a, b) => a.order - b.order));
        } else {
          setCategories(defaultCategories.filter(c => c.visible).sort((a, b) => a.order - b.order));
        }

        if (servs && servs.length > 0) {
          setServices(servs.filter(s => s.visible).sort((a, b) => a.order - b.order));
        } else {
          const fallback = getMigratedServices();
          setServices(fallback.filter(s => s.visible).sort((a, b) => a.order - b.order));
        }
      } catch (err) {
        console.error("Failed to load catalog data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const isAr = locale === "ar";
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Helpers to parse price and completion duration for robust sorting
  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const parseCompletionTime = (timeStr?: string): number => {
    if (!timeStr) return 999;
    const clean = timeStr.toLowerCase();
    if (clean.includes("فوري") || clean.includes("instant") || clean.includes("دقائق") || clean.includes("minutes")) return 0.01;
    if (clean.includes("ساع") || clean.includes("hour")) {
      const match = clean.match(/\d+/);
      return match ? parseInt(match[0], 10) / 24 : 0.5;
    }
    if (clean.includes("يوم عمل واحد") || clean.includes("1 يوم") || clean.includes("1 day")) return 1;
    if (clean.includes("يومين") || clean.includes("2 يوم") || clean.includes("2 days")) return 2;
    const match = clean.match(/\d+/);
    return match ? parseInt(match[0], 10) : 5;
  };

  const estimatedCartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.service.price) * item.quantity;
    }, 0);
  }, [cartItems]);

  // Compute category counts dynamically from active visible services
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach(s => {
      counts[s.categoryId] = (counts[s.categoryId] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Search & Filter & Sort Pipeline
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Category Filter
    if (selectedCatId !== "all") {
      result = result.filter(s => s.categoryId === selectedCatId);
    }

    // Keyword Search Filter
    if (searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(s => {
        const cat = categories.find(c => c.id === s.categoryId);
        const catNameAr = cat ? cat.nameAr.toLowerCase() : "";
        const catNameEn = cat ? cat.nameEn.toLowerCase() : "";
        return (
          s.titleAr.toLowerCase().includes(term) ||
          s.titleEn.toLowerCase().includes(term) ||
          s.descAr.toLowerCase().includes(term) ||
          s.descEn.toLowerCase().includes(term) ||
          catNameAr.includes(term) ||
          catNameEn.includes(term) ||
          (s.keywords && s.keywords.some(k => k.toLowerCase().includes(term)))
        );
      });
    }

    // Sorting implementations
    if (sortBy === "price_asc") {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === "fastest") {
      result.sort((a, b) => parseCompletionTime(a.completionTimeAr || a.completionTimeEn) - parseCompletionTime(b.completionTimeAr || b.completionTimeEn));
    } else if (sortBy === "longest") {
      result.sort((a, b) => parseCompletionTime(b.completionTimeAr || b.completionTimeEn) - parseCompletionTime(a.completionTimeAr || a.completionTimeEn));
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.order - a.order);
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === "popular") {
      result.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (a.featuredOrder || 99) - (b.featuredOrder || 99);
      });
    } else {
      result.sort((a, b) => a.order - b.order);
    }

    return result;
  }, [services, selectedCatId, searchTerm, sortBy, categories]);

  const displayedServices = useMemo(() => {
    return filteredServices.slice(0, visibleCount);
  }, [filteredServices, visibleCount]);

  // Search suggestions handler
  const searchSuggestions = useMemo(() => {
    if (searchTerm.trim().length === 0) return [];
    const term = searchTerm.toLowerCase().trim();
    return services
      .filter(s => s.titleAr.toLowerCase().includes(term) || s.titleEn.toLowerCase().includes(term))
      .slice(0, 5);
  }, [searchTerm, services]);

  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title);
    setShowSuggestions(false);
  };

  const handleAddToCartDirectly = (service: ServiceItem) => {
    if (addingServiceId) return;
    setAddingServiceId(service.id);
    addToCart(service);
    setTimeout(() => {
      setAddingServiceId(null);
      openCart();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-gray transition-colors text-gray-900 dark:text-gray-100 font-sans pb-20">
      
      {/* 1. Navigation Header */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 dark:bg-dark-gray/95 backdrop-blur shadow-md py-2 border-b border-gray-200/60 dark:border-border-dark/60" 
          : "bg-white/70 dark:bg-dark-gray/70 backdrop-blur-sm border-b border-gray-200/30 dark:border-border-dark/30 py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-medium-gray rounded-xl transition-colors cursor-pointer text-gray-500 dark:text-gray-400">
              {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            </Link>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg font-black bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {isAr ? "كود خدمات" : "Code Services"}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-primary-light font-bold text-[9px]">MARKETPLACE</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode */}
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-medium-gray rounded-xl text-gray-500 dark:text-gray-400 cursor-pointer">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Language Switcher */}
            <button onClick={toggleLanguage} className="p-2 hover:bg-gray-100 dark:hover:bg-medium-gray rounded-xl text-gray-500 dark:text-gray-400 flex items-center gap-1.5 cursor-pointer text-xs font-bold">
              <Globe size={16} />
              <span>{isAr ? "English" : "العربية"}</span>
            </button>

            {/* Premium Floating Cart Indicator */}
            {cartItemsCount > 0 && (
              <button 
                onClick={openCart}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer transform hover:scale-102"
              >
                <ShoppingCart size={16} />
                <div className="text-start hidden sm:block border-s border-white/20 ps-2.5">
                  <p className="leading-tight text-[10px] opacity-90">{cartItemsCount} {isAr ? "خدمات" : "Services"}</p>
                  <p className="leading-tight font-black">{estimatedCartTotal} {isAr ? "ريال" : "SAR"}</p>
                </div>
                <span className="sm:hidden bg-white text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]">
                  {cartItemsCount}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Top Header / Hero Section */}
      <section className="bg-white dark:bg-medium-gray/20 border-b border-gray-200/50 dark:border-border-dark/50 py-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-1.5 text-xxs font-bold text-gray-400 dark:text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
            <span>/</span>
            <span className="text-gray-500 dark:text-gray-300">{isAr ? "سوق الخدمات الإلكترونية" : "Services Marketplace"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
            {isAr ? "اكتشف خدماتك الإلكترونية" : "Discover Your Digital Services"}
          </h1>
          <p className="text-sm sm:text-base font-bold text-gray-400 dark:text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? `استعرض أكثر من ${services.length} خدمة حكومية وتجارية ومهنية في مكان واحد بأسعار شفافة وإنجاز مضمون.`
              : `Explore over ${services.length} business, government, and commercial services in one place with fully transparent pricing.`}
          </p>

          {/* Search container */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white dark:bg-medium-gray border-2 border-gray-200 dark:border-border-dark focus-within:border-primary dark:focus-within:border-primary-light rounded-2xl px-4 py-3.5 shadow-lg transition-all">
              <Search className="text-gray-400 me-3" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={isAr ? "مثال: إصدار سجل تجاري، كفيل، بلدية..." : "e.g. Issue Commercial Register, Qiwa..."}
                className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-gray-400 text-start"
              />
              {searchTerm.length > 0 && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold"
                >
                  {isAr ? "مسح" : "Clear"}
                </button>
              )}
            </div>

            {/* Smart suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-medium-gray/95 backdrop-blur border border-gray-200 dark:border-border-dark rounded-2xl shadow-xl z-30 overflow-hidden text-start p-2"
                >
                  <p className="text-[10px] font-black text-gray-400 p-2 uppercase tracking-wider">{isAr ? "اقتراحات البحث" : "Suggestions"}</p>
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(isAr ? item.titleAr : item.titleEn)}
                      className="w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-gray rounded-xl text-xs font-semibold flex items-center justify-between text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <span>{isAr ? item.titleAr : item.titleEn}</span>
                      <span className="text-[10px] text-primary dark:text-primary-light font-bold bg-primary/5 px-2 py-0.5 rounded">
                        {categories.find(c => c.id === item.categoryId)?.[isAr ? "nameAr" : "nameEn"]}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. Main Marketplace Discovery Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          
          {/* A. CATEGORY SIDEBAR (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-3xl p-5 sticky top-24">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                {isAr ? "أقسام الخدمات" : "Service Categories"}
              </h3>
              
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCatId("all")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-start cursor-pointer relative ${
                    selectedCatId === "all"
                      ? "text-white"
                      : "hover:bg-gray-100 dark:hover:bg-medium-gray/50 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {selectedCatId === "all" && (
                    <motion.div
                      layoutId="activeCategoryBgDesktop"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{isAr ? "جميع الخدمات" : "All Services"}</span>
                  <span className={`relative z-10 px-2 py-0.5 rounded-md text-[10px] font-black transition-colors ${
                    selectedCatId === "all" ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-medium-gray text-gray-500"
                  }`}>
                    {services.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-start cursor-pointer relative ${
                        selectedCatId === cat.id
                          ? "text-white"
                          : "hover:bg-gray-100 dark:hover:bg-medium-gray/50 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {selectedCatId === cat.id && (
                        <motion.div
                          layoutId="activeCategoryBgDesktop"
                          className="absolute inset-0 bg-primary rounded-xl"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 truncate">{isAr ? cat.nameAr : cat.nameEn}</span>
                      <span className={`relative z-10 px-2 py-0.5 rounded-md text-[10px] font-black transition-colors ${
                        selectedCatId === cat.id ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-medium-gray text-gray-500"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* B. Discovery Section / Results */}
          <div className="lg:col-span-3">
            
            {/* Search filter active summary */}
            {searchTerm.trim().length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between gap-4 mb-6 text-start p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10"
              >
                <div className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  <span>{isAr ? "نتائج البحث عن: " : "Search results for: "}</span>
                  <span className="font-extrabold text-primary dark:text-primary-light">"{searchTerm}"</span>
                  <span className="mx-2 text-gray-355">•</span>
                  <span>{filteredServices.length} {isAr ? "خدمة متوفرة" : "services available"}</span>
                </div>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-xxs font-black text-red-500 hover:text-red-600 cursor-pointer"
                >
                  {isAr ? "إلغاء البحث" : "Clear Search"}
                </button>
              </motion.div>
            )}

            {/* Sorting & Filters Header */}
            <div className="bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="text-start">
                <h2 className="text-sm sm:text-base font-black">
                  {isAr ? "الخدمات المتاحة" : "Available Services"}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500">
                  {isAr 
                    ? `تم العثور على ${filteredServices.length} خدمة رقمية` 
                    : `Found ${filteredServices.length} digital services`}
                </p>
              </div>

              {/* Filtering / Sort Selector */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="lg:hidden flex items-center justify-center gap-1.5 flex-1 px-4 py-2.5 bg-gray-100 dark:bg-medium-gray rounded-xl text-xs font-bold cursor-pointer"
                >
                  <SlidersHorizontal size={14} />
                  <span>{isAr ? "الأقسام" : "Categories"}</span>
                </button>

                {/* Sort dropdown with custom theme option colors to fix contrast */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-medium-gray border border-transparent dark:border-border-dark rounded-xl px-3 py-1 flex-1 sm:flex-initial text-gray-800 dark:text-gray-100">
                  <ArrowUpDown size={14} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold outline-none cursor-pointer py-1.5 w-full sm:w-auto text-gray-800 dark:text-gray-100"
                  >
                    <option value="default" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "الترتيب الافتراضي" : "Default"}</option>
                    <option value="popular" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "الأكثر طلباً" : "Most Popular"}</option>
                    <option value="featured" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "الخدمات المميزة" : "Featured Services"}</option>
                    <option value="newest" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "الأحدث" : "Newest"}</option>
                    <option value="price_asc" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
                    <option value="price_desc" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
                    <option value="fastest" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "الأسرع إنجازاً" : "Fastest Completion"}</option>
                    <option value="longest" className="bg-white dark:bg-medium-gray text-gray-800 dark:text-gray-150">{isAr ? "الأبطأ إنجازاً" : "Longest Completion"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Horizontal Category Selection */}
            <div className="lg:hidden mb-6 overflow-x-auto flex gap-2 pb-2 scrollbar-none relative">
              <button
                onClick={() => setSelectedCatId("all")}
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                  selectedCatId === "all"
                    ? "text-white"
                    : "bg-gray-100 dark:bg-medium-gray text-gray-600 dark:text-gray-300"
                }`}
              >
                {selectedCatId === "all" && (
                  <motion.div
                    layoutId="activeCategoryBgMobile"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{isAr ? "الكل" : "All"} ({services.length})</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all relative ${
                    selectedCatId === cat.id
                      ? "text-white"
                      : "bg-gray-100 dark:bg-medium-gray text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {selectedCatId === cat.id && (
                    <motion.div
                      layoutId="activeCategoryBgMobile"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {isAr ? cat.nameAr.replace(/[^\p{L}\s]/gu, "").trim() : cat.nameEn} ({categoryCounts[cat.id] || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs text-gray-500 font-bold">{isAr ? "جاري تحميل سوق الخدمات..." : "Loading service catalog..."}</p>
              </div>
            ) : displayedServices.length > 0 ? (
              
              /* C. SERVICE CARD GRID WITH FRAMER MOTION TRANSITION */
              <div className="space-y-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCatId + "-" + searchTerm + "-" + sortBy}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {displayedServices.map((service, index) => {
                      const parsed = parsePrice(service.price);
                      const hasPrice = parsed > 0;
                      
                      // Consistency mapping: Use exact DB prices if configured, fallback to حسب الاتفاق
                      const displayPrice = hasPrice 
                        ? (service.price?.includes("ريال") || service.price?.includes("SAR") ? service.price : `${service.price} ${isAr ? "ريال" : "SAR"}`)
                        : (isAr ? "حسب الاتفاق" : "Per Agreement");

                      const displayCompletion = isAr 
                        ? (service.completionTimeAr || "يوم عمل") 
                        : (service.completionTimeEn || "1-2 Business Days");
                      const catInfo = categories.find(c => c.id === service.categoryId);
                      const isAdding = addingServiceId === service.id;

                      return (
                        <motion.div
                          layout
                          key={service.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
                          className="group bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-3xl p-5 shadow-sm hover:shadow-lg flex flex-col justify-between text-start relative overflow-hidden transition-shadow duration-300"
                        >
                          {/* Featured tag */}
                          {service.featured && (
                            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-amber-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <TrendingUp size={10} />
                              <span>{isAr ? "موصى به" : "Featured"}</span>
                            </div>
                          )}

                          <div>
                            {/* Themed Visual Card Top */}
                            <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${getServiceGradient(service.categoryId)} p-4 flex flex-col justify-between relative overflow-hidden mb-4 shadow-inner`}>
                              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                                {catInfo?.icon ? (
                                  <ServiceIcon name={catInfo.icon} className="text-white" />
                                ) : (
                                  <Briefcase size={20} />
                                )}
                              </div>
                              
                              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block bg-black/10 self-start px-2 py-0.5 rounded">
                                {catInfo?.[isAr ? "nameAr" : "nameEn"]}
                              </span>
                            </div>

                            {/* Title & Desc */}
                            <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
                              {isAr ? service.titleAr : service.titleEn}
                            </h3>
                            <p className="text-xxs sm:text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 line-clamp-2 min-h-[32px] leading-relaxed">
                              {isAr ? service.descAr || "الخدمة تشمل معالجة فورية وتوثيق عبر القنوات الرسمية بضمان كود خدمات." : service.descEn || "Complete documentation and quick processing guarantee from Code Services."}
                            </p>
                          </div>

                          {/* Details & CTA Footer */}
                          <div className="border-t border-gray-150 dark:border-border-dark/50 pt-4 mt-auto">
                            <div className="flex justify-between items-center text-xxs font-bold text-gray-500 mb-4">
                              <div className="flex items-center gap-1">
                                <Clock size={12} className="text-primary dark:text-primary-light" />
                                <span>{displayCompletion}</span>
                              </div>
                              <div className="text-end">
                                <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">{displayPrice}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link 
                                href={`/services/${service.id}`}
                                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray/50 dark:hover:bg-medium-gray text-gray-700 dark:text-gray-300 rounded-xl text-[11px] font-extrabold text-center transition-colors cursor-pointer"
                              >
                                {isAr ? "التفاصيل" : "Details"}
                              </Link>
                              
                              <button
                                disabled={isAdding}
                                onClick={() => handleAddToCartDirectly(service)}
                                className="flex-1 py-2 px-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center gap-1 disabled:opacity-75 disabled:cursor-not-allowed select-none"
                              >
                                {isAdding ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>{isAr ? "جاري الإضافة" : "Adding..."}</span>
                                  </>
                                ) : (
                                  <>
                                    {cartItems.some(i => i.service.id === service.id) ? (
                                      <span className="flex items-center gap-1">
                                        <Check size={12} />
                                        <span>{isAr ? "مضاف" : "Added"}</span>
                                      </span>
                                    ) : (
                                      hasPrice 
                                        ? <span>{isAr ? "اطلب الخدمة" : "Request"}</span>
                                        : <span>{isAr ? "استفسر عن السعر" : "Inquire"}</span>
                                    )}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* Load More Pagination */}
                {filteredServices.length > visibleCount && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="px-8 py-3.5 bg-white dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark/50 hover:border-primary dark:hover:border-primary-light text-primary dark:text-primary-light font-black text-xs rounded-2xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      {isAr ? "عرض المزيد من الخدمات" : "Load More Services"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              
              /* D. EMPTY SEARCH / RESULTS STATE */
              <div className="py-20 text-center bg-white dark:bg-medium-gray/15 rounded-3xl border border-gray-200/50 dark:border-border-dark/50 p-6 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary dark:text-primary-light">
                  <SlidersHorizontal size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                  {isAr ? "لم نجد أي خدمة تطابق بحثك" : "No services matched your query"}
                </h3>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
                  {isAr 
                    ? "تأكد من كتابة الكلمات بشكل صحيح أو حاول البحث عن أقسام أخرى مثل خدمات أبشر أو ناجز."
                    : "Double-check your spelling, clear any active filters, or browse other categories."}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCatId("all");
                  }}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  {isAr ? "عرض جميع الخدمات" : "Show All Services"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Mobile Category Filter Bottom-Sheet Drawer */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            {/* Backdrop click lock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 bg-black z-45 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-medium-gray rounded-t-3xl p-6 z-50 shadow-2xl overflow-y-auto max-h-[80vh] text-start text-gray-900 dark:text-gray-150"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black">{isAr ? "تصفية حسب الأقسام" : "Filter by Categories"}</h3>
                <button onClick={() => setShowFiltersMobile(false)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCatId("all");
                    setShowFiltersMobile(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold ${
                    selectedCatId === "all" ? "bg-primary text-white" : "bg-gray-50 dark:bg-dark-gray text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <span>{isAr ? "عرض الكل" : "Show All"}</span>
                  <span>{services.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setShowFiltersMobile(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold ${
                      selectedCatId === cat.id ? "bg-primary text-white" : "bg-gray-50 dark:bg-dark-gray text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                    <span>{categoryCounts[cat.id] || 0}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
