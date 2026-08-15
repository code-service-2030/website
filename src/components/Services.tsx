"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { 
  defaultCategories, 
  defaultServices, 
  Category, 
  ServiceItem,
  getMigratedServices
} from "@/data/translations";
import { db } from "@/services/db";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Database state
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize from Supabase dynamic database
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
        console.error("Failed to load homepage categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Handle category navigation click
  const handleCategoryClick = (catId: string) => {
    router.push(`/services?category=${encodeURIComponent(catId)}`);
  };

  // Handle search redirection
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Only display the top 6 categories on the homepage teaser
  const teaserCategories = useMemo(() => {
    return categories.slice(0, 6);
  }, [categories]);

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors relative select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("navServices")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "استكشف خدماتنا الرقمية" : "Explore Our Digital Services"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {locale === "ar"
              ? "ابحث مباشرة عن أي معاملة حكومية أو تجارية، أو تصفح الأقسام الرئيسية للوصول للمتطلبات والأسعار"
              : "Search directly for any government or business transaction, or browse main departments for requirements & pricing"}
          </p>
        </div>

        {/* Dynamic Search Box Redirector */}
        <form onSubmit={handleSearchSubmit} className="mb-14 max-w-2xl mx-auto relative glass p-4 rounded-3xl border border-primary/5 shadow-sm">
          <span className="absolute inset-y-0 start-0 flex items-center ps-7 text-gray-400 dark:text-gray-500">
            <Icons.Search size={22} />
          </span>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-14 pe-14 py-4 rounded-2xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-sm sm:text-base"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 end-0 flex items-center pe-7 text-gray-400 hover:text-gray-600"
            >
              <Icons.X size={18} />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute inset-y-0 end-0 flex items-center pe-6 text-primary dark:text-primary-light hover:text-primary-dark font-black text-sm"
            >
              {locale === "ar" ? "بحث" : "Search"}
            </button>
          )}
        </form>

        {/* Categories Grid */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {teaserCategories.map((category) => {
              const name = locale === "ar" ? category.nameAr : category.nameEn;
              const desc = locale === "ar" ? category.descAr : category.descEn;
              const catServicesCount = services.filter((s) => s.categoryId === category.id).length;

              return (
                <motion.div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  whileHover={{ y: -4 }}
                  className="group p-8 rounded-3xl glass-card border border-primary/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 cursor-pointer text-start flex flex-col justify-between h-64"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                        <ServiceIcon name={category.icon} />
                      </div>
                      
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

        {/* Prominent High-End Call to Action Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/services")}
            className="inline-flex items-center gap-3 px-8 py-5 rounded-3xl bg-primary hover:bg-primary-dark text-white font-black text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>{locale === "ar" ? "استكشف جميع الخدمات" : "Explore All Services"}</span>
            <Icons.ArrowRight className="rtl:rotate-180" size={20} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Services;
