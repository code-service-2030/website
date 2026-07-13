"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export const Gallery: React.FC = () => {
  const { t, locale } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const galleryItems = [
    {
      src: "/images/storefront_1.jpg",
      title: t("imgStorefront"),
      desc: locale === "ar" ? "المدخل الرئيسي ومواقف السيارات" : "Main entrance and parking space",
      tags: ["services", "office"]
    },
    {
      src: "/images/interior.jpg",
      title: t("imgInterior"),
      desc: locale === "ar" ? "منطقة جلوس واستقبال العملاء" : "Customer sitting and reception area",
      tags: ["office", "customers"]
    },
    {
      src: "/images/price_list.jpg",
      title: t("imgPriceList"),
      desc: locale === "ar" ? "قائمة أسعار الخدمات وتصميم المطبوعات" : "Services & design prints price catalog",
      tags: ["printing", "design"]
    },
    {
      src: "/images/storefront_2.jpg",
      title: t("imgSignboard"),
      desc: locale === "ar" ? "اللوحة الخارجية للمكتب وموقع الفلاح" : "Exterior office signboard, Al Falah",
      tags: ["services"]
    },
    {
      src: "/images/logo.jpg",
      title: locale === "ar" ? "شعار كود خدمات" : "Code Services Brand Logo",
      desc: locale === "ar" ? "الهوية البصرية واللون البنفسجي المميز" : "Visual brand identity in distinct purple",
      tags: ["design", "office"]
    },
  ];

  const filteredItems = galleryItems;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev === filteredItems.length - 1 ? 0 : (prev as number) + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((prev) => (prev === 0 ? filteredItems.length - 1 : (prev as number) - 1));
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-medium-gray/30 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("galleryTitle")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "معرض الصور الخاص بنا" : "Our Media Gallery"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("gallerySub")}
          </p>
        </div>



        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedIdx(index)}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-primary/5 dark:border-white/5 bg-white dark:bg-medium-gray"
              >
                {/* Image */}
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="absolute top-4 end-4 p-2.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                    <ZoomIn size={18} />
                  </span>
                  
                  <h3 className="text-lg font-black text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300 font-medium font-cairo">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedIdx !== null && filteredItems[selectedIdx] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-6 end-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                aria-label="Close Lightbox"
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute start-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                aria-label="Previous image"
              >
                {locale === "ar" ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
              </button>

              <button
                onClick={handleNext}
                className="absolute end-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
                aria-label="Next image"
              >
                {locale === "ar" ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
              </button>

              {/* Active Image Box */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full h-[65vh] sm:h-[80vh] flex flex-col items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={filteredItems[selectedIdx].src}
                    alt={filteredItems[selectedIdx].title}
                    fill
                    className="object-contain rounded-2xl"
                    sizes="100vw"
                    priority
                  />
                </div>
                
                {/* Meta details footer */}
                <div className="text-center mt-4 max-w-2xl px-4">
                  <h3 className="text-xl font-extrabold text-white mb-1">
                    {filteredItems[selectedIdx].title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {filteredItems[selectedIdx].desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
export default Gallery;
