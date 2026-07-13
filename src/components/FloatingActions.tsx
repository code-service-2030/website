"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MessageCircle, Phone, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppPopup from "@/components/WhatsAppPopup";

export const FloatingActions: React.FC = () => {
  const { locale } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className={`fixed bottom-6 z-40 flex flex-col gap-3.5 ${locale === "ar" ? "left-6" : "right-6"}`}>
        
        {/* Back To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToTop}
              className="p-3.5 rounded-full bg-primary hover:bg-primary-dark text-white shadow-xl transition-all cursor-pointer border border-white/20 hover:scale-105"
              aria-label="Back to top"
            >
              <ArrowUp size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Sticky Call Button */}
        <a
          href="tel:+966537073161"
          className="p-4 rounded-full bg-primary text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center border border-white/20 cursor-pointer"
          aria-label="Call Code Services"
        >
          <Phone size={24} />
        </a>

        {/* Sticky WhatsApp Button */}
        <button
          onClick={() => setIsWhatsAppOpen(true)}
          className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center border border-white/20 relative cursor-pointer"
          aria-label="WhatsApp Code Services"
        >
          {/* Glow pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none" />
          <MessageCircle size={24} fill="currentColor" />
        </button>

      </div>

      {/* Smart WhatsApp Popup */}
      <AnimatePresence>
        {isWhatsAppOpen && (
          <WhatsAppPopup isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
export default FloatingActions;
