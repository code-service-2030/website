"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, MessageSquare, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { db, defaultSystemSettings } from "@/services/db";
import { buildLocalizedMessage } from "@/services/communication";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [locale, setLocale] = useState("ar");
  const [waLink, setWaLink] = useState("");

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Read locale from localStorage or defaults
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");
      if (stored) setLocale(stored);
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError(true);
      setLoading(false);
      return;
    }

    async function verifyAndLoad() {
      try {
        // 1. Verify checkout session securely on backend
        const verifyRes = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ sessionId, orderId })
        });

        if (!verifyRes.ok) {
          throw new Error("Verification request failed");
        }

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          throw new Error("Payment was not completed successfully");
        }

        // 2. Load order details from DB
        const orders = await db.orders.getOrders();
        const foundOrder = orders.find(o => o.id === orderId);
        if (!foundOrder) {
          throw new Error("Order not found");
        }

        setOrder(foundOrder);

        // 3. Update Order Status to "pending" (meaning "New/Pending Staff Action")
        await db.orders.updateOrderStatus(orderId!, "pending");

        // 4. Construct WhatsApp link using settings
        const settings = await db.settings.getSettings().catch(() => defaultSystemSettings);
        const servicesSummary = foundOrder.services
          .map((item: any) => `${locale === "ar" ? item.titleAr : item.titleEn} (x${item.quantity})`)
          .join(", ");
        const categoriesSummary = foundOrder.services
          .map((item: any) => item.categoryId || "general")
          .filter((v: any, i: any, a: any) => a.indexOf(v) === i)
          .join(", ");
        const contactMethodLabel = locale === "ar" ? "واتساب" : "WhatsApp";
        const preferredTimeLabel = foundOrder.preferredTime === "morning" ? (locale === "ar" ? "صباحاً" : "Morning") 
          : foundOrder.preferredTime === "afternoon" ? (locale === "ar" ? "بعد الظهر" : "Afternoon") 
          : (locale === "ar" ? "مساءً" : "Evening");

        const totalPriceLabel = foundOrder.services.reduce((acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
        const totalPriceText = totalPriceLabel > 0 ? `${totalPriceLabel} SAR` : (locale === "ar" ? "حسب الاتفاق" : "Per agreement");

        const payloadData = {
          requestId: orderId!,
          customerName: foundOrder.customerName,
          customerPhone: (foundOrder.customerCountryCode || "+966") + foundOrder.customerPhone,
          customerEmail: foundOrder.customerEmail || "",
          preferredContact: contactMethodLabel,
          preferredTime: preferredTimeLabel,
          generalNotes: foundOrder.generalNotes || "",
          servicesSummary,
          categoriesSummary,
          items: foundOrder.services.map((item: any) => ({
            name: locale === "ar" ? item.titleAr : item.titleEn,
            quantity: item.quantity,
            price: item.price || ""
          })),
          totalPrice: totalPriceText,
          language: locale
        };

        const { body } = buildLocalizedMessage(payloadData, locale, settings);

        const cleanPhone = settings.whatsappNumber.replace(/[\s+]/g, "");
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(body)}`;
        setWaLink(url);
        setLoading(false);
      } catch (err) {
        console.error("Verification error:", err);
        setError(true);
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [sessionId, orderId, locale]);

  const handleContinue = () => {
    if (waLink) {
      window.open(waLink, "_blank");
    }
  };

  const isAr = locale === "ar";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
          {isAr ? "جاري التحقق من حالة الدفع، يرجى الانتظار..." : "Verifying payment status, please wait..."}
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans text-center">
        <h1 className="text-2xl font-black text-red-500 mb-2">
          {isAr ? "فشل التحقق من الدفع" : "Payment Verification Failed"}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
          {isAr 
            ? "لم نتمكن من تأكيد عملية الدفع الخاصة بك أو أن رقم الطلب غير موجود. إذا تم خصم المبلغ، يرجى التواصل معنا مباشرة." 
            : "We could not verify your payment session or the order does not exist. If your card was charged, please contact us."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-dark transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          {isAr ? <ArrowRight size={14} /> : null}
          <span>{isAr ? "العودة للرئيسية" : "Return to Home"}</span>
          {!isAr ? <ArrowRight size={14} /> : null}
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
        className="w-full max-w-lg bg-white dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark rounded-3xl p-6 sm:p-8 shadow-xl text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
          {isAr ? "تم الدفع بنجاح!" : "Payment Successful!"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 font-semibold">
          {isAr 
            ? "شكراً لثقتكم بكود خدمات. تم استلام وتأكيد سداد الرسوم لطلبكم." 
            : "Thank you for choosing Code Services. Your payment has been received."}
        </p>

        {/* Order details summary */}
        <div className="bg-gray-50 dark:bg-dark-gray/50 rounded-2xl p-4 sm:p-5 text-start space-y-3.5 mb-6 border border-gray-100 dark:border-border-dark font-sans text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-gray-200 dark:border-border-dark">
            <span className="text-gray-400 font-bold">{isAr ? "رقم الطلب" : "Request ID"}</span>
            <span className="font-extrabold text-primary dark:text-primary-light select-all">{order.id}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-gray-200 dark:border-border-dark">
            <span className="text-gray-400 font-bold">{isAr ? "إجمالي المبلغ المدفوع" : "Amount Paid"}</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">{subtotal} {isAr ? "ريال" : "SAR"}</span>
          </div>

          <div>
            <span className="text-gray-400 font-bold block mb-2">{isAr ? "الخدمات المطلوبة" : "Requested Services"}</span>
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

        {/* Action Button to Continue to WhatsApp */}
        <button
          onClick={handleContinue}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 relative group"
        >
          <span className="absolute -inset-1 rounded-2xl bg-emerald-500/30 animate-ping group-hover:hidden pointer-events-none" />
          <MessageSquare size={16} fill="currentColor" />
          <span>{isAr ? "الاستمرار إلى واتساب للمتابعة" : "Continue to WhatsApp to Follow Up"}</span>
        </button>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
