"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { defaultServices, ServiceItem, Category, defaultCategories, getMigratedServices } from "@/data/translations";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { HelpCircle, ChevronRight, ChevronLeft, RotateCcw, User, Building, MessageCircle } from "lucide-react";

export const ServiceWizard: React.FC = () => {
  const { locale } = useLanguage();
  const { addToCart } = useCart();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"individual" | "business" | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  
  // Storage catalog
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  
  // Selected service detail popup inside wizard
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    // Load local dynamic services
    setServices(getMigratedServices());
    const savedCats = localStorage.getItem("code_services_categories");
    if (savedCats) {
      try { setCategories(JSON.parse(savedCats)); } catch (e) {}
    }
  }, []);

  const handleReset = () => {
    setStep(1);
    setUserType(null);
    setSelectedSubCategory(null);
    setSelectedService(null);
  };

  const getRecommendedServices = (): ServiceItem[] => {
    if (!selectedSubCategory) return [];
    return services.filter((s) => s.categoryId === selectedSubCategory && s.visible);
  };

  const handleApplyNow = (service: ServiceItem) => {
    setSelectedService(null);
    addToCart(service);
  };

  // Sub-category option helpers
  const individualOptions = [
    { id: "absher", labelAr: "👤 خدمات أبشر والحكومة", labelEn: "👤 Absher & Gov Services" },
    { id: "hr", labelAr: "💼 الموارد البشرية والضمان", labelEn: "💼 Social Security & HR" },
    { id: "student", labelAr: "🎓 الخدمات الطلابية والجامعات", labelEn: "🎓 Students & Universities" },
    { id: "printing", labelAr: "🖨️ طباعة المذكرات والأوراق", labelEn: "🖨️ Printing & Copying" }
  ];

  const businessOptions = [
    { id: "business", labelAr: "🏢 مركز الأعمال وتأسيس الشركات", labelEn: "🏢 Business Setup & CRs" },
    { id: "qiwa", labelAr: "⚙️ منصة قوى والعمالة المرفقة", labelEn: "⚙️ Qiwa & Sponsorships" },
    { id: "printing", labelAr: "🖨️ طباعة وتجليد المستندات والعقود", labelEn: "🖨️ Contract Printing" }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-medium-gray/30 transition-colors">
      <div className="max-w-4xl mx-auto glass p-8 sm:p-12 rounded-3xl border border-primary/10 shadow-xl relative overflow-hidden">
        
        {/* Decorative Background Blur */}
        <div className="absolute -bottom-10 -start-10 w-40 h-40 bg-primary/5 rounded-full filter blur-2xl pointer-events-none" />

        {/* Heading */}
        <div className="text-center mb-10 select-none">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light mb-4">
            <HelpCircle size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {locale === "ar" ? "ساعدني باختيار الخدمة" : "Help Me Choose a Service"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {locale === "ar" 
              ? "أجب عن أسئلة بسيطة وسنرشدك للخدمة المناسبة مباشرة" 
              : "Answer simple questions, and we will guide you to the correct service instantly"}
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 select-none">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 text-gray-400 dark:bg-medium-gray dark:text-gray-600"
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 transition-colors ${
                  step > s ? "bg-primary" : "bg-gray-200 dark:bg-medium-gray"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Questionnaire Slide Animation */}
        <div className="min-h-[220px] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Select User Type (Individual vs Business) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
                className="w-full flex flex-col gap-6 items-center"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
                  {locale === "ar" ? "هل أنت فرد أم قطاع أعمال ومؤسسة؟" : "Are you an individual or a business?"}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                  {/* Individual Option Card */}
                  <button
                    onClick={() => {
                      setUserType("individual");
                      setStep(2);
                    }}
                    className="p-6 rounded-2xl bg-white hover:bg-primary/5 dark:bg-medium-gray dark:hover:bg-primary/10 border-2 border-transparent hover:border-primary/20 transition-all text-center flex flex-col items-center gap-3 cursor-pointer shadow-sm group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light transition-transform group-hover:scale-105">
                      <User size={30} />
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      {locale === "ar" ? "أنا فرد (مواطن / مقيم)" : "Individual (Citizen / Resident)"}
                    </span>
                  </button>

                  {/* Business Option Card */}
                  <button
                    onClick={() => {
                      setUserType("business");
                      setStep(2);
                    }}
                    className="p-6 rounded-2xl bg-white hover:bg-primary/5 dark:bg-medium-gray dark:hover:bg-primary/10 border-2 border-transparent hover:border-primary/20 transition-all text-center flex flex-col items-center gap-3 cursor-pointer shadow-sm group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light transition-transform group-hover:scale-105">
                      <Building size={30} />
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      {locale === "ar" ? "أنا مؤسسة / قطاع أعمال" : "Business / Entity"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Select Subcategory based on User Type */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
                className="w-full flex flex-col gap-6 items-center"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
                  {locale === "ar" ? "ما الذي ترغب بإنجازه اليوم؟" : "What would you like to achieve today?"}
                </h3>

                <div className="flex flex-col gap-3 w-full max-w-md">
                  {/* Option Pills */}
                  {(userType === "individual" ? individualOptions : businessOptions).map((opt) => {
                    const label = locale === "ar" ? opt.labelAr : opt.labelEn;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSelectedSubCategory(opt.id);
                          setStep(3);
                        }}
                        className="py-4 px-6 rounded-2xl bg-white hover:bg-primary/5 dark:bg-medium-gray dark:hover:bg-primary/10 border border-gray-200 dark:border-border-dark text-start font-bold text-sm sm:text-base text-gray-900 dark:text-white cursor-pointer shadow-sm transition-all flex items-center justify-between"
                      >
                        <span>{label}</span>
                        <span>{locale === "ar" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Back button */}
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-xs font-black text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  {locale === "ar" ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                  <span>{locale === "ar" ? "العودة للخطوة السابقة" : "Back to step 1"}</span>
                </button>
              </motion.div>
            )}

            {/* STEP 3: Recommended Services Result Grid */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col gap-6 text-start"
              >
                <div className="flex justify-between items-center select-none border-b border-gray-100 dark:border-border-dark pb-4">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {locale === "ar" ? "الخدمات الموصى بها لك:" : "Recommended Services for You:"}
                  </h3>
                  
                  {/* Restart button */}
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>{locale === "ar" ? "ابدأ من جديد" : "Start Over"}</span>
                  </button>
                </div>

                {/* Services list */}
                {getRecommendedServices().length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    {locale === "ar" ? "لا توجد خدمات متاحة حالياً للتصنيف المحدد." : "No services available for this selection."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                    {getRecommendedServices().map((service) => {
                      const title = locale === "ar" ? service.titleAr : service.titleEn;
                      
                      return (
                        <div
                          key={service.id}
                          onClick={() => setSelectedService(service)}
                          className="p-4 rounded-xl bg-white hover:bg-primary/5 dark:bg-medium-gray dark:hover:bg-primary/5 border border-gray-200 dark:border-border-dark hover:border-primary/20 transition-all cursor-pointer flex justify-between items-center group shadow-sm"
                        >
                          <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                            {title}
                          </span>
                          
                          <span className="text-xxs text-primary dark:text-primary-light font-black group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                            {locale === "ar" ? "عرض ←" : "View →"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Back button */}
                <div className="flex justify-start border-t border-gray-100 dark:border-border-dark pt-4 select-none">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-black text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                  >
                    {locale === "ar" ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    <span>{locale === "ar" ? "العودة للخطوة السابقة" : "Back to step 2"}</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* MODAL: Wizard Selected Service Details */}
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
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center">
                      <HelpCircle size={22} />
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
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                      {locale === "ar" ? "وصف الخدمة" : "Service Description"}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {locale === "ar" ? selectedService.descAr : selectedService.descEn}
                    </p>
                  </div>

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
                      href={`https://wa.me/966537073161?text=${encodeURIComponent(locale === "ar" ? `السلام عليكم، أرغب في التقديم على خدمة: ${selectedService.titleAr}` : `Hello, I'd like to apply for service: ${selectedService.titleEn}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer flex items-center justify-center shadow-md shadow-emerald-500/10"
                      title="Request via WhatsApp"
                    >
                      <Icons.MessageCircle size={18} fill="currentColor" />
                    </a>

                    {/* Direct Call */}
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
export default ServiceWizard;
