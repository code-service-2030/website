"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  const { t, locale } = useLanguage();

  const highlights = [
    t("aboutHighlight1"),
    t("aboutHighlight2"),
    t("aboutHighlight3"),
    t("aboutHighlight4"),
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-medium-gray/30 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Side (Image) */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-dark-gray"
          >
            <Image
              src="/images/interior.jpg"
              alt="كود خدمات من الداخل - Office Interior"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Text Content Side */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Section Tag */}
            <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
              {t("navAbout")}
            </span>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("aboutTitle")}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium">
              {t("aboutText")}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-medium-gray shadow-sm border border-primary/5 dark:border-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center font-bold">
                    <Check size={18} />
                  </div>
                  <span className="text-base font-extrabold text-gray-800 dark:text-gray-200">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
export default About;
