"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MessageSquare, Clock, MapPin, Send, CheckCircle, Calendar, Map, Check } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/services/db";
import { CountryPhoneInput } from "./CountryPhoneInput";

export const Contact: React.FC = () => {
  const { t, locale } = useLanguage();
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Full number, e.g. "+966501234567"
    service: "",
    message: "",
    appointmentDate: "",
    appointmentTime: "",
    country: "Saudi Arabia",
    countryCode: "+966",
    localPhone: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Prepopulation Event Listener
  useEffect(() => {
    const handlePrepop = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: string; title: string }>;
      if (customEvent.detail) {
        const { category, title } = customEvent.detail;
        
        // Map category ID to select value if needed
        let serviceVal = "";
        if (["business", "absher", "hr", "qiwa", "student", "printing"].includes(category)) {
          serviceVal = category;
        }

        setFormData((prev) => ({
          ...prev,
          service: serviceVal,
          message: locale === "ar" 
            ? `أرغب في التقديم على خدمة: ${title}` 
            : `I would like to apply for the service: ${title}`
        }));

        // Focus the name input
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }
    };

    window.addEventListener("apply_service", handlePrepop);
    return () => window.removeEventListener("apply_service", handlePrepop);
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(false);
  };

  const handlePhoneChange = (fullNum: string, countryName: string, code: string, local: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: fullNum,
      country: countryName,
      countryCode: code,
      localPhone: local
    }));
    setError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.localPhone || !formData.message) {
      setError(true);
      return;
    }

    setIsSubmitting(true);
    setError(false);

    try {
      await db.inquiries.createInquiry({
        name: formData.name,
        email: formData.email || "",
        phone: formData.localPhone, // Store local number in phone field
        service: formData.service || "General",
        message: formData.message,
        appointmentDate: formData.appointmentDate || "",
        appointmentTime: formData.appointmentTime || "",
        status: "pending",
        country: formData.country,
        countryCode: formData.countryCode
      });

      // Show success and reset form
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        appointmentDate: "",
        appointmentTime: "",
        country: "Saudi Arabia",
        countryCode: "+966",
        localPhone: ""
      });
      
      // Clear success banner after 5s
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit inquiry to database:", err);
      setIsSubmitting(false);
      setError(true);
    }
  };

  const contactDetails = [
    {
      icon: <MessageSquare size={22} />,
      label: t("contactWhatsApp"),
      value: "+966 53 707 3161",
      link: "https://wa.me/966537073161",
      btnText: locale === "ar" ? "مراسلة واتساب" : "WhatsApp Chat",
    },
    {
      icon: <Clock size={22} />,
      label: t("contactHours"),
      value: t("contactHoursVal"),
      info: locale === "ar" ? "طوال أيام الأسبوع" : "All week days",
    },
    {
      icon: <MapPin size={22} />,
      label: t("contactAddressLabel"),
      value: locale === "ar" ? "جدة - حي الفلاح - شارع الحسن بن الحارث" : "Jeddah - Al Falah - Al-Hasan Ibn Al-Harith",
    },
  ];

  const handleBookBtnClick = () => {
    const dateInput = document.getElementById("appointmentDate");
    if (dateInput) {
      dateInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => dateInput.focus(), 600);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-gray transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 select-none">
          <span className="text-primary dark:text-primary-light font-extrabold text-sm uppercase tracking-wider mb-3 block">
            {t("navContact")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t("contactSub")}
          </h2>
        </div>

        {/* Quick Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto select-none">
          {/* WhatsApp */}
          <a
            href="https://wa.me/966537073161"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:text-white border border-emerald-500/10 shadow-sm transition-all duration-300 group cursor-pointer"
          >
            <MessageSquare size={24} className="mb-2 transition-transform group-hover:scale-110" />
            <span className="font-extrabold text-xs sm:text-sm">
              {locale === "ar" ? "مراسلة واتساب" : "WhatsApp Chat"}
            </span>
          </a>

          {/* Google Maps */}
          <a
            href="https://maps.app.goo.gl/4bdwupSAb9v6P9RE8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-blue-500/5 hover:bg-blue-500 text-blue-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:hover:text-white border border-blue-500/10 shadow-sm transition-all duration-300 group cursor-pointer"
          >
            <Map size={24} className="mb-2 transition-transform group-hover:scale-110" />
            <span className="font-extrabold text-xs sm:text-sm">
              {locale === "ar" ? "خرائط جوجل" : "Google Maps"}
            </span>
          </a>

          {/* Book Appointment */}
          <button
            onClick={handleBookBtnClick}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-amber-500/5 hover:bg-amber-500 text-amber-600 hover:text-white dark:bg-amber-500/10 dark:text-amber-400 dark:hover:text-white border border-amber-500/10 shadow-sm transition-all duration-300 group cursor-pointer"
          >
            <Calendar size={24} className="mb-2 transition-transform group-hover:scale-110" />
            <span className="font-extrabold text-xs sm:text-sm">
              {locale === "ar" ? "حجز موعد" : "Book Appointment"}
            </span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details (Left Side) */}
          <div className="lg:col-span-5 space-y-6">
            {contactDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-6 rounded-2xl border border-primary/5 dark:border-white/5 shadow-sm flex items-start gap-4"
              >
                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light flex items-center justify-center flex-shrink-0">
                  {detail.icon}
                </div>

                {/* Text and Actions */}
                <div className="flex-1 text-start">
                  <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-1">
                    {detail.label}
                  </h4>
                  <p className="text-lg font-extrabold text-gray-800 dark:text-gray-100">
                    {detail.value}
                  </p>
                  {detail.link && (
                    <a
                      href={detail.link}
                      target={detail.link.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary dark:bg-white/5 dark:hover:bg-primary text-primary hover:text-white dark:text-primary-light dark:hover:text-white font-bold text-xs transition-colors cursor-pointer border border-primary/15"
                    >
                      <span>{detail.btnText}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form (Right Side) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 glass p-8 sm:p-10 rounded-3xl border border-primary/10 shadow-lg"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                  {locale === "ar" ? "تم الإرسال بنجاح!" : "Sent Successfully!"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
                  {t("contactFormSuccess")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold text-start">
                    {t("contactFormError")}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="text-start">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
                      {t("contactFormName")} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      ref={nameInputRef}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={locale === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Phone */}
                  <div className="text-start">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
                      {t("contactFormPhone")} <span className="text-primary">*</span>
                    </label>
                    <CountryPhoneInput
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="5xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="text-start">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
                      {t("contactFormEmail")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-sm"
                    />
                  </div>

                  {/* Requested Service Category */}
                  <div className="text-start">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
                      {t("contactFormService")}
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-sm cursor-pointer"
                    >
                      <option value="">{locale === "ar" ? "اختر تصنيف الخدمة" : "Select Service Category"}</option>
                      <option value="business">{locale === "ar" ? "🏢 مركز الأعمال" : "🏢 Business Center"}</option>
                      <option value="absher">{locale === "ar" ? "👤 أبشر للأفراد" : "👤 Absher Individual"}</option>
                      <option value="hr">{locale === "ar" ? "💼 الموارد البشرية" : "💼 Human Resources"}</option>
                      <option value="qiwa">{locale === "ar" ? "⚙️ منصة قوى" : "⚙️ Qiwa Platform"}</option>
                      <option value="student">{locale === "ar" ? "🎓 الخدمات الطلابية" : "🎓 Student Services"}</option>
                      <option value="printing">{locale === "ar" ? "🖨️ الطباعة والتصوير" : "🖨️ Printing & Copying"}</option>
                    </select>
                  </div>
                </div>

                {/* Optional Appointment Date/Time Booking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-primary/5 dark:bg-white/5 border border-primary/10">
                  <div className="text-start col-span-2 text-xxs font-black uppercase text-primary/60 dark:text-primary-light mb-1">
                    🗓️ {locale === "ar" ? "حجز موعد مسبق في المكتب (اختياري)" : "Book Office Appointment (Optional)"}
                  </div>
                  
                  {/* Appointment Date */}
                  <div className="text-start">
                    <label className="block text-xxs font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase">
                      {locale === "ar" ? "تاريخ الموعد" : "Appointment Date"}
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      id="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-xs cursor-pointer"
                    />
                  </div>

                  {/* Appointment Time */}
                  <div className="text-start">
                    <label className="block text-xxs font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase">
                      {locale === "ar" ? "وقت الموعد" : "Preferred Time"}
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-bold text-xs cursor-pointer"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="text-start">
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
                    {t("contactFormMessage")} <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={locale === "ar" ? "اكتب تفاصيل معاملتك هنا..." : "Type your transaction details here..."}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? t("loading") : t("contactFormSubmit")}</span>
                </button>

              </form>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
};
export default Contact;
