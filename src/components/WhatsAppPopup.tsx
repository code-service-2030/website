"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { X, Briefcase, UserCheck, Users, Settings, GraduationCap, Printer, MessageCircle } from "lucide-react";

interface WhatsAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({ isOpen, onClose }) => {
  const { locale } = useLanguage();

  const options = [
    {
      id: "business",
      labelAr: "🏢 خدمات مركز الأعمال",
      labelEn: "🏢 Business Center Services",
      msgAr: "السلام عليكم، أرغب في الاستفسار عن خدمات مركز الأعمال وتأسيس السجلات.",
      msgEn: "Hello, I would like to inquire about Business Center and Commercial Registration services."
    },
    {
      id: "absher",
      labelAr: "👤 خدمات أبشر للأفراد",
      labelEn: "👤 Absher Individual Services",
      msgAr: "السلام عليكم، أرغب في الاستفسار عن خدمات أبشر للأفراد والمواعيد الحكومية.",
      msgEn: "Hello, I would like to inquire about Absher individual and government services."
    },
    {
      id: "hr",
      labelAr: "💼 خدمات الموارد البشرية والضمان",
      labelEn: "💼 Social Security & HR Services",
      msgAr: "السلام عليكم، أرغب في الاستفسار عن التسجيل بالضمان المطور وحساب المواطن أو وثائق العمل الحر.",
      msgEn: "Hello, I would like to inquire about Social Security (Damaan) and Freelance Certificates."
    },
    {
      id: "qiwa",
      labelAr: "⚙️ خدمات منصة قوى والعمل",
      labelEn: "⚙️ Qiwa & Labor Platform Services",
      msgAr: "السلام عليكم، أرغب في الاستفسار عن خدمات منصة قوى والتأشيرات ونقل الكفالة للمؤسسات.",
      msgEn: "Hello, I would like to inquire about Qiwa corporate services and work visas."
    },
    {
      id: "student",
      labelAr: "🎓 الخدمات الطلابية والبحوث",
      labelEn: "🎓 Student & Academic Research",
      msgAr: "السلام عليكم، أرغب في الاستفسار عن الخدمات الطلابية وكتابة البحوث والتقارير.",
      msgEn: "Hello, I would like to inquire about student academic services and research preparation."
    },
    {
      id: "printing",
      labelAr: "🖨️ خدمات الطباعة والتصوير والتجليد",
      labelEn: "🖨️ Printing & Binding Services",
      msgAr: "السلام عليكم، أرغب في الاستفسار عن خدمات طباعة وتصوير المستندات وتجليد الكتب.",
      msgEn: "Hello, I would like to inquire about printing, copying, and book binding services."
    }
  ];

  const handleSelectOption = (msg: string) => {
    const link = `https://wa.me/966537073161?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-gray max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/15 text-start relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-border-dark pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageCircle size={22} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                {locale === "ar" ? "استفسار ذكي" : "Smart Inquiry"}
              </h3>
              <p className="text-xxs text-gray-400 font-bold mt-0.5">
                {locale === "ar" ? "اختر القسم المطلوب لإنشاء نص الرسالة تلقائياً" : "Select category to auto-generate message"}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-medium-gray text-gray-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Question text */}
        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 px-1">
          {locale === "ar" ? "ما هي الخدمة التي تحتاج الاستفسار عنها؟" : "What service do you need to inquire about?"}
        </h4>

        {/* Categories option buttons */}
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {options.map((opt) => {
            const label = locale === "ar" ? opt.labelAr : opt.labelEn;
            const msg = locale === "ar" ? opt.msgAr : opt.msgEn;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(msg)}
                className="w-full text-start py-3.5 px-4 rounded-xl bg-gray-50 hover:bg-emerald-500/10 dark:bg-medium-gray dark:hover:bg-emerald-500/10 border border-gray-100 dark:border-border-dark text-gray-800 dark:text-gray-100 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>{label}</span>
                <span className="text-emerald-500 text-xxs font-black opacity-0 group-hover:opacity-100 transition-opacity">
                  {locale === "ar" ? "اتصال ←" : "Connect →"}
                </span>
              </button>
            );
          })}
        </div>

      </motion.div>
    </div>
  );
};
export default WhatsAppPopup;
