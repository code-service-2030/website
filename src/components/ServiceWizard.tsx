"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { defaultServices, ServiceItem, Category, defaultCategories, getMigratedServices } from "@/data/translations";
import { db } from "@/services/db";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  User,
  Building,
  Factory,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  X,
  Layers,
  ArrowRight,
  ArrowLeft,
  Activity,
  Briefcase,
  ShieldAlert,
  Coins,
  FileText,
  UserCheck,
  Globe,
  Scale,
  Home,
  HardHat,
  Award,
  Truck,
  Check
} from "lucide-react";

export const ServiceWizard: React.FC = () => {
  const { locale } = useLanguage();
  const { addToCart } = useCart();
  const isAr = locale === "ar";

  // Wizard Navigation State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userType, setUserType] = useState<"individual" | "business" | "logistics" | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Load Real Catalog from DB
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, servs] = await Promise.all([
          db.categories.getCategories().catch(() => []),
          db.services.getServices().catch(() => [])
        ]);

        if (cats && cats.length > 0) {
          setCategories(cats.filter((c: Category) => c.visible).sort((a: Category, b: Category) => a.order - b.order));
        } else {
          setCategories(defaultCategories);
        }

        if (servs && servs.length > 0) {
          setServices(servs.filter((s: ServiceItem) => s.visible).sort((a: ServiceItem, b: ServiceItem) => a.order - b.order));
        } else {
          setServices(getMigratedServices());
        }
      } catch (err) {
        console.error("Failed to load catalog into ServiceWizard:", err);
        setServices(getMigratedServices());
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleReset = () => {
    setStep(1);
    setUserType(null);
    setSelectedCategoryId(null);
    setSelectedIntent("all");
    setSearchQuery("");
    setSelectedService(null);
  };

  const handleAddToCart = (service: ServiceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(service);
    setAddedToast(service.titleAr);
    setTimeout(() => setAddedToast(null), 3500);
  };

  // Category Icon Mapping
  const renderCategoryIcon = (iconName: string, size = 20) => {
    switch (iconName?.toLowerCase()) {
      case "activity": return <Activity size={size} />;
      case "briefcase": return <Briefcase size={size} />;
      case "building": return <Building size={size} />;
      case "shieldalert": return <ShieldAlert size={size} />;
      case "coins": return <Coins size={size} />;
      case "filetext": return <FileText size={size} />;
      case "usercheck": return <UserCheck size={size} />;
      case "globe": return <Globe size={size} />;
      case "scale": return <Scale size={size} />;
      case "home": return <Home size={size} />;
      case "hardhat": return <HardHat size={size} />;
      case "award": return <Award size={size} />;
      case "truck": return <Truck size={size} />;
      default: return <Layers size={size} />;
    }
  };

  // Persona to Category Mapping
  const personaCategories = useMemo(() => {
    if (!userType) return categories;

    if (userType === "individual") {
      const allowed = ["absher-passports", "social-security", "government-grants", "reef-feasibility", "freelance-licenses", "financing-loans", "remote-jobs", "mofa-visas", "najiz-justice", "gosi", "traffic-vehicles", "health-insurance", "appeals-complaints"];
      return categories.filter(c => allowed.includes(c.id));
    } else if (userType === "business") {
      const allowed = ["commerce-business", "hr-qiwa", "municipality-balady", "civil-defense", "zatca", "gosi", "contracts-ops", "chamber", "financing-loans", "freelance-licenses", "investment-biz", "appeals-complaints"];
      return categories.filter(c => allowed.includes(c.id));
    } else {
      // logistics / industrial
      const allowed = ["modon", "transportation", "civil-defense", "contracts-ops", "chamber", "zatca", "reef-feasibility", "financing-loans"];
      return categories.filter(c => allowed.includes(c.id));
    }
  }, [userType, categories]);

  // Intent Types for Step 3
  const intentOptions = [
    { id: "all", labelAr: "✨ جميع الخدمات في هذا القسم", labelEn: "✨ All Services in Section" },
    { id: "new", labelAr: "🆕 إصدار وتأسيس وتسجيل جديد", labelEn: "🆕 New Issuance & Setup" },
    { id: "renew", labelAr: "🔄 تجديد وتحديث واستمرار", labelEn: "🔄 Renewal & Updates" },
    { id: "transfer", labelAr: "📋 نقل وتعديل وشطب وتفويض", labelEn: "📋 Transfer, Modify & Cancel" },
    { id: "consult", labelAr: "💡 استشارات وحلول ورفع بلاغات", labelEn: "💡 Consulting & Inquiries" }
  ];

  // Filter Recommended Services
  const recommendedServices = useMemo(() => {
    let list = services.filter(s => s.visible);

    if (selectedCategoryId) {
      list = list.filter(s => s.categoryId === selectedCategoryId);
    } else if (userType) {
      const catIds = personaCategories.map(c => c.id);
      list = list.filter(s => catIds.includes(s.categoryId));
    }

    // Filter by Intent keywords if not "all"
    if (selectedIntent !== "all") {
      if (selectedIntent === "new") {
        list = list.filter(s => {
          const text = `${s.titleAr} ${s.descAr} ${s.titleEn} ${(s.keywords || []).join(" ")}`.toLowerCase();
          return text.includes("إصدار") || text.includes("تأسيس") || text.includes("تسجيل") || text.includes("فتح") || text.includes("issue") || text.includes("new") || text.includes("create");
        });
      } else if (selectedIntent === "renew") {
        list = list.filter(s => {
          const text = `${s.titleAr} ${s.descAr} ${s.titleEn} ${(s.keywords || []).join(" ")}`.toLowerCase();
          return text.includes("تجديد") || text.includes("تحديث") || text.includes("renew") || text.includes("update");
        });
      } else if (selectedIntent === "transfer") {
        list = list.filter(s => {
          const text = `${s.titleAr} ${s.descAr} ${s.titleEn} ${(s.keywords || []).join(" ")}`.toLowerCase();
          return text.includes("نقل") || text.includes("تعديل") || text.includes("شطب") || text.includes("إلغاء") || text.includes("تحويل") || text.includes("transfer") || text.includes("cancel");
        });
      } else if (selectedIntent === "consult") {
        list = list.filter(s => {
          const text = `${s.titleAr} ${s.descAr} ${s.titleEn} ${(s.keywords || []).join(" ")}`.toLowerCase();
          return text.includes("استشارة") || text.includes("دراسة") || text.includes("اعتراض") || text.includes("بلاغ") || text.includes("consult") || text.includes("appeal");
        });
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(s => {
        return (
          s.titleAr.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          (s.descAr && s.descAr.toLowerCase().includes(q)) ||
          (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q)))
        );
      });
    }

    return list;
  }, [services, selectedCategoryId, userType, personaCategories, selectedIntent, searchQuery]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF7FD] via-white to-[#FCFAFE] dark:from-dark-gray dark:via-dark-gray dark:to-medium-gray/20 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#1E1929] p-6 sm:p-10 md:p-12 rounded-3xl border border-[#EDE4F7] dark:border-white/5 shadow-xl shadow-purple-900/5 relative overflow-hidden">
        
        {/* Decorative background glows */}
        <div className="absolute -bottom-16 -start-16 w-56 h-56 bg-primary/5 dark:bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -end-16 w-56 h-56 bg-purple-200/20 dark:bg-purple-900/10 rounded-full filter blur-3xl pointer-events-none" />

        {/* Heading */}
        <div className="text-center mb-8 select-none relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-primary/20 text-primary dark:text-primary-light border border-purple-100 dark:border-primary/30 text-xs font-black mb-3">
            <Sparkles size={14} className="animate-pulse" />
            <span>{isAr ? "المساعد التفاعلي الذكي" : "Smart Service Guide"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#260E44] dark:text-white mb-2">
            {isAr ? "ساعدني باختيار الخدمة المناسبة" : "Help Me Choose the Right Service"}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E7B] dark:text-gray-300 font-semibold max-w-lg mx-auto">
            {isAr 
              ? "حدد نوع المعاملة وسيرشدك النظام الذكي مباشرة للخدمة والمتطلبات والتكلفة دون عناء البحث" 
              : "Select your requirements and our interactive system will instantly suggest the exact service, requirements, and pricing"}
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 select-none relative z-10">
          {[
            { s: 1, labelAr: "المستفيد", labelEn: "Client" },
            { s: 2, labelAr: "القطاع", labelEn: "Sector" },
            { s: 3, labelAr: "الإجراء", labelEn: "Action" },
            { s: 4, labelAr: "النتائج", labelEn: "Results" }
          ].map(({ s, labelAr, labelEn }, idx) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                  step === s 
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105" 
                    : step > s 
                    ? "bg-emerald-500 text-white" 
                    : "bg-purple-50 text-[#6B5E7B] dark:bg-medium-gray dark:text-gray-400 border border-purple-100 dark:border-white/5"
                }`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-xxs font-bold hidden sm:inline ${
                  step === s ? "text-primary dark:text-primary-light font-black" : "text-[#6B5E7B] dark:text-gray-400"
                }`}>
                  {isAr ? labelAr : labelEn}
                </span>
              </div>
              {idx < 3 && (
                <div className={`w-8 sm:w-12 h-1 rounded-full transition-colors ${
                  step > s ? "bg-emerald-500" : "bg-purple-100 dark:bg-white/10"
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Questionnaire Slide Animation */}
        <div className="min-h-[260px] flex flex-col justify-center relative z-10">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select Beneficiary Persona */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col gap-6 items-center"
              >
                <h3 className="text-base sm:text-lg font-black text-[#260E44] dark:text-white text-center">
                  {isAr ? "ما هي صفتك أو طبيعة المعاملة التي تطلبها؟" : "What is your entity or service profile?"}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  {/* Individuals */}
                  <button
                    onClick={() => {
                      setUserType("individual");
                      setStep(2);
                    }}
                    className="p-5 rounded-2xl bg-white hover:bg-purple-50/70 dark:bg-medium-gray/40 dark:hover:bg-primary/10 border-2 border-purple-100 hover:border-primary dark:border-white/5 dark:hover:border-primary/30 transition-all text-center flex flex-col items-center gap-3 cursor-pointer shadow-xs group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-primary text-primary group-hover:text-white dark:bg-primary/20 dark:text-primary-light transition-all flex items-center justify-center">
                      <User size={26} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-[#260E44] dark:text-white block mb-1">
                        {isAr ? "أفراد ومقيمين" : "Individual / Resident"}
                      </span>
                      <span className="text-xxs text-[#6B5E7B] dark:text-gray-400 font-semibold leading-relaxed">
                        {isAr ? "أبشر، إقامات، جوازات، تأشيرات، وكالات عدلية" : "Absher, Visas, Passports, Najiz POAs"}
                      </span>
                    </div>
                  </button>

                  {/* Businesses */}
                  <button
                    onClick={() => {
                      setUserType("business");
                      setStep(2);
                    }}
                    className="p-5 rounded-2xl bg-white hover:bg-purple-50/70 dark:bg-medium-gray/40 dark:hover:bg-primary/10 border-2 border-purple-100 hover:border-primary dark:border-white/5 dark:hover:border-primary/30 transition-all text-center flex flex-col items-center gap-3 cursor-pointer shadow-xs group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-primary text-primary group-hover:text-white dark:bg-primary/20 dark:text-primary-light transition-all flex items-center justify-center">
                      <Building size={26} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-[#260E44] dark:text-white block mb-1">
                        {isAr ? "شركات ومؤسسات" : "Business / Enterprise"}
                      </span>
                      <span className="text-xxs text-[#6B5E7B] dark:text-gray-400 font-semibold leading-relaxed">
                        {isAr ? "سجلات، قوى، بلدي، دفاع مدني، زكاة وضريبة" : "CRs, Qiwa, Balady, Civil Defense, ZATCA"}
                      </span>
                    </div>
                  </button>

                  {/* Industrial & Logistics */}
                  <button
                    onClick={() => {
                      setUserType("logistics");
                      setStep(2);
                    }}
                    className="p-5 rounded-2xl bg-white hover:bg-purple-50/70 dark:bg-medium-gray/40 dark:hover:bg-primary/10 border-2 border-purple-100 hover:border-primary dark:border-white/5 dark:hover:border-primary/30 transition-all text-center flex flex-col items-center gap-3 cursor-pointer shadow-xs group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-primary text-primary group-hover:text-white dark:bg-primary/20 dark:text-primary-light transition-all flex items-center justify-center">
                      <Factory size={26} />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-[#260E44] dark:text-white block mb-1">
                        {isAr ? "مصانع ونقل ولوجستيات" : "Industrial & Logistics"}
                      </span>
                      <span className="text-xxs text-[#6B5E7B] dark:text-gray-400 font-semibold leading-relaxed">
                        {isAr ? "منصة مدن، هيئة النقل، عقود التشغيل والصيانة" : "MODON, Transport cards, Waste contracts"}
                      </span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Select Sector / Platform */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col gap-6"
              >
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-black text-[#260E44] dark:text-white mb-1">
                    {isAr ? "ما هو المجال أو المنصة الحكومية المطلوبة؟" : "Select the relevant government sector / platform"}
                  </h3>
                  <p className="text-xxs text-[#6B5E7B] dark:text-gray-400 font-semibold">
                    {isAr ? "اختر المنصة المحددة أو تصفح كافة الخدمات التابعة لهذا القطاع" : "Choose a specific portal or explore all related services"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[340px] overflow-y-auto pr-1">
                  {/* All in persona option */}
                  <button
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setStep(3);
                    }}
                    className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100/80 dark:bg-primary/20 dark:hover:bg-primary/30 border border-purple-200 dark:border-primary/40 text-start font-bold text-xs text-primary dark:text-white cursor-pointer shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={18} />
                      <span>{isAr ? "✨ جميع الأقسام المتاحة" : "✨ All Sections"}</span>
                    </div>
                    {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>

                  {personaCategories.map((cat) => {
                    const catServicesCount = services.filter(s => s.categoryId === cat.id && s.visible).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setStep(3);
                        }}
                        className="p-4 rounded-2xl bg-white hover:bg-purple-50/60 dark:bg-medium-gray/40 dark:hover:bg-primary/10 border border-[#EDE4F7] dark:border-white/5 hover:border-primary/30 text-start font-bold text-xs text-[#260E44] dark:text-white cursor-pointer shadow-xs transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center flex-shrink-0">
                            {renderCategoryIcon(cat.icon, 18)}
                          </div>
                          <div>
                            <span className="block font-black text-xs text-[#260E44] dark:text-gray-100 leading-tight">
                              {isAr ? cat.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim() : cat.nameEn}
                            </span>
                            <span className="text-[10px] text-[#6B5E7B] dark:text-gray-400 font-semibold">
                              {catServicesCount} {isAr ? "خدمة متاحة" : "services"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[#6B5E7B] group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary-light transition-transform group-hover:translate-x-0.5">
                          {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Back */}
                <div className="flex justify-start border-t border-purple-100 dark:border-white/5 pt-3">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-black text-[#6B5E7B] hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isAr ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span>{isAr ? "الرجوع للخطوة السابقة" : "Back"}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Select Intent / Action Type */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col gap-5 items-center"
              >
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-black text-[#260E44] dark:text-white mb-1">
                    {isAr ? "ما هو نوع الإجراء الذي ترغب به؟" : "What type of transaction do you need?"}
                  </h3>
                  <p className="text-xxs text-[#6B5E7B] dark:text-gray-400 font-semibold">
                    {isAr ? "يساعدنا تحديد الإجراء في فرز الخدمات الأكثر مطابقة لطلبك بدقة" : "Helps us pinpoint the exact matching workflow"}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 w-full max-w-md">
                  {intentOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedIntent(opt.id);
                        setStep(4);
                      }}
                      className="py-3.5 px-5 rounded-2xl bg-white hover:bg-purple-50/80 dark:bg-medium-gray/40 dark:hover:bg-primary/10 border border-[#EDE4F7] dark:border-white/5 hover:border-primary text-start font-bold text-xs sm:text-sm text-[#260E44] dark:text-white cursor-pointer shadow-xs transition-all flex items-center justify-between group"
                    >
                      <span>{isAr ? opt.labelAr : opt.labelEn}</span>
                      <span className="text-[#6B5E7B] group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary-light">
                        {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Back button */}
                <div className="flex justify-start w-full border-t border-purple-100 dark:border-white/5 pt-3">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-black text-[#6B5E7B] hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isAr ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span>{isAr ? "الرجوع لاختيار القطاع" : "Back to sectors"}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Recommended Services Results Grid */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col gap-4 text-start"
              >
                {/* Header with live search & restart */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-purple-100 dark:border-white/5 pb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#260E44] dark:text-white flex items-center gap-2">
                      <span>{isAr ? "الخدمات الموصى بها لك:" : "Recommended Services:"}</span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-primary dark:bg-primary/20 dark:text-primary-light">
                        {recommendedServices.length} {isAr ? "خدمة" : "items"}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Live filter input */}
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-48">
                      <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder={isAr ? "تصفية سريعة..." : "Filter..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs font-bold bg-white dark:bg-medium-gray/30 border border-purple-100 dark:border-border-dark focus:border-primary rounded-xl ps-8 pe-3 py-1.5 outline-none text-[#260E44] dark:text-white placeholder:text-gray-400"
                      />
                    </div>

                    {/* Restart Button */}
                    <button
                      onClick={handleReset}
                      className="text-xs font-bold text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white flex items-center gap-1 cursor-pointer whitespace-nowrap bg-purple-50 dark:bg-primary/20 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-primary/30"
                      title={isAr ? "إعادة تعيين وبدء جديد" : "Start over"}
                    >
                      <RotateCcw size={12} />
                      <span>{isAr ? "بدء جديد" : "Reset"}</span>
                    </button>
                  </div>
                </div>

                {/* Services list cards */}
                {recommendedServices.length === 0 ? (
                  <div className="py-12 text-center text-[#6B5E7B] dark:text-gray-400 space-y-3">
                    <p className="font-bold text-sm">
                      {isAr ? "لم نجد خدمات مطابقة للمحددات المختارة بدقة." : "No exact services match these filters."}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedIntent("all");
                        setSearchQuery("");
                      }}
                      className="text-xs font-black text-primary underline cursor-pointer"
                    >
                      {isAr ? "عرض جميع خدمات القسم دون تصفية" : "Show all section services"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[340px] overflow-y-auto pr-1">
                    {recommendedServices.map((service) => {
                      const title = isAr ? service.titleAr : service.titleEn;
                      const catName = categories.find(c => c.id === service.categoryId)?.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim() || "";

                      return (
                        <div
                          key={service.id}
                          className="p-4 rounded-2xl bg-white hover:bg-purple-50/40 dark:bg-medium-gray/30 dark:hover:bg-primary/10 border border-[#EDE4F7] dark:border-white/5 hover:border-primary/40 transition-all flex flex-col justify-between gap-3 group shadow-xs"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <span className="text-[10px] font-black text-primary/70 dark:text-primary-light/70 uppercase">
                                {catName}
                              </span>
                              {service.price && (
                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg">
                                  {service.price}
                                </span>
                              )}
                            </div>

                            <h4 className="font-extrabold text-xs sm:text-sm text-[#260E44] dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                              {title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-purple-50 dark:border-white/5 gap-2">
                            <button
                              onClick={() => setSelectedService(service)}
                              className="text-[11px] font-black text-[#524560] dark:text-gray-300 hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>{isAr ? "التفاصيل والمتطلبات" : "Details"}</span>
                              {isAr ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                            </button>

                            <button
                              onClick={(e) => handleAddToCart(service, e)}
                              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ShoppingBag size={12} />
                              <span>{isAr ? "طلب الخدمة" : "Order"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Back button */}
                <div className="flex justify-between items-center border-t border-purple-100 dark:border-white/5 pt-3 select-none">
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs font-black text-[#6B5E7B] hover:text-primary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isAr ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span>{isAr ? "تعديل خيار الإجراء" : "Back"}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-[#6B5E7B] hover:text-primary cursor-pointer"
                  >
                    {isAr ? "بدء معالج جديد" : "Start over"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* TOAST: Added to Cart */}
        <AnimatePresence>
          {addedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 bg-[#260E44] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-purple-400/30 text-xs font-black"
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>{isAr ? `تمت إضافة الخدمة بنجاح إلى السلة` : `Added to cart successfully`}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: Wizard Selected Service Full Details */}
        <AnimatePresence>
          {selectedService && (
            <div
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
              onClick={() => setSelectedService(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#1E1929] max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 dark:border-white/10 text-start flex flex-col max-h-[85vh] select-text"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-purple-100 dark:border-white/5 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-primary/70 dark:text-primary-light/70 tracking-wider">
                        {categories.find(c => c.id === selectedService.categoryId)?.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-[#260E44] dark:text-white leading-tight">
                        {isAr ? selectedService.titleAr : selectedService.titleEn}
                      </h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-medium-gray text-[#6B5E7B] dark:text-gray-400 cursor-pointer flex-shrink-0 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Details Body */}
                <div className="flex-grow overflow-y-auto pr-1 pl-1 space-y-5">
                  
                  {/* Description */}
                  <div>
                    <h4 className="text-xxs font-black text-[#6B5E7B] dark:text-gray-400 uppercase mb-1.5">
                      {isAr ? "نبذة عن الخدمة" : "Service Overview"}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#524560] dark:text-gray-300 leading-relaxed font-semibold">
                      {isAr ? selectedService.descAr : selectedService.descEn}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Completion Time */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-medium-gray/40 border border-purple-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-xxs font-black text-[#6B5E7B] dark:text-gray-400 uppercase mb-1">
                        <Clock size={12} className="text-primary" />
                        <span>{isAr ? "الوقت المتوقع" : "Estimated Time"}</span>
                      </div>
                      <p className="text-xs font-black text-[#260E44] dark:text-gray-200">
                        {isAr 
                          ? (selectedService.completionTimeAr || "فوري / 24 ساعة") 
                          : (selectedService.completionTimeEn || "Instant / 24h")}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-medium-gray/40 border border-purple-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5 text-xxs font-black text-[#6B5E7B] dark:text-gray-400 uppercase mb-1">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>{isAr ? "الرسوم المقدرة" : "Estimated Fee"}</span>
                      </div>
                      <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        {selectedService.price || (isAr ? "حسب الاتفاق" : "Per agreement")}
                      </p>
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h4 className="text-xxs font-black text-[#6B5E7B] dark:text-gray-400 uppercase mb-2">
                      {isAr ? "المستندات والأوراق المطلوبة" : "Required Documents"}
                    </h4>
                    <div className="p-3.5 rounded-2xl bg-purple-50/30 dark:bg-primary/10 border border-purple-100 dark:border-primary/20 text-xs font-semibold text-[#524560] dark:text-gray-300 leading-relaxed">
                      {isAr 
                        ? (selectedService.docsAr || "لا توجد مستندات معقدة. يتم التواصل معك لمراجعة البيانات.")
                        : (selectedService.docsEn || "No complex documents required. Our team will verify necessary info.")}
                    </div>
                  </div>

                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-5 border-t border-purple-100 dark:border-white/5 mt-5 select-none">
                  {/* Add to Cart / Apply */}
                  <button
                    onClick={() => {
                      handleAddToCart(selectedService);
                      setSelectedService(null);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white text-center font-black text-xs transition-colors cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    <span>{isAr ? "إضافة الخدمة للسلة والمتابعة" : "Add to Cart & Proceed"}</span>
                  </button>

                  {/* Quick WhatsApp Inquiry */}
                  <a
                    href={`https://wa.me/966537073161?text=${encodeURIComponent(isAr ? `السلام عليكم، أستفسر عن خدمة: ${selectedService.titleAr}` : `Hello, inquiring about: ${selectedService.titleEn}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer flex items-center justify-center shadow-md shadow-emerald-500/10 gap-1.5 text-xs font-bold"
                    title="WhatsApp"
                  >
                    <MessageCircle size={16} fill="currentColor" />
                    <span>{isAr ? "استفسار سريع" : "Inquire"}</span>
                  </a>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default ServiceWizard;
