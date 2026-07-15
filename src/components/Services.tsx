"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { 
  defaultCategories, 
  defaultServices, 
  Category, 
  ServiceItem,
  getMigratedServices
} from "@/data/translations";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper component to resolve icons dynamically
const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComp = (Icons as any)[name];
  if (!IconComp) {
    return <Icons.HelpCircle className={className} size={24} />;
  }
  return <IconComp className={className} size={24} />;
};

export const Services: React.FC = () => {
  const { t, locale } = useLanguage();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Database state
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  
  // Active states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Initialize and Seed LocalStorage Database
  useEffect(() => {
    // Categories Seeding
    const savedCategories = localStorage.getItem("code_services_categories");
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories) as Category[];
        setCategories(parsed.filter(c => c.visible).sort((a, b) => a.order - b.order));
      } catch (e) {
        setCategories(defaultCategories);
      }
    } else {
      localStorage.setItem("code_services_categories", JSON.stringify(defaultCategories));
      setCategories(defaultCategories);
    }

    // Services Seeding
    const migrated = getMigratedServices();
    setServices(migrated.filter(s => s.visible).sort((a, b) => a.order - b.order));
  }, []);

  // Listen for admin changes
  useEffect(() => {
    const handleCatalogUpdate = () => {
      const savedCategories = localStorage.getItem("code_services_categories");
      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories) as Category[];
          setCategories(parsed.filter(c => c.visible).sort((a, b) => a.order - b.order));
        } catch (e) {}
      }
      const savedServices = localStorage.getItem("code_services_catalog");
      if (savedServices) {
        try {
          const parsed = JSON.parse(savedServices) as ServiceItem[];
          setServices(parsed.filter(s => s.visible).sort((a, b) => a.order - b.order));
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleCatalogUpdate);
    window.addEventListener("catalog_updated", handleCatalogUpdate);
    return () => {
      window.removeEventListener("storage", handleCatalogUpdate);
      window.removeEventListener("catalog_updated", handleCatalogUpdate);
    };
  }, []);

  // Smart Search logic
  const isSearchActive = searchTerm.trim().length > 1;

  const filteredServices = useMemo(() => {
    if (!isSearchActive) return [];
    const term = searchTerm.toLowerCase().trim();

    return services.filter((service) => {
      // Find category name
      const category = categories.find(c => c.id === service.categoryId);
      const catNameAr = category ? category.nameAr.toLowerCase() : "";
      const catNameEn = category ? category.nameEn.toLowerCase() : "";

      const titleAr = service.titleAr.toLowerCase();
      const titleEn = service.titleEn.toLowerCase();
      const descAr = service.descAr.toLowerCase();
      const descEn = service.descEn.toLowerCase();
      const matchKeywords = service.keywords.some(k => k.toLowerCase().includes(term));

      return (
        titleAr.includes(term) ||
        titleEn.includes(term) ||
        descAr.includes(term) ||
        descEn.includes(term) ||
        catNameAr.includes(term) ||
        catNameEn.includes(term) ||
        matchKeywords
      );
    });
  }, [searchTerm, services, categories, isSearchActive]);

  // Related services resolver
  const relatedServices = useMemo(() => {
    if (!selectedService) return [];
    return services
      .filter((s) => s.categoryId === selectedService.categoryId && s.id !== selectedService.id)
      .slice(0, 3);
  }, [selectedService, services]);

  // Deep Link WhatsApp generator
  const getWhatsAppLink = (title: string) => {
    const text = locale === "ar"
      ? `السلام عليكم، أرغب في الاستفسار عن خدمة: ${title}`
      : `Hello, I would like to inquire about: ${title}`;
    return `https://wa.me/966537073161?text=${encodeURIComponent(text)}`;
  };

  // Request service (adds to cart and closes modal)
  const handleApplyNow = (service: ServiceItem) => {
    setSelectedService(null);
    setSelectedCategory(null);
    addToCart(service);
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("navServices")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "خدماتنا المتميزة" : "Our Premium Services"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {locale === "ar"
              ? "اختر تصنيف الخدمة المناسبة أو ابحث مباشرة للوصول لمتطلبات معاملتك الفورية"
              : "Choose the appropriate category or search directly to access your transaction requirements"}
          </p>
        </div>

        {/* Dynamic Search Box */}
        <div className="mb-14 max-w-2xl mx-auto relative glass p-4 rounded-3xl border border-primary/5 shadow-sm">
          <span className="absolute inset-y-0 start-0 flex items-center ps-7 text-gray-400 dark:text-gray-500">
            <Icons.Search size={22} />
          </span>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-14 pe-10 py-4 rounded-2xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-sm sm:text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 end-0 flex items-center pe-7 text-gray-400 hover:text-gray-600"
            >
              <Icons.X size={18} />
            </button>
          )}
        </div>

        {/* VIEW 1: Flat Search Results Grid */}
        {isSearchActive ? (
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-start text-gray-800 dark:text-gray-200">
              {locale === "ar" ? `نتائج البحث (${filteredServices.length})` : `Search Results (${filteredServices.length})`}
            </h3>

            {filteredServices.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-medium-gray text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.HelpCircle size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {locale === "ar" ? "عذراً، لا توجد خدمات مطابقة" : "Sorry, no matching services found"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {locale === "ar" ? "تأكد من كتابة الكلمة بشكل صحيح أو تواصل معنا مباشرة" : "Check typing or contact us directly via WhatsApp"}
                </p>
                <a
                  href="https://wa.me/966537073161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-md"
                >
                  <Icons.MessageSquare size={16} />
                  <span>{locale === "ar" ? "استفسار واتساب مباشر" : "WhatsApp Inquiry"}</span>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const title = locale === "ar" ? service.titleAr : service.titleEn;
                  const desc = locale === "ar" ? service.descAr : service.descEn;
                  const category = categories.find(c => c.id === service.categoryId);
                  const iconName = category?.icon || "Briefcase";

                  return (
                    <motion.div
                      layout
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="group p-6 rounded-3xl glass-card border border-primary/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col justify-between text-start"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center">
                            <ServiceIcon name={iconName} />
                          </div>
                          {service.price && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              {service.price}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-black text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-primary-light transition-colors mb-2">
                          {title}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      <span className="text-xs text-primary dark:text-primary-light font-extrabold mt-6 inline-flex items-center gap-1">
                        <span>{locale === "ar" ? "التفاصيل والمتطلبات" : "Details & Requirements"}</span>
                        <span>→</span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: Categories Animated Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
            {categories.map((category) => {
              const name = locale === "ar" ? category.nameAr : category.nameEn;
              const desc = locale === "ar" ? category.descAr : category.descEn;
              const catServicesCount = services.filter((s) => s.categoryId === category.id).length;

              return (
                <motion.div
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ y: -4 }}
                  className="group p-8 rounded-3xl glass-card border border-primary/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer text-start flex flex-col justify-between h-64"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                        <ServiceIcon name={category.icon} />
                      </div>
                      
                      {/* Counter indicator */}
                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-medium-gray text-gray-500 dark:text-gray-400 text-xs font-bold">
                        {catServicesCount} {locale === "ar" ? "خدمة" : "Services"}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {desc}
                    </p>
                  </div>

                  <span className="text-xs text-primary dark:text-primary-light font-black inline-flex items-center gap-1">
                    <span>{locale === "ar" ? "استعراض الخدمات" : "Browse Services"}</span>
                    <span>→</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* MODAL 1: Services List under Category Overlay */}
        <AnimatePresence>
          {selectedCategory && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-dark-gray max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/10 text-start flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-border-dark mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center">
                      <ServiceIcon name={selectedCategory.icon} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {locale === "ar" ? selectedCategory.nameAr : selectedCategory.nameEn}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {locale === "ar" ? "انقر على أي خدمة للاطلاع على المتطلبات والتقديم" : "Click on any service to view documents & apply"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-medium-gray text-gray-400 cursor-pointer"
                  >
                    <Icons.X size={20} />
                  </button>
                </div>

                {/* Services list body */}
                <div className="flex-grow overflow-y-auto pr-1 pl-1 space-y-4">
                  {services.filter(s => s.categoryId === selectedCategory.id).length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      {locale === "ar" ? "لا توجد خدمات مضافة في هذا القسم حالياً." : "No services added to this category yet."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services
                        .filter(s => s.categoryId === selectedCategory.id)
                        .map((service) => {
                          const title = locale === "ar" ? service.titleAr : service.titleEn;
                          const desc = locale === "ar" ? service.descAr : service.descEn;

                          return (
                            <div
                              key={service.id}
                              onClick={() => setSelectedService(service)}
                              className="group p-5 rounded-2xl bg-gray-50 hover:bg-primary/5 dark:bg-medium-gray/30 dark:hover:bg-primary/5 border border-transparent hover:border-primary/10 dark:hover:border-primary/15 transition-all cursor-pointer flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-3 mb-2">
                                  <h4 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                                    {title}
                                  </h4>
                                  {service.price && (
                                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xxs font-black flex-shrink-0">
                                      {service.price}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                  {desc}
                                </p>
                              </div>
                              
                              <span className="text-xxs text-primary dark:text-primary-light font-black mt-4 inline-flex items-center gap-0.5">
                                <span>{locale === "ar" ? "عرض المتطلبات" : "View Requirements"}</span>
                                <span>→</span>
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: Service Details Popup */}
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
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-border-dark mb-6">
                  <div className="flex items-center gap-3 text-start">
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

                {/* Details Body */}
                <div className="flex-grow overflow-y-auto pr-1 pl-1 space-y-6">
                  
                  {/* Service Description */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                      {locale === "ar" ? "وصف الخدمة" : "Service Description"}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {locale === "ar" ? selectedService.descAr : selectedService.descEn}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Completion Time */}
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

                    {/* Price */}
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-medium-gray/40 border border-gray-100 dark:border-border-dark">
                      <h4 className="text-xxs font-bold text-gray-400 uppercase mb-1">
                        {locale === "ar" ? "رسوم الخدمة" : "Service Fee"}
                      </h4>
                      <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {selectedService.price || (locale === "ar" ? "حسب المعاملة" : "Variable")}
                      </p>
                    </div>
                  </div>

                  {/* Required Documents */}
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

                  {/* Related Services */}
                  {relatedServices.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
                        {locale === "ar" ? "خدمات ذات صلة" : "Related Services"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {relatedServices.map((rel) => (
                          <button
                            key={rel.id}
                            onClick={() => setSelectedService(rel)}
                            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-primary/10 hover:text-primary dark:bg-medium-gray text-gray-600 dark:text-gray-300 dark:hover:text-primary-light transition-all text-xs font-bold cursor-pointer"
                          >
                            {locale === "ar" ? rel.titleAr : rel.titleEn}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 dark:border-border-dark mt-6 select-none">
                  {/* Apply Now */}
                  <button
                    onClick={() => handleApplyNow(selectedService)}
                    className="flex-1 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white text-center font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-primary/20"
                  >
                    {locale === "ar" ? "طلب الخدمة (إضافة للسلة)" : "Request Service (Add to Cart)"}
                  </button>

                  <div className="flex gap-2">
                    {/* WhatsApp */}
                    <a
                      href={getWhatsAppLink(locale === "ar" ? selectedService.titleAr : selectedService.titleEn)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer flex items-center justify-center shadow-md shadow-emerald-500/10"
                      title="Request via WhatsApp"
                    >
                      <Icons.MessageCircle size={18} fill="currentColor" />
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
export default Services;
