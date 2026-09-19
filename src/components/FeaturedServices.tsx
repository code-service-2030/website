"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { defaultServices, ServiceItem, Category, defaultCategories, getMigratedServices } from "@/data/translations";
import { db } from "@/services/db";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";

const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComp = (Icons as any)[name];
  if (!IconComp) {
    return <Icons.HelpCircle className={className} size={22} />;
  }
  return <IconComp className={className} size={22} />;
};

export const FeaturedServices: React.FC = () => {
  const { locale } = useLanguage();
  const { cartItems, addToCart, openCart } = useCart();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [limit, setLimit] = useState(6);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingServiceId, setAddingServiceId] = useState<string | null>(null);

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
        console.error("Failed to load featured services:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();

    const savedLimit = localStorage.getItem("code_services_featured_limit");
    if (savedLimit) {
      setLimit(parseInt(savedLimit) || 6);
    }
  }, []);

  const featuredList = useMemo(() => {
    return services
      .filter((s) => s.featured && s.visible)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
      .slice(0, limit);
  }, [services, limit]);

  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const handleApplyNow = (service: ServiceItem) => {
    if (addingServiceId) return;
    setAddingServiceId(service.id);
    setSelectedService(null);
    addToCart(service);
    setTimeout(() => {
      setAddingServiceId(null);
      openCart();
    }, 600);
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center bg-white dark:bg-dark-gray">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (featuredList.length === 0) return null;

  const isAr = locale === "ar";

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors relative select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {isAr ? "الخدمات الأكثر طلباً" : "Popular Services"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {isAr ? "الخدمات الأكثر شعبية" : "Most Requested Services"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr
              ? "استعرض معاملاتك المفضلة والأكثر طلباً من قبل عملائنا لإنجاز فوري"
              : "Browse the top-requested transactions selected by our clients for fast completion"}
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          {featuredList.map((service) => {
            const title = isAr ? service.titleAr : service.titleEn;
            const desc = isAr ? service.descAr : service.descEn;
            const category = categories.find(c => c.id === service.categoryId);
            const categoryName = category
              ? (isAr ? category.nameAr : category.nameEn).replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()
              : "";
            const iconName = category?.icon || "Briefcase";

            // Price resolution mapping consistency
            const parsed = parsePrice(service.price);
            const hasPrice = parsed > 0;
            const displayPrice = hasPrice 
              ? (service.price?.includes("ريال") || service.price?.includes("SAR") ? service.price : `${service.price} ${isAr ? "ريال" : "SAR"}`)
              : (isAr ? "حسب الاتفاق" : "Per Agreement");

            const isAdding = addingServiceId === service.id;

            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -6 }}
                className="group bg-white dark:bg-medium-gray/25 border border-gray-200/80 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-medium-gray border border-gray-100 dark:border-border-dark flex items-center justify-center text-primary dark:text-primary-light">
                      <ServiceIcon name={iconName} />
                    </div>
                    <span className="text-xxs font-black text-primary dark:text-primary-light bg-primary/5 dark:bg-primary/20 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      {categoryName}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                    {title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3 font-medium">
                    {desc || (isAr ? "إنجاز سريع وموثوق بأفضل جودة وخدمة عملاء على مدار الساعة." : "Fast and reliable transaction processing with expert support.")}
                  </p>
                </div>

                <div className="border-t border-gray-150 dark:border-border-dark pt-5 mt-auto flex items-center justify-between">
                  <div className="text-start">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block mb-0.5">{isAr ? "الرسوم التقريبية" : "Est. Price"}</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{displayPrice}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isAdding}
                      onClick={() => handleApplyNow(service)}
                      className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-colors cursor-pointer select-none disabled:opacity-75 disabled:cursor-not-allowed shadow-xs"
                    >
                      {isAdding ? (
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin block" />
                      ) : (
                        hasPrice 
                          ? (isAr ? "طلب الخدمة" : "Request") 
                          : (isAr ? "استفسر عن السعر" : "Inquire")
                      )}
                    </button>
                    
                    <button
                      onClick={() => setSelectedService(service)}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-medium-gray text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border border-gray-200 dark:border-border-dark cursor-pointer transition-colors"
                      title={isAr ? "عرض التفاصيل السريعة" : "Quick Details"}
                    >
                      <Icons.Eye size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Quick View Modal */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="absolute inset-0 bg-black"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-medium-gray rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-2xl text-start border border-gray-100 dark:border-border-dark"
              >
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-gray text-gray-450 cursor-pointer"
                >
                  <Icons.X size={20} />
                </button>

                <div className="mb-6">
                  <span className="text-xxs font-black text-primary dark:text-primary-light uppercase tracking-wider block mb-2 bg-primary/5 self-start px-2 py-0.5 rounded w-max">
                    {categories.find(c => c.id === selectedService.categoryId)?.[isAr ? "nameAr" : "nameEn"]}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-snug">
                    {isAr ? selectedService.titleAr : selectedService.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-h-40 overflow-y-auto">
                    {isAr ? selectedService.descAr || "الخدمة تشمل تعبئة المستندات والمراجعة وإخطار العميل بتقرير الإنجاز." : selectedService.descEn || "Includes document validation, submission and processing tracking."}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-gray text-gray-400">
                      <Icons.Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xxs font-bold text-gray-450">{isAr ? "وقت الإنجاز المتوقع" : "Completion Time"}</p>
                      <p className="font-extrabold text-gray-800 dark:text-gray-250">
                        {isAr ? (selectedService.completionTimeAr || "يوم عمل واحد") : (selectedService.completionTimeEn || "1 Business Day")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-gray text-emerald-600">
                      <Icons.Coins size={16} />
                    </div>
                    <div>
                      <p className="text-xxs font-bold text-gray-450">{isAr ? "الرسوم التقريبية للخدمة" : "Service Fee"}</p>
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {parsePrice(selectedService.price) > 0 
                          ? (selectedService.price?.includes("ريال") || selectedService.price?.includes("SAR") ? selectedService.price : `${selectedService.price} ${isAr ? "ريال" : "SAR"}`)
                          : (isAr ? "حسب الاتفاق" : "Per Agreement")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    disabled={addingServiceId === selectedService.id}
                    onClick={() => handleApplyNow(selectedService)}
                    className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs transition-colors cursor-pointer select-none flex items-center justify-center gap-1 disabled:opacity-75"
                  >
                    {addingServiceId === selectedService.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      parsePrice(selectedService.price) > 0 
                        ? (isAr ? "طلب الخدمة والبدء الآن" : "Request & Get Started") 
                        : (isAr ? "استفسر عن السعر الآن" : "Inquire About Price")
                    )}
                  </button>
                  
                  <Link
                    href={`/services/${selectedService.id}`}
                    onClick={() => setSelectedService(null)}
                    className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    {isAr ? "عرض التفاصيل الكاملة" : "Full Details"}
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default FeaturedServices;
