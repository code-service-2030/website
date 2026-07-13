"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Users, Star, Award, BookOpen, Zap, UserCheck, ShieldCheck, DollarSign, Headphones, Lock } from "lucide-react";

interface StatsData {
  completedServices: string;
  availableServices: string;
  googleReviews: string;
  googleRating: string;
}

export const WhyChooseUs: React.FC = () => {
  const { locale } = useLanguage();
  const [stats, setStats] = useState<StatsData>({
    completedServices: "5000+",
    availableServices: "100+",
    googleReviews: "18+",
    googleRating: "4.9★"
  });

  useEffect(() => {
    const saved = localStorage.getItem("code_services_stats");
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {}
    } else {
      localStorage.setItem("code_services_stats", JSON.stringify(stats));
    }
  }, []);

  // Listen for admin changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("code_services_stats");
      if (saved) {
        try { setStats(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("stats_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("stats_updated", handleStorageChange);
    };
  }, []);

  const statsItems = [
    {
      icon: <Zap size={28} />,
      value: stats.completedServices,
      label: locale === "ar" ? "معاملة منجزة" : "Completed Services",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      icon: <BookOpen size={28} />,
      value: stats.availableServices,
      label: locale === "ar" ? "خدمة متاحة" : "Available Services",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: <Award size={28} />,
      value: stats.googleReviews,
      label: locale === "ar" ? "تقييمات جوجل" : "Google Reviews",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: <Star size={28} />,
      value: stats.googleRating,
      label: locale === "ar" ? "تقييم العملاء" : "Customer Rating",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  const benefits = [
    {
      icon: <Zap size={26} />,
      titleAr: "إنجاز سريع",
      titleEn: "Fast Completion",
      descAr: "ننجز معاملاتك بأقصى سرعة ممكنة وبأعلى كفاءة لتوفير وقتك.",
      descEn: "We complete your transactions as fast as possible with high efficiency to save your time.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      icon: <UserCheck size={26} />,
      titleAr: "طاقم عمل احترافي",
      titleEn: "Professional Staff",
      descAr: "فريق متخصص وعلى دراية تامة بكافة الأنظمة والإجراءات الحكومية.",
      descEn: "A specialized team fully aware of all governmental regulations and procedures.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: <ShieldCheck size={26} />,
      titleAr: "مكتب موثوق",
      titleEn: "Trusted Office",
      descAr: "مرخصون رسمياً وموثوقون لدى كافة الجهات الحكومية والخاصة في جدة.",
      descEn: "Officially licensed and trusted by all governmental and private entities in Jeddah.",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: <DollarSign size={26} />,
      titleAr: "أسعار مناسبة",
      titleEn: "Affordable Prices",
      descAr: "نقدم خدماتنا الاحترافية بأسعار منافسة وفي متناول الجميع.",
      descEn: "We offer our professional services at competitive and budget-friendly rates.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      icon: <Headphones size={26} />,
      titleAr: "دعم فني متميز",
      titleEn: "Excellent Support",
      descAr: "نتابع طلباتك ونجيب على استفساراتك على مدار الساعة عبر الواتساب.",
      descEn: "We track your requests and answer your inquiries around the clock via WhatsApp.",
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
    {
      icon: <Lock size={26} />,
      titleAr: "أمان وسرية المعلومات",
      titleEn: "Secure Information",
      descAr: "نحافظ على خصوصية وسرية بياناتك ومستنداتك بأعلى معايير الأمان.",
      descEn: "We maintain the privacy and confidentiality of your data and documents with high security.",
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-medium-gray/30 transition-colors">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* SECTION 1: Statistics Counters */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
              {locale === "ar" ? "أرقامنا تميزنا" : "Our Statistics"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {locale === "ar" ? "كود خدمات بالأرقام" : "Code Services in Numbers"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsItems.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-md text-center flex flex-col items-center group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}>
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-base text-gray-500 dark:text-gray-400 font-extrabold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Why Choose Us Benefits */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
              {locale === "ar" ? "مميزاتنا" : "Our Features"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {locale === "ar" ? "ما الذي يجعلنا اختيارك الأول؟" : "What Makes Us Your First Choice?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const title = locale === "ar" ? benefit.titleAr : benefit.titleEn;
              const desc = locale === "ar" ? benefit.descAr : benefit.descEn;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-start flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${benefit.color}`}>
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
export default WhyChooseUs;
