"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { db, defaultSystemSettings } from "@/services/db";
import { CountryPhoneInput } from "./CountryPhoneInput";
import { CommunicationRouter } from "@/services/communication";
import { X, ShoppingBag, Trash2, Plus, Minus, Send, ArrowLeft, ArrowRight, CheckCircle, MessageSquare, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer: React.FC = () => {
  const { locale, t } = useLanguage();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateItemQuantity,
    updateItemNotes,
    removeFromCart,
    clearCart,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Cart Summary, 2 = Customer Info

  // Customer Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "", // Full number, e.g. "+966501234567"
    email: "",
    contactMethod: "whatsapp", // whatsapp, call, email
    preferredTime: "afternoon", // morning, afternoon, evening
    generalNotes: "",
    country: "Saudi Arabia",
    countryCode: "+966",
    localPhone: ""
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systemSettings, setSystemSettings] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch system settings from Supabase
    db.settings.getSettings().then(setSystemSettings).catch(console.error);
  }, []);

  if (!mounted) return null;

  // Calculate prices
  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const totalServices = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const estimatedTotalPrice = cartItems.reduce((acc, item) => {
    const unitPrice = parsePrice(item.service.price);
    return acc + unitPrice * item.quantity;
  }, 0);

  const hasPrices = cartItems.some(item => parsePrice(item.service.price) > 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handlePhoneChange = (fullNum: string, countryName: string, code: string, local: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      phone: fullNum,
      country: countryName,
      countryCode: code,
      localPhone: local
    }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!customerInfo.name.trim()) newErrors.name = true;
    if (!customerInfo.localPhone.trim()) newErrors.phone = true;
    
    // Simple phone regex check (should be at least 7 digits)
    const phoneClean = customerInfo.localPhone.replace(/\D/g, "");
    if (phoneClean.length < 7) newErrors.phone = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    let createdOrder;
    try {
      createdOrder = await db.orders.createOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.localPhone, // Store local number in phone field
        customerEmail: customerInfo.email,
        contactMethod: customerInfo.contactMethod,
        preferredTime: customerInfo.preferredTime,
        generalNotes: customerInfo.generalNotes,
        status: "pending",
        customerCountry: customerInfo.country,
        customerCountryCode: customerInfo.countryCode,
        services: cartItems.map((item) => ({
          id: "",
          serviceId: item.service.id,
          titleAr: item.service.titleAr,
          titleEn: item.service.titleEn,
          price: item.service.price || "",
          quantity: item.quantity,
          notes: item.notes,
          categoryId: item.service.categoryId,
        }))
      });
    } catch (err) {
      console.error("Failed to save request:", err);
      alert(locale === "ar" ? "حدث خطأ أثناء حفظ الطلب. الرجاء المحاولة مرة أخرى." : "Error saving request. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const requestId = createdOrder.id;

    // Show success notification
    alert(locale === "ar" 
      ? `تم حفظ الطلب بنجاح! رقم طلبك هو: ${requestId}` 
      : `Request saved successfully! Your request ID is: ${requestId}`
    );

    // Compile variables for templates
    const servicesSummary = cartItems
      .map(item => `${locale === "ar" ? item.service.titleAr : item.service.titleEn} (x${item.quantity})`)
      .join(", ");
      
    const categoriesSummary = cartItems
      .map(item => item.service.categoryId || "general")
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(", ");

    const contactMethodLabel = 
      customerInfo.contactMethod === "whatsapp" ? (locale === "ar" ? "واتساب" : "WhatsApp") :
      customerInfo.contactMethod === "call" ? (locale === "ar" ? "اتصال هاتفي" : "Phone Call") :
      (locale === "ar" ? "بريد إلكتروني" : "Email");

    const preferredTimeLabel = 
      customerInfo.preferredTime === "morning" ? (locale === "ar" ? "صباحاً" : "Morning") :
      customerInfo.preferredTime === "afternoon" ? (locale === "ar" ? "بعد الظهر" : "Afternoon") :
      (locale === "ar" ? "مساءً" : "Evening");

    // Retrieve active settings
    const activeSettings = systemSettings || defaultSystemSettings;

    // Run router
    const routeRes = await CommunicationRouter.route(
      customerInfo.contactMethod,
      {
        requestId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        preferredContact: contactMethodLabel,
        preferredTime: preferredTimeLabel,
        generalNotes: customerInfo.generalNotes,
        servicesSummary,
        categoriesSummary
      },
      activeSettings
    );

    setIsSubmitting(false);
    clearCart();
    setStep(1);
    closeCart();

    if (routeRes.success && routeRes.redirectUrl) {
      if (customerInfo.contactMethod === "call") {
        // Dialers should be opened in self page to trigger native phone apps
        window.open(routeRes.redirectUrl, "_self");
      } else if (customerInfo.contactMethod === "email") {
        // Handle Gmail compose with mobile app fallback
        try {
          const parsedUrl = new URL(routeRes.redirectUrl);
          const to = parsedUrl.searchParams.get("to") || "";
          const subject = parsedUrl.searchParams.get("su") || "";
          const body = parsedUrl.searchParams.get("body") || "";
          
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          if (isMobile) {
            const appUrl = `googlegmail:///co?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = appUrl;
            document.body.appendChild(iframe);
            
            const start = Date.now();
            setTimeout(() => {
              document.body.removeChild(iframe);
              if (Date.now() - start < 1500) {
                window.open(routeRes.redirectUrl, "_blank");
              }
            }, 1000);
          } else {
            window.open(routeRes.redirectUrl, "_blank");
          }
        } catch (e) {
          console.error("Failed to parse Gmail compose URL:", e);
          window.open(routeRes.redirectUrl, "_blank");
        }
      } else {
        // WhatsApp opened in new tab
        window.open(routeRes.redirectUrl, "_blank");
      }
    } else if (routeRes.error) {
      console.error("Communication routing error:", routeRes.error);
    }
  };

  const isRtl = locale === "ar";

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className={`absolute inset-y-0 ${isRtl ? "left-0" : "right-0"} max-w-full flex`}>
            {/* Slide-over Content Box */}
            <motion.div
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-dark-gray text-gray-900 dark:text-white shadow-2xl flex flex-col h-full border-l border-primary/10 dark:border-white/5"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-border-dark flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light">
                    <ShoppingBag size={20} />
                  </div>
                  <h2 className="text-lg font-black">
                    {locale === "ar" ? "سلة طلبات الخدمات" : "Service Cart"}
                  </h2>
                </div>
                
                <button
                  onClick={closeCart}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-medium-gray text-gray-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="p-5 rounded-full bg-gray-50 dark:bg-medium-gray/30 text-gray-400 dark:text-gray-600 mb-4 animate-bounce">
                      <ShoppingBag size={48} />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200 mb-1">
                      {locale === "ar" ? "سلة الخدمات فارغة حالياً" : "Your cart is empty"}
                    </h3>
                    <p className="text-xs text-gray-400 max-w-xs font-semibold">
                      {locale === "ar"
                        ? "تصفح الخدمات المتنوعة وأضف ما ترغب بطلبه للسلة لإرسالها دفعة واحدة"
                        : "Browse services and add what you need to submit multiple requests at once"}
                    </p>
                  </div>
                ) : step === 1 ? (
                  /* STEP 1: CART SUMMARY */
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const title = locale === "ar" ? item.service.titleAr : item.service.titleEn;
                      const categoryLabel = item.service.categoryId === "business" ? (locale === "ar" ? "🏢 مركز الأعمال" : "🏢 Business") :
                        item.service.categoryId === "absher" ? (locale === "ar" ? "👤 أبشر للأفراد" : "👤 Absher") :
                        item.service.categoryId === "hr" ? (locale === "ar" ? "💼 الموارد البشرية" : "💼 HR") :
                        item.service.categoryId === "qiwa" ? (locale === "ar" ? "⚙️ منصة قوى" : "⚙️ Qiwa") :
                        item.service.categoryId === "student" ? (locale === "ar" ? "🎓 خدمات طلابية" : "🎓 Students") :
                        (locale === "ar" ? "🖨️ طباعة وتصوير" : "🖨️ Printing");

                      return (
                        <div
                          key={item.service.id}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-medium-gray/40 border border-gray-100 dark:border-border-dark flex flex-col gap-3"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-xxs font-black text-primary/60 dark:text-primary-light/60 uppercase">
                                {categoryLabel}
                              </span>
                              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
                                {title}
                              </h4>
                              {item.service.price && (
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                                  {item.service.price}
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.service.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title={locale === "ar" ? "إزالة الخدمة" : "Remove service"}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Notes field for this service */}
                          <div>
                            <input
                              type="text"
                              placeholder={locale === "ar" ? "أضف ملاحظات خاصة بهذه الخدمة..." : "Add specific notes for this service..."}
                              value={item.notes}
                              onChange={(e) => updateItemNotes(item.service.id, e.target.value)}
                              className="w-full text-xs font-semibold bg-white dark:bg-dark-gray border border-gray-200 dark:border-border-dark focus:border-primary rounded-xl px-3 py-2 outline-none transition-all placeholder:text-gray-400"
                            />
                          </div>

                          {/* Quantity control */}
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-xxs font-bold text-gray-400">
                              {locale === "ar" ? "العدد / الكمية" : "Quantity"}
                            </span>
                            
                            <div className="flex items-center gap-2 bg-white dark:bg-dark-gray border border-gray-200 dark:border-border-dark rounded-xl px-2 py-1">
                              <button
                                onClick={() => updateItemQuantity(item.service.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-medium-gray rounded text-gray-500"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-extrabold px-1.5 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItemQuantity(item.service.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-medium-gray rounded text-gray-500"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* STEP 2: CUSTOMER INFORMATION FORM */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        {locale === "ar" ? "الاسم الكامل *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder={locale === "ar" ? "مثال: محمد الحربي" : "e.g. John Doe"}
                        className={`w-full bg-gray-50 dark:bg-medium-gray/30 border ${
                          errors.name ? "border-red-500" : "border-gray-200 dark:border-border-dark"
                        } focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all`}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-red-500 font-extrabold mt-1">
                          {locale === "ar" ? "الاسم مطلوب" : "Name is required"}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        {locale === "ar" ? "رقم الجوال *" : "Mobile Number *"}
                      </label>
                      <CountryPhoneInput
                        value={customerInfo.phone}
                        onChange={handlePhoneChange}
                        required
                        error={errors.phone}
                        placeholder={locale === "ar" ? "5XXXXXXXX" : "5XXXXXXXX"}
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-red-500 font-extrabold mt-1">
                          {locale === "ar" ? "يرجى إدخال رقم جوال صحيح" : "Please enter a valid mobile number"}
                        </p>
                      )}
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        {locale === "ar" ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder={locale === "ar" ? "example@domain.com" : "example@domain.com"}
                        className="w-full bg-gray-50 dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all text-start"
                        dir="ltr"
                      />
                    </div>

                    {/* Contact Method */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        {locale === "ar" ? "طريقة التواصل المفضلة *" : "Preferred Contact Method *"}
                      </label>
                      <select
                        name="contactMethod"
                        value={customerInfo.contactMethod}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all cursor-pointer"
                      >
                        <option value="whatsapp">{locale === "ar" ? "واتساب (WhatsApp)" : "WhatsApp"}</option>
                        <option value="call">{locale === "ar" ? "اتصال هاتفي (Call)" : "Phone Call"}</option>
                        <option value="email">{locale === "ar" ? "بريد إلكتروني (Email)" : "Email"}</option>
                      </select>
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        {locale === "ar" ? "وقت التواصل المفضل *" : "Preferred Time *"}
                      </label>
                      <select
                        name="preferredTime"
                        value={customerInfo.preferredTime}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all cursor-pointer"
                      >
                        <option value="morning">{locale === "ar" ? "صباحاً (من 9 إلى 12)" : "Morning (9 AM - 12 PM)"}</option>
                        <option value="afternoon">{locale === "ar" ? "بعد الظهر (من 1 إلى 5)" : "Afternoon (1 PM - 5 PM)"}</option>
                        <option value="evening">{locale === "ar" ? "مساءً (من 6 إلى 11)" : "Evening (6 PM - 11 PM)"}</option>
                      </select>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                        {locale === "ar" ? "ملاحظات إضافية" : "Additional General Notes"}
                      </label>
                      <textarea
                        name="generalNotes"
                        rows={3}
                        value={customerInfo.generalNotes}
                        onChange={handleInputChange}
                        placeholder={locale === "ar" ? "أضف أي تفاصيل أخرى هنا..." : "Add any other request details here..."}
                        className="w-full bg-gray-50 dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all resize-none"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 dark:border-border-dark bg-gray-50 dark:bg-medium-gray/20">
                  {/* Summary rows */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400">
                      <span>{locale === "ar" ? "عدد الخدمات المضافة" : "Total Services Added"}</span>
                      <span>{totalServices}</span>
                    </div>

                    {hasPrices && (
                      <div className="flex justify-between items-center font-extrabold text-base">
                        <span>{locale === "ar" ? "إجمالي الرسوم التقريبية" : "Estimated Total"}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {estimatedTotalPrice} {locale === "ar" ? "ريال" : "SAR"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {step === 1 ? (
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      <span>{locale === "ar" ? "الاستمرار بالطلب" : "Continue Request"}</span>
                      {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-4 text-white rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
                          customerInfo.contactMethod === "whatsapp"
                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                            : customerInfo.contactMethod === "email"
                            ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                        }`}
                      >
                        {customerInfo.contactMethod === "whatsapp" ? (
                          <MessageSquare size={16} fill="currentColor" />
                        ) : customerInfo.contactMethod === "email" ? (
                          <Mail size={16} />
                        ) : (
                          <Phone size={16} />
                        )}
                        <span>
                          {isSubmitting ? (
                            locale === "ar" ? "جاري الإرسال..." : "Submitting..."
                          ) : customerInfo.contactMethod === "whatsapp" ? (
                            locale === "ar" ? "إرسال الطلب وفتح واتساب" : "Submit Request & Open WhatsApp"
                          ) : customerInfo.contactMethod === "email" ? (
                            locale === "ar" ? "إرسال الطلب وفتح البريد الإلكتروني" : "Submit Request & Open Email"
                          ) : (
                            locale === "ar" ? "إرسال الطلب والاتصال بالشركة" : "Submit Request & Call Company"
                          )}
                        </span>
                      </button>

                      <button
                        onClick={() => setStep(1)}
                        className="w-full py-3 bg-white hover:bg-gray-100 dark:bg-medium-gray/40 dark:hover:bg-medium-gray text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-border-dark rounded-2xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                        <span>{locale === "ar" ? "العودة لتعديل السلة" : "Back to Edit Cart"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
