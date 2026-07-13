"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export const Reviews: React.FC = () => {
  const { t, locale } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reviewsList = [
    {
      name: t("reviewer1"),
      initial: "أ",
      text: t("reviewsText1"),
      date: locale === "ar" ? "قبل أسبوع" : "1 week ago",
      rating: 5,
    },
    {
      name: t("reviewer2"),
      initial: "خ",
      text: t("reviewsText2"),
      date: locale === "ar" ? "قبل أسبوعين" : "2 weeks ago",
      rating: 5,
    },
    {
      name: t("reviewer3"),
      initial: "س",
      text: t("reviewsText3"),
      date: locale === "ar" ? "قبل شهر" : "1 month ago",
      rating: 5,
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviewsList.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviewsList.length - 1 : prev - 1));
  };

  // Autoplay Logic
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
  };

  const clickNext = () => {
    handleNext();
    resetAutoplay();
  };

  const clickPrev = () => {
    handlePrev();
    resetAutoplay();
  };

  const selectIndex = (index: number) => {
    setActiveIndex(index);
    resetAutoplay();
  };

  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("navReviews")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t("reviewsTitle")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("reviewsSub")}
          </p>
        </div>

        {/* Rating Overview & Testimonial Slider Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Google Trust Box */}
          <div className="lg:col-span-4 glass p-8 rounded-3xl border border-primary/10 shadow-lg text-center flex flex-col items-center justify-center">
            {/* Google Logo */}
            <div className="flex items-center gap-1.5 mb-4 text-2xl font-black tracking-tight select-none">
              <span className="text-blue-500 font-bold">G</span>
              <span className="text-red-500 font-bold">o</span>
              <span className="text-yellow-500 font-bold">o</span>
              <span className="text-blue-500 font-bold">g</span>
              <span className="text-green-500 font-bold">l</span>
              <span className="text-red-500 font-bold">e</span>
            </div>

            {/* Score */}
            <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-3">4.9</h3>

            {/* Rating Stars (Five stars) */}
            <div className="flex items-center gap-1 text-amber-500 mb-3" aria-label="5 stars rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="currentColor" />
              ))}
            </div>

            {/* Sub-label */}
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {locale === "ar" ? "بناءً على 18+ تقييم حقيقي" : "Based on 18+ real reviews"}
            </p>

            <a
              href="https://maps.app.goo.gl/4bdwupSAb9v6P9RE8"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-xs text-primary dark:text-primary-light font-black hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{locale === "ar" ? "عرض كافة التقييمات على خرائط جوجل" : "View all reviews on Google Maps"}</span>
              <span>→</span>
            </a>
          </div>

          {/* Right Side: Autoplay Testimonial Carousel */}
          <div 
            className="lg:col-span-8 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            
            {/* Slider Content Wrapper */}
            <div className="overflow-hidden min-h-[240px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: locale === "ar" ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: locale === "ar" ? 30 : -30 }}
                  transition={{ duration: 0.4 }}
                  className="w-full glass p-8 sm:p-10 rounded-3xl border border-white/20 dark:border-white/5 shadow-md flex flex-col justify-between"
                >
                  {/* Quote */}
                  <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 italic mb-8 text-center sm:text-start leading-relaxed">
                    &ldquo;{reviewsList[activeIndex].text}&rdquo;
                  </p>

                  {/* Reviewer Details */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary/20 flex-shrink-0">
                        {reviewsList[activeIndex].initial}
                      </div>
                      <div className="text-start">
                        <h4 className="font-extrabold text-gray-900 dark:text-white text-base">
                          {reviewsList[activeIndex].name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {reviewsList[activeIndex].date}
                        </span>
                      </div>
                    </div>

                    {/* Review Stars */}
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(reviewsList[activeIndex].rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Controls & Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              
              {/* Dot Indicators */}
              <div className="flex gap-2.5">
                {reviewsList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => selectIndex(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeIndex === i ? "w-7 bg-primary" : "w-2.5 bg-gray-300 dark:bg-medium-gray"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={clickPrev}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray dark:hover:bg-primary/20 text-gray-700 dark:text-gray-200 transition-colors shadow-sm cursor-pointer"
                  aria-label="Previous review"
                >
                  {locale === "ar" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                
                <button
                  onClick={clickNext}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray dark:hover:bg-primary/20 text-gray-700 dark:text-gray-200 transition-colors shadow-sm cursor-pointer"
                  aria-label="Next review"
                >
                  {locale === "ar" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default Reviews;
