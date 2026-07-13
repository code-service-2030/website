"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, HelpCircle } from "lucide-react";
import { defaultFAQs, FAQItem } from "@/data/translations";

export const FAQ: React.FC = () => {
  const { t, locale } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("code_services_faqs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FAQItem[];
        setFaqs(parsed.filter(f => f.visible).sort((a, b) => a.order - b.order));
      } catch (e) {
        setFaqs(defaultFAQs);
      }
    } else {
      localStorage.setItem("code_services_faqs", JSON.stringify(defaultFAQs));
      setFaqs(defaultFAQs);
    }
  }, []);

  // Listen for updates from Admin Panel
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("code_services_faqs");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as FAQItem[];
          setFaqs(parsed.filter(f => f.visible).sort((a, b) => a.order - b.order));
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("faqs_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("faqs_updated", handleUpdate);
    };
  }, []);

  const handleToggle = (index: number) => {
    setExpandedIdx((prev) => (prev === index ? null : index));
  };

  // Filter FAQs based on query
  const filteredFaqs = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return faqs;

    return faqs.filter((faq) => {
      const qAr = faq.qAr.toLowerCase();
      const qEn = faq.qEn.toLowerCase();
      const aAr = faq.aAr.toLowerCase();
      const aEn = faq.aEn.toLowerCase();

      return qAr.includes(term) || qEn.includes(term) || aAr.includes(term) || aEn.includes(term);
    });
  }, [searchQuery, faqs]);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-medium-gray/30 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-10 select-none">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("faqTitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("faqSub")}
          </p>
        </div>

        {/* Live Search Box */}
        <div className="mb-10 max-w-xl mx-auto relative glass p-3.5 rounded-2xl border border-primary/5 shadow-sm">
          <span className="absolute inset-y-0 start-0 flex items-center ps-6 text-gray-400 dark:text-gray-500">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder={locale === "ar" ? "ابحث في الأسئلة والأجوبة..." : "Search questions & answers..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setExpandedIdx(null); // Reset expansions on search
            }}
            className="w-full ps-12 pe-9 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 end-0 flex items-center pe-6 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Accordions */}
        <div className="space-y-4 text-start">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-medium-gray/20 rounded-3xl p-8 border border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 bg-gray-100 dark:bg-medium-gray text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={24} />
              </div>
              <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
                {locale === "ar" ? "لا توجد أسئلة تطابق بحثك" : "No results match your search"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {locale === "ar" ? "تواصل معنا مباشرة للإجابة على استفسارك فوراً" : "Contact us directly and we'll reply right away"}
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIdx === index;
              const question = locale === "ar" ? faq.qAr : faq.qEn;
              const answer = locale === "ar" ? faq.aAr : faq.aEn;

              return (
                <div
                  key={faq.id}
                  className="glass rounded-2xl border border-primary/5 dark:border-white/5 overflow-hidden shadow-sm transition-all"
                >
                  {/* Question Trigger */}
                  <button
                    onClick={() => handleToggle(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-start font-bold text-gray-800 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <span className="text-base sm:text-lg pe-4">{question}</span>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-primary dark:text-primary-light flex-shrink-0"
                    >
                      <ChevronDown size={22} />
                    </motion.span>
                  </button>

                  {/* Answer Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 border-t border-primary/5 dark:border-white/5 leading-relaxed font-medium">
                          {answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
};
export default FAQ;
