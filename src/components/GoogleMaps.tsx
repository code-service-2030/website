"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Navigation, Compass, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export const GoogleMaps: React.FC = () => {
  const { t, locale } = useLanguage();

  return (
    <section id="location" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("navLocation")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "أين تجدنا؟" : "Where to Find Us?"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {locale === "ar"
              ? "موقعنا مميز وسهل الوصول إليه في حي الفلاح بجدة، نسعد بزيارتكم"
              : "Our office is conveniently located in Al Falah district, Jeddah. We look forward to your visit"}
          </p>
        </div>

        {/* Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 glass p-8 rounded-3xl border border-primary/10 shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Brand Title */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                  <Landmark size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {t("heroTitle")}
                </h3>
              </div>

              {/* Address Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-primary dark:text-primary-light mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                      {t("contactAddressLabel")}
                    </h4>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-semibold leading-relaxed">
                      {t("locationAddress")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-primary dark:text-primary-light mt-1">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">
                      Plus Code
                    </h4>
                    <p className="text-base text-gray-800 dark:text-gray-200 font-mono font-semibold">
                      Q5PM+X8 Jeddah
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Deep Link Button */}
            <a
              href="https://maps.app.goo.gl/4bdwupSAb9v6P9RE8"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Navigation size={18} />
              <span>{t("locationOpenMaps")}</span>
            </a>
          </motion.div>

          {/* Interactive Map Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-lg border border-primary/5 dark:border-white/5 relative"
          >
            <iframe
              title="Code Services Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3708.3032599763784!2d39.227546!3d21.651624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3db7313364f9f%3A0xa196924b33fead44!2sCode%20Services%20%7C%20%D9%83%D9%84%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA!5e0!3m2!1sen!2ssa!4v1720000000000!5m2!1sen!2ssa"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
};
export default GoogleMaps;
