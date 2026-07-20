"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, MessageSquare, Home, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, defaultSystemSettings } from "@/services/db";

function CancelPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [locale, setLocale] = useState("ar");
  const [retrying, setRetrying] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [failureReason, setFailureReason] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [supportLink, setSupportLink] = useState("");

  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");
      if (stored) setLocale(stored);
    }
  }, []);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function loadFailureDetails() {
      try {
        // 1. Call cancel endpoint to update order status to failed & extract details
        const response = await fetch("/api/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ sessionId, orderId })
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
          setFailureReason(data.failureReason || "");
          setErrorCode(data.stripeErrorCode || "");

          // 2. Fetch system settings to get support phone
          const settings = await db.settings.getSettings().catch(() => defaultSystemSettings);
          const cleanPhone = settings.whatsappNumber.replace(/[\s+]/g, "");
          const customerName = data.order?.customerName || "";
          const customerPhone = (data.order?.customerCountryCode || "+966") + (data.order?.customerPhone || "");

          // Pre-filled support message
          const supportMsg = locale === "ar"
            ? `مرحباً،\nواجهت مشكلة أثناء محاولة دفع طلبي.\n\nرقم الطلب:\n${orderId}\n\nاسم العميل:\n${customerName}\nجوال العميل:\n${customerPhone}\n\nالرجاء مساعدتي في إتمام عملية الدفع.`
            : `Hello,\nI encountered a payment issue while placing my order.\n\nOrder ID:\n${orderId}\n\nCustomer Name:\n${customerName}\nCustomer Phone:\n${customerPhone}\n\nPlease help me complete my payment.`;

          setSupportLink(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(supportMsg)}`);
        }
      } catch (err) {
        console.error("Error loading failure logs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFailureDetails();
  }, [orderId, sessionId, locale]);

  const handleRetry = async () => {
    if (!orderId || !order) return;

    setRetrying(true);
    try {
      const servicesSummary = order.services
        .map((item: any) => `${locale === "ar" ? item.titleAr : item.titleEn} (x${item.quantity})`)
        .join(", ");

      const totalAmount = order.services.reduce(
        (acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
        0
      );

      // Re-initialize checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          amount: totalAmount,
          services: servicesSummary
        })
      });

      if (!response.ok) {
        throw new Error("Failed to re-initialize checkout session");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Retry checkout failed:", err);
      alert(locale === "ar" ? "فشلت إعادة محاولة الدفع. الرجاء الانتقال للرئيسية." : "Failed to retry payment. Please return to home.");
      setRetrying(false);
    }
  };

  const isAr = locale === "ar";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
          {isAr ? "جاري تحميل تفاصيل الدفع..." : "Loading payment details..."}
        </p>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans text-center">
        <XCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {isAr ? "حدث خطأ غير متوقع" : "Unexpected Error"}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
          {isAr ? "عذراً، لم نتمكن من العثور على تفاصيل الطلب الخاص بك." : "Sorry, we could not find details for your order."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-dark transition-colors cursor-pointer"
        >
          {isAr ? "العودة للرئيسية" : "Return to Home"}
        </button>
      </div>
    );
  }

  const subtotal = order.services.reduce((acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-white dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark rounded-3xl p-6 sm:p-8 shadow-xl text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
          <XCircle size={36} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-red-600 mb-2">
          {isAr ? "فشل عملية الدفع" : "Payment Failed"}
        </h1>
        
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 font-semibold max-w-md mx-auto leading-relaxed">
          {isAr 
            ? "للأسف، لم نتمكن من إتمام عملية الدفع الخاصة بك. قد يحدث هذا لعدة أسباب مثل مشاكل في البطاقة، عدم كفاية الرصيد، مشاكل في الشبكة، أو خطأ غير متوقع." 
            : "Unfortunately we couldn't complete your payment. This can happen for several reasons such as card issues, insufficient funds, network problems, or an unexpected payment error."}
        </p>

        {/* Info card */}
        <div className="bg-red-50/20 dark:bg-red-950/5 rounded-2xl p-4 sm:p-5 text-start space-y-3.5 mb-6 border border-red-500/10 font-sans text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
            <span className="text-gray-400 font-bold">{isAr ? "رقم الطلب" : "Order ID"}</span>
            <span className="font-extrabold text-primary dark:text-primary-light select-all">{order.id}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
            <span className="text-gray-400 font-bold">{isAr ? "المبلغ المطلوب" : "Amount"}</span>
            <span className="font-black text-gray-900 dark:text-white">{subtotal} {isAr ? "ريال" : "SAR"}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
            <span className="text-gray-400 font-bold">{isAr ? "حالة الدفع" : "Payment Status"}</span>
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-black text-xxs border border-red-500/20">
              {isAr ? "🔴 فشلت" : "Failed"}
            </span>
          </div>

          <div>
            <span className="text-gray-400 font-bold block mb-2">{isAr ? "الخدمات المحددة" : "Selected Services"}</span>
            <div className="flex flex-col gap-1.5">
              {order.services.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-white dark:bg-medium-gray/20 px-3 py-2 rounded-lg border border-gray-100 dark:border-border-dark">
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {isAr ? item.titleAr : item.titleEn}
                  </span>
                  <span className="text-xxs font-black text-primary bg-primary/5 px-2 py-0.5 rounded">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Helpful alert */}
        <p className="text-xxs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/5 py-3 px-4 rounded-xl border border-amber-500/10 mb-6 leading-relaxed">
          {isAr 
            ? "لا تقلق، تم حفظ طلبك بأمان ولم يتم تسجيل أي عملية دفع ناجحة." 
            : "Don't worry, your request has been saved and no successful payment was recorded."}
        </p>

        {/* Collapsible Technical Details */}
        {failureReason && (
          <div className="mb-6 text-start border border-gray-100 dark:border-border-dark rounded-2xl overflow-hidden font-sans">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-medium-gray/10 hover:bg-gray-100/50 dark:hover:bg-medium-gray/20 flex justify-between items-center font-bold text-xs text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              <span>{isAr ? "تفاصيل تقنية (Technical Details)" : "Technical Details"}</span>
              {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <AnimatePresence>
              {showTechnicalDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 py-3 bg-white dark:bg-medium-gray/5 border-t border-gray-100 dark:border-border-dark space-y-2 text-xxs font-semibold"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    {isAr ? "رمز الخطأ: " : "Error Code: "}
                    <span className="font-mono text-red-500 select-all font-bold">{errorCode || "N/A"}</span>
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isAr ? "الوصف: " : "Description: "}
                    <span className="text-gray-800 dark:text-gray-200 font-medium block mt-1 p-2 rounded-lg bg-gray-50 dark:bg-dark-gray border border-gray-100 dark:border-border-dark select-all">
                      {failureReason}
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 font-sans">
          {/* Try Again */}
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {retrying ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>{isAr ? "إعادة محاولة الدفع" : "Try Again"}</span>
          </button>

          {/* Contact Support */}
          {supportLink && (
            <button
              onClick={() => window.open(supportLink, "_blank")}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <MessageSquare size={15} fill="currentColor" />
              <span>{isAr ? "التواصل مع الدعم الفني" : "Contact Support via WhatsApp"}</span>
            </button>
          )}

          {/* Return Home */}
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray/40 dark:hover:bg-medium-gray text-gray-700 dark:text-gray-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={14} />
            <span>{isAr ? "العودة للرئيسية" : "Return to Home"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
      </div>
    }>
      <CancelPageContent />
    </Suspense>
  );
}
