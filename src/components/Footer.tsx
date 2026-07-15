"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { MapPin, MessageSquare, Clock, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, locale } = useLanguage();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
    <footer className="w-full bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand details col */}
        <div className="md:col-span-5 text-start space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-primary/20">
              <Image
                src="/images/logo.jpg"
                alt="كود خدمات"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              {t("heroTitle")}
            </span>
          </div>

          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
            {t("footerDesc")}
          </p>

          <div className="flex gap-4">
            <a
              href="https://wa.me/966537073161"
              className="p-3.5 rounded-xl bg-gray-800 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              aria-label="WhatsApp Chat"
            >
              <MessageSquare size={18} />
            </a>
            <a
              href="https://maps.app.goo.gl/4bdwupSAb9v6P9RE8"
              className="p-3.5 rounded-xl bg-gray-800 text-white hover:bg-primary transition-colors cursor-pointer"
              aria-label="View Map Location"
            >
              <MapPin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links col */}
        <div className="md:col-span-3 text-start space-y-4">
          <h4 className="text-white text-base font-extrabold tracking-wider">
            {t("footerLinks")}
          </h4>
          <ul className="space-y-2.5 font-medium text-sm">
            <li>
              <a
                href="#home"
                onClick={(e) => handleScroll(e, "#home")}
                className="hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {t("navHome")}
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => handleScroll(e, "#services")}
                className="hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {t("navServices")}
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => handleScroll(e, "#about")}
                className="hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {t("navAbout")}
              </a>
            </li>
            <li>
              <a
                href="#location"
                onClick={(e) => handleScroll(e, "#location")}
                className="hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {t("navLocation")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info details col */}
        <div className="md:col-span-4 text-start space-y-4">
          <h4 className="text-white text-base font-extrabold tracking-wider">
            {locale === "ar" ? "معلومات التواصل" : "Contact Details"}
          </h4>
          <ul className="space-y-4 font-medium text-sm">
            <li className="flex items-start gap-3">
              <span className="text-primary dark:text-primary-light mt-0.5"><MapPin size={16} /></span>
              <span>{t("locationAddress")}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary dark:text-primary-light"><Clock size={16} /></span>
              <span>{t("contactHoursVal")}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-xs sm:text-sm">
        <p>{t("footerCopyright")}</p>
        <p className="flex items-center gap-1 hover:text-white transition-colors">
          <span>{locale === "ar" ? "تم تصميمه بـ" : "Designed with"}</span>
          <Heart size={14} className="text-red-500 fill-current" />
          <span>{locale === "ar" ? "بواسطة كود خدمات" : "by Code Services"}</span>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
