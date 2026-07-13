"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { defaultServices, ServiceItem, Category, defaultCategories, getMigratedServices } from "@/data/translations";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComp = (Icons as any)[name];
  if (!IconComp) {
    return <Icons.HelpCircle className={className} size={22} />;
  }
  return <IconComp className={className} size={22} />;
};

export const FeaturedServices: React.FC = () => {
  const { locale } = useLanguage();
  const { addToCart } = useCart();
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [limit, setLimit] = useState(6);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    // Load local dynamic services
    setServices(getMigratedServices());
    const savedCats = localStorage.getItem("code_services_categories");
    if (savedCats) {
      try {
        setCategories(JSON.parse(savedCats));
      } catch (e) {}
    }
    const savedLimit = localStorage.getItem("code_services_featured_limit");
    if (savedLimit) {
      setLimit(parseInt(savedLimit) || 6);
    }
  }, []);

  // Listen for admin changes
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("code_services_catalog");
      if (saved) {
        try { setServices(JSON.parse(saved)); } catch (e) {}
      }
      const savedLimit = localStorage.getItem("code_services_featured_limit");
      if (savedLimit) {
        setLimit(parseInt(savedLimit) || 6);
      }
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("catalog_updated", handleUpdate);
    window.addEventListener("featured_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("catalog_updated", handleUpdate);
      window.removeEventListener("featured_updated", handleUpdate);
    };
  }, []);

  const featuredList = useMemo(() => {
    return services
      .filter((s) => s.featured && s.visible)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
      .slice(0, limit);
  }, [services, limit]);

  const handleApplyNow = (service: ServiceItem) => {
    setSelectedService(null);
    addToCart(service);
  };

  if (featuredList.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors relative select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {locale === "ar" ? "الخدمات الأكثر طلباً" : "Popular Services"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "الخدمات الأكثر شعبية" : "Most Requested Services"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {locale === "ar"
              ? "استعرض معاملاتك المفضلة والأكثر طلباً من قبل عملائنا لإنجاز فوري"
              : "Browse the top-requested transactions selected by our clients for fast completion"}
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          {featuredList.map((service) => {
            const title = locale === "ar" ? service.titleAr : service.titleEn;
            const desc = locale === "ar" ? service.descAr : service.descEn;
            const category = categories.find(c => c.id === service.categoryId);
            const categoryName = category
              ? (locale === "ar" ? category.nameAr : category.nameEn).replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()
              : "";
            const iconName = category?.icon || "Briefcase";

            return (
              <motion.div
                key={service.id}
                onClick={() => setSelectedService(service)}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-3xl glass-card border border-primary/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center">
                      <ServiceIcon name={iconName} />
                    </div>
                    
                    <span className="px-2.5 py-1 rounded-lg bg-primary/5 text-primary dark:bg-white/5 dark:text-primary-light text-xxs font-extrabold uppercase">
                      {categoryName}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 border-t border-gray-100 dark:border-border-dark/30 pt-4">
                  {service.price ? (
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {service.price}
                    </span>
                  ) : (
                    <span className="text-xxs text-gray-400 italic">
                      {locale === "ar" ? "حسب المعاملة" : "Variable"}
                    </span>
                  )}
                  
                  <span className="text-xs text-primary dark:text-primary-light font-black group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>{locale === "ar" ? "تفاصيل" : "Details"}</span>
                    <span>→</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal: Service Details */}
        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-dark-gray max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/15 text-start flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-border-dark mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center flex-shrink-0">
                      <ServiceIcon name={categories.find(c => c.id === selectedService.categoryId)?.icon || "Briefcase"} />
                    </div>
                    <div>
                      <span className="text-xxs font-black uppercase text-primary/60 dark:text-primary-light/60">
                        {categories.find(c => c.id === selectedService.categoryId)?.nameAr.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim()}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                        {locale === "ar" ? selectedService.titleAr : selectedService.titleEn}
                      </h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-medium-gray text-gray-400 cursor-pointer flex-shrink-0"
                  >
                    <Icons.X size={20} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto pr-1 pl-1 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                      {locale === "ar" ? "وصف الخدمة" : "Service Description"}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {locale === "ar" ? selectedService.descAr : selectedService.descEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-medium-gray/40 border border-gray-100 dark:border-border-dark">
                      <h4 className="text-xxs font-bold text-gray-400 uppercase mb-1">
                        {locale === "ar" ? "الوقت المتوقع للإنجاز" : "Estimated Time"}
                      </h4>
                      <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200">
                        {locale === "ar" 
                          ? (selectedService.completionTimeAr || "فوري") 
                          : (selectedService.completionTimeEn || "Instant")}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-medium-gray/40 border border-gray-100 dark:border-border-dark">
                      <h4 className="text-xxs font-bold text-gray-400 uppercase mb-1">
                        {locale === "ar" ? "رسوم الخدمة" : "Service Fee"}
                      </h4>
                      <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {selectedService.price || (locale === "ar" ? "حسب المعاملة" : "Variable")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2.5 tracking-wider">
                      {locale === "ar" ? "المستندات والأوراق المطلوبة" : "Required Documents"}
                    </h4>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                      {locale === "ar" 
                        ? (selectedService.docsAr || "لا توجد مستندات خاصة مطلوبة. تواصل للتحقق.")
                        : (selectedService.docsEn || "No special documents required. Inquire to verify.")}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 dark:border-border-dark mt-6">
                  <button
                    onClick={() => handleApplyNow(selectedService)}
                    className="flex-1 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white text-center font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-primary/20"
                  >
                    {locale === "ar" ? "طلب الخدمة (إضافة للسلة)" : "Request Service (Add to Cart)"}
                  </button>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/966537073161?text=${encodeURIComponent(locale === "ar" ? `السلام عليكم، أرغب في التقديم على خدمة: ${selectedService.titleAr}` : `Hello, I'd like to apply for service: ${selectedService.titleEn}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer flex items-center justify-center shadow-md shadow-emerald-500/10"
                      title="Request via WhatsApp"
                    >
                      <Icons.MessageCircle size={18} fill="currentColor" />
                    </a>

                    <a
                      href="tel:+966537073161"
                      className="p-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center border border-gray-200 dark:border-border-dark"
                      title="Call Office"
                    >
                      <Icons.Phone size={18} />
                    </a>
                  </div>
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
