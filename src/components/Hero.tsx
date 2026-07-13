"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import Image from "next/image";

export const Hero: React.FC = () => {
  const { t, locale } = useLanguage();

  const handleScroll = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-primary-pale/30 to-white dark:from-dark-gray dark:via-primary/5 dark:to-dark-gray"
    >
      {/* Decorative Blur Circles (Abstract Shapes) */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-primary/10 dark:bg-primary/5 filter blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-primary/15 dark:bg-primary/10 filter blur-3xl animate-float-delayed" />
      
      {/* Dynamic Background SVG Shapes */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5A179B" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#7E30CE" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-grad)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 text-center lg:text-start"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-sm font-semibold mb-6 shadow-sm border border-primary/20">
            <ShieldCheck size={16} />
            <span>{locale === "ar" ? "شريكك الحكومي المعتمد" : "Your Authorized Government Partner"}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="block text-gray-900 dark:text-white leading-tight">
              {locale === "ar" ? "مكتب" : "Office of"}{" "}
            </span>
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-black mt-2 block">
              {t("heroTitle")}
            </span>
          </h1>

          {/* Sub Headline */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
            {t("heroSubTitle")}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => handleScroll("#contact")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <MessageSquare size={20} />
              <span>{t("heroBtnContact")}</span>
            </button>

            <button
              onClick={() => handleScroll("#services")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 dark:bg-medium-gray dark:hover:bg-primary/10 text-primary dark:text-primary-light font-bold text-lg border-2 border-primary/20 dark:border-primary/30 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t("heroBtnServices")}</span>
              {locale === "ar" ? <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> : <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </motion.div>

        {/* Graphical / Visual Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-5 flex justify-center relative"
        >
          {/* Glass Card Floating Container */}
          <div className="relative w-80 sm:w-[420px] aspect-square rounded-3xl overflow-hidden glass p-4 shadow-2xl border border-white/20 dark:border-white/5 flex items-center justify-center animate-float">
            <div className="absolute inset-4 rounded-2xl overflow-hidden bg-primary/5 relative">
              <Image
                src="/images/logo.jpg"
                alt="كود خدمات"
                fill
                priority
                className="object-cover rounded-2xl p-6 transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 640px) 280px, 380px"
              />
            </div>
            
            {/* Soft decorative ring */}
            <div className="absolute -inset-1 rounded-3xl border border-primary/10 pointer-events-none" />
          </div>
          
          {/* Floating mini stats */}
          <div className="absolute -top-4 -right-2 glass p-4 rounded-2xl shadow-lg border border-white/20 dark:border-white/5 animate-float-delayed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">سريع وآمن</p>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white">Fast & Secure</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-2 glass p-4 rounded-2xl shadow-lg border border-white/20 dark:border-white/5 animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
                ★
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">تقييم ممتاز</p>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white">4.9 Google Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
export default Hero;
