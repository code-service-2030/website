"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { defaultAnnouncement, Announcement } from "@/data/translations";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AnnouncementBar: React.FC = () => {
  const { locale } = useLanguage();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("code_services_announcement");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Announcement;
        setAnnouncement(parsed);
        setVisible(parsed.active);
      } catch (e) {
        setAnnouncement(defaultAnnouncement);
        setVisible(defaultAnnouncement.active);
      }
    } else {
      setAnnouncement(defaultAnnouncement);
      setVisible(defaultAnnouncement.active);
      localStorage.setItem("code_services_announcement", JSON.stringify(defaultAnnouncement));
    }
  }, []);

  // Listen for admin changes (custom event)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("code_services_announcement");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Announcement;
          setAnnouncement(parsed);
          setVisible(parsed.active);
        } catch (e) {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("announcement_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("announcement_updated", handleStorageChange);
    };
  }, []);

  if (!announcement || !visible) return null;

  const announcementText = locale === "ar" ? announcement.textAr : announcement.textEn;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`w-full py-2.5 px-4 text-center text-white text-xs sm:text-sm font-bold flex items-center justify-between relative z-50 transition-colors shadow-sm select-none ${announcement.bgColor || "bg-primary"}`}
        >
          {/* Empty spacer for centering text */}
          <div className="w-6 h-6 hidden sm:block" />
          
          {/* Announcement content */}
          <div className="flex-1 text-center font-extrabold flex items-center justify-center gap-2">
            <span>{announcementText}</span>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Dismiss Announcement"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default AnnouncementBar;
