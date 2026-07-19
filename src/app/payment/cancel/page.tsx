"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/services/db";

function CancelPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [locale, setLocale] = useState("ar");
  const [retrying, setRetrying] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");
      if (stored) setLocale(stored);
    }
  }, []);

  const handleRetry = async () => {
    if (!orderId) {
      router.push("/");
      return;
    }

    setRetrying(true);
    try {
      // 1. Fetch order details
      const orders = await db.orders.getOrders();
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      const servicesSummary = order.services
        .map((item: any) => `${locale === "ar" ? item.titleAr : item.titleEn} (x${item.quantity})`)
        .join(", ");

      const totalAmount = order.services.reduce(
        (acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
        0
      );

      // 2. Call checkout API again for new session
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark rounded-3xl p-6 sm:p-8 shadow-xl text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
          <XCircle size={36} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {isAr ? "تم إلغاء عملية الدفع" : "Payment Cancelled"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 font-semibold leading-relaxed">
          {isAr 
            ? "تم إلغاء عملية الدفع أو لم تكتمل بنجاح. لم يتم خصم أي مبالغ من حسابك." 
            : "Your payment checkout session was cancelled or declined. No charges were made."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {retrying ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            <span>{isAr ? "إعادة محاولة الدفع" : "Retry Payment"}</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray/40 dark:hover:bg-medium-gray text-gray-700 dark:text-gray-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} className={isAr ? "rotate-180" : ""} />
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
