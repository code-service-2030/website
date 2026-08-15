"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  FileText, 
  HelpCircle, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Globe,
  Briefcase,
  Building,
  Activity,
  UserCheck,
  Home as HomeIcon,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldCheck,
  CornerDownLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper components to resolve icons
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
  return <IconComp className={className} size={24} />;
};

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

export default function ServiceDetails() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const { t, locale, toggleLanguage, theme, toggleTheme } = useLanguage();
  const { cartItems, addToCart, openCart } = useCart();

  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "process">("details");
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Sync / Load database catalog
  useEffect(() => {
    async function loadCatalog() {
      try {
        const cats = await db.categories.getCategories();
        const servs = await db.services.getServices();
        
        if (cats && cats.length > 0) {
          setCategories(cats.filter(c => c.visible).sort((a, b) => a.order - b.order));
        } else {
          setCategories(defaultCategories);
        }

        if (servs && servs.length > 0) {
          setServices(servs.filter(s => s.visible).sort((a, b) => a.order - b.order));
        } else {
          setServices(getMigratedServices());
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

  // Parse total cart price
  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const estimatedCartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      return acc + parsePrice(item.service.price) * item.quantity;
    }, 0);
  }, [cartItems]);

  // Resolve current service and category
  const service = useMemo(() => {
    return services.find(s => s.id === serviceId);
  }, [services, serviceId]);

  const category = useMemo(() => {
    if (!service) return null;
    return categories.find(c => c.id === service.categoryId);
  }, [categories, service]);

  // Related services
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return services
      .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
      .slice(0, 3);
  }, [services, service]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray text-gray-900 dark:text-gray-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-gray-500">{isAr ? "جاري تحميل تفاصيل الخدمة..." : "Loading service details..."}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray text-gray-900 dark:text-gray-100 text-center px-4">
        <h2 className="text-2xl font-black text-red-500 mb-2">{isAr ? "الخدمة غير متوفرة" : "Service Not Found"}</h2>
        <p className="text-xs text-gray-400 font-bold mb-6 max-w-sm">
          {isAr ? "عذراً، لم نتمكن من العثور على الخدمة المطلوبة. قد تكون تم إزالتها أو تعديلها." : "Sorry, we could not find the service you are looking for."}
        </p>
        <Link href="/services" className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-dark transition-colors">
          {isAr ? "العودة لسوق الخدمات" : "Return to Marketplace"}
        </Link>
      </div>
    );
  }

  const displayPrice = service.price || (isAr ? "حسب الاتفاق" : "Per Agreement");
  const displayCompletion = isAr 
    ? (service.completionTimeAr || "يوم عمل") 
    : (service.completionTimeEn || "1-2 Business Days");

  // Localized documents helper
  const requiredDocsList = isAr ? service.docsAr : service.docsEn;
  const docsArray = requiredDocsList 
    ? requiredDocsList.split("\n").filter(d => d.trim().length > 0) 
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-gray transition-colors text-gray-900 dark:text-gray-100 pb-20">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full glass border-b border-gray-200/50 dark:border-border-dark/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-medium-gray rounded-xl transition-colors cursor-pointer text-gray-500 dark:text-gray-400">
              {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg font-black bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {isAr ? "كود خدمات" : "Code Services"}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-medium-gray rounded-xl text-gray-500 dark:text-gray-400 cursor-pointer">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button onClick={toggleLanguage} className="p-2 hover:bg-gray-100 dark:hover:bg-medium-gray rounded-xl text-gray-500 dark:text-gray-400 flex items-center gap-1.5 cursor-pointer text-xs font-bold">
              <Globe size={16} />
              <span>{isAr ? "English" : "العربية"}</span>
            </button>

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
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xxs font-bold text-gray-400 dark:text-gray-500 mb-6 text-start">
          <Link href="/" className="hover:text-primary transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-primary transition-colors">{isAr ? "الخدمات" : "Services"}</Link>
          <span>/</span>
          <span className="text-gray-500 dark:text-gray-300 truncate max-w-[150px]">
            {category?.[isAr ? "nameAr" : "nameEn"]}
          </span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-[150px]">
            {isAr ? service.titleAr : service.titleEn}
          </span>
        </div>

        {/* Dynamic Details Page Columns */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visual Hero */}
            <div className={`w-full h-64 sm:h-80 rounded-3xl bg-gradient-to-br ${getServiceGradient(service.categoryId)} p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-lg`}>
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                {category?.icon ? (
                  <ServiceIcon name={category.icon} className="text-white" />
                ) : (
                  <Briefcase size={28} />
                )}
              </div>

              <div className="text-start">
                <span className="px-2.5 py-1 bg-white/20 text-white rounded-md text-[10px] font-black uppercase tracking-wider mb-3.5 inline-block">
                  {category?.[isAr ? "nameAr" : "nameEn"]}
                </span>
                <h1 className="text-xl sm:text-3xl font-black">{isAr ? service.titleAr : service.titleEn}</h1>
              </div>
            </div>

            {/* Info Tabs Selection */}
            <div className="bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-3xl p-5 text-start">
              <div className="flex border-b border-gray-150 dark:border-border-dark/50 pb-3 gap-6 mb-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`text-xs font-black pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "details" ? "border-primary text-primary dark:text-primary-light" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {isAr ? "التفاصيل والمزايا" : "Service Overview"}
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`text-xs font-black pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "documents" ? "border-primary text-primary dark:text-primary-light" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {isAr ? "المستندات المطلوبة" : "Required Documents"}
                </button>
                <button
                  onClick={() => setActiveTab("process")}
                  className={`text-xs font-black pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "process" ? "border-primary text-primary dark:text-primary-light" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {isAr ? "خطوات العمل" : "Process Guide"}
                </button>
              </div>

              {/* Tab Content */}
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                {activeTab === "details" && (
                  <div>
                    <p className="mb-4">
                      {isAr ? service.descAr || "الخدمة تشمل معالجة فورية وتوثيق عبر القنوات الرسمية بضمان كود خدمات." : service.descEn || "Complete documentation and quick processing guarantee from Code Services."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="p-4 bg-gray-50 dark:bg-medium-gray/20 rounded-2xl flex items-start gap-3">
                        <Check size={16} className="text-emerald-500 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-gray-900 dark:text-white mb-1">{isAr ? "معالجة رسمية" : "Official Processing"}</p>
                          <p className="text-[10px] text-gray-400">{isAr ? "نضمن تنفيذ طلبك مباشرة عبر الأنظمة الحكومية" : "Direct execution via government portals"}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-medium-gray/20 rounded-2xl flex items-start gap-3">
                        <Check size={16} className="text-emerald-500 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-gray-900 dark:text-white mb-1">{isAr ? "دعم كامل للملف" : "Comprehensive Review"}</p>
                          <p className="text-[10px] text-gray-400">{isAr ? "فحص المستندات للتأكد من خلوها من الأخطاء قبل التقديم" : "Manual error checks on documents prior to submission"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div>
                    {docsArray.length > 0 ? (
                      <ul className="space-y-3">
                        {docsArray.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded bg-primary/10 text-primary dark:text-primary-light flex items-center justify-center font-bold text-[10px] mt-0.5">{idx + 1}</span>
                            <span className="text-gray-700 dark:text-gray-300 font-bold">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 font-bold italic">
                        {isAr ? "لا توجد مستندات معينة مطلوبة لهذه الخدمة." : "No specific documents required for this service."}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "process" && (
                  <div className="space-y-6">
                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-xxs mt-0.5">1</div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white mb-1">{isAr ? "أضف الخدمة وتقدم بالطلب" : "Submit Request"}</p>
                        <p className="text-[10px] text-gray-400">{isAr ? "أضف الخدمة لسلتك واكتب بيانات التواصل لتسجيل الطلب" : "Place your request and verify details"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-xxs mt-0.5">2</div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white mb-1">{isAr ? "مراجعة الملف الفني" : "Review Stage"}</p>
                        <p className="text-[10px] text-gray-400">{isAr ? "يتواصل معك موظف كود خدمات المسؤول لمراجعة الملف والمستندات" : "Staff contacts you to review required files"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 relative">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-black text-xxs mt-0.5">3</div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white mb-1">{isAr ? "التنفيذ والاستلام" : "Completion & Handover"}</p>
                        <p className="text-[10px] text-gray-400">{isAr ? "يتم إنجاز الخدمة وإرسال المستندات وتأكيد الطلب" : "Get your official documents processed and delivered"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* General FAQs */}
            <div className="bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-3xl p-5 text-start">
              <h3 className="text-sm font-black mb-4">{isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h3>
              <div className="space-y-2">
                {[
                  {
                    qAr: "كم يستغرق إنجاز الخدمة؟",
                    qEn: "How long does processing take?",
                    aAr: "يختلف وقت التنفيذ بحسب نوع الخدمة، ولكن أغلب المعاملات تكتمل في غضون 24 إلى 48 ساعة عمل.",
                    aEn: "Completion time varies by service, but most standard requests are finalized within 24-48 business hours."
                  },
                  {
                    qAr: "هل الدفع آمن عبر موقع كود خدمات؟",
                    qEn: "Is my payment secure?",
                    aAr: "نعم، يتم معالجة جميع الدفعات بشكل آمن للغاية عبر بوابات دفع مشفرة بالكامل بضمان شروط PCI-DSS.",
                    aEn: "Yes, all transactions are fully encrypted and processed securely using PCI-DSS compliant payment gateways."
                  }
                ].map((item, idx) => {
                  const isOpen = faqOpenIndex === idx;
                  return (
                    <div key={idx} className="border border-gray-150 dark:border-border-dark/30 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-medium-gray/20 hover:bg-gray-100 dark:hover:bg-medium-gray/40 flex justify-between items-center font-bold text-xs cursor-pointer text-start"
                      >
                        <span>{isAr ? item.qAr : item.qEn}</span>
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 py-3 bg-white dark:bg-medium-gray/5 border-t border-gray-150 dark:border-border-dark/30 text-xxs text-gray-500 dark:text-gray-400 font-semibold"
                          >
                            {isAr ? item.aAr : item.aEn}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Checkout CTA Panel */}
          <div className="lg:col-span-1 space-y-6 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-3xl p-6 text-start">
              
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                {isAr ? "سعر التقديم" : "Estimated Cost"}
              </span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-6">{displayPrice}</p>

              <div className="space-y-3.5 mb-6 text-xxs font-bold text-gray-500">
                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark/50">
                  <span>{isAr ? "الوقت المتوقع" : "Completion Time"}</span>
                  <span className="text-gray-900 dark:text-white">{displayCompletion}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark/50">
                  <span>{isAr ? "الضمان" : "Guarantee"}</span>
                  <span className="text-gray-900 dark:text-white flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    {isAr ? "رسمي 100%" : "100% Official"}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    addToCart(service);
                  }}
                  className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
                >
                  <span>{isAr ? "اطلب الخدمة الآن" : "Order Service Now"}</span>
                </button>
                <button
                  onClick={() => {
                    addToCart(service);
                  }}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray/50 dark:hover:bg-medium-gray text-gray-700 dark:text-gray-300 rounded-2xl font-black text-xs transition-colors cursor-pointer text-center"
                >
                  {isAr ? "إضافة إلى السلة" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="bg-white dark:bg-medium-gray/30 border border-gray-200/50 dark:border-border-dark/50 rounded-3xl p-5 text-start">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">{isAr ? "خدمات مشابهة" : "Related Services"}</h3>
                <div className="space-y-3">
                  {relatedServices.map(item => (
                    <Link
                      key={item.id}
                      href={`/services/${item.id}`}
                      className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-medium-gray/20 transition-colors border border-transparent hover:border-gray-200/30 text-start"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getServiceGradient(item.categoryId)} flex items-center justify-center text-white shrink-0`}>
                        <ServiceIcon name={category?.icon || "Briefcase"} className="text-white" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-black text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">{isAr ? item.titleAr : item.titleEn}</h4>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">{item.price || (isAr ? "حسب الاتفاق" : "Per Agreement")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
