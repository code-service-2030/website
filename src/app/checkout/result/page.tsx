"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, MessageSquare, Loader2, ArrowRight, X, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db, defaultSystemSettings } from "@/services/db";
import { buildLocalizedMessage } from "@/services/communication";

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "failed" | "error">("failed");
  const [order, setOrder] = useState<any>(null);
  const [locale, setLocale] = useState("ar");
  const [waLink, setWaLink] = useState("");
  const [supportLink, setSupportLink] = useState("");
  
  // Failure technical logs
  const [failureReason, setFailureReason] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Success Modal close handler
  const [modalOpen, setModalOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const paymentId = searchParams.get("id");
  const urlStatus = searchParams.get("status");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");
      if (stored) setLocale(stored);
    }
  }, []);

  // Trap focus inside Success Modal
  useEffect(() => {
    if (loading || paymentStatus !== "paid" || !modalOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = modalElement.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading, paymentStatus, modalOpen]);

  // Handle Escape Key & Prevent Background Scroll
  useEffect(() => {
    if (paymentStatus !== "paid" || !modalOpen) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleModalClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [paymentStatus, modalOpen]);

  useEffect(() => {
    if (!paymentId) {
      setPaymentStatus("error");
      setLoading(false);
      return;
    }

    async function verifyAndLoad() {
      try {
        if (urlStatus === "paid") {
          // 1. Verify checkout session/payment securely on backend
          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ sessionId: paymentId })
          });

          if (!verifyRes.ok) {
            throw new Error("Verification request failed");
          }

          const verifyData = await verifyRes.json();
          if (!verifyData.success) {
            throw new Error("Payment verification failed on server");
          }

          const verifiedOrderId = verifyData.orderId;

          // 2. Load order details from DB
          const orders = await db.orders.getOrders();
          const foundOrder = orders.find(o => o.id === verifiedOrderId);
          if (!foundOrder) {
            throw new Error("Order not found");
          }

          setOrder(foundOrder);
          setPaymentStatus("paid");

          // 3. Construct WhatsApp link using settings
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
            requestId: verifiedOrderId,
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
          setWaLink(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(body)}`);
        } else {
          // If status is failed or cancelled
          const cancelRes = await fetch("/api/cancel", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ sessionId: paymentId })
          });

          if (cancelRes.ok) {
            const cancelData = await cancelRes.json();
            setOrder(cancelData.order);
            setFailureReason(cancelData.failureReason || "Payment declined or cancelled by customer");
            setErrorCode(cancelData.stripeErrorCode || "payment_failed");

            // Setup WhatsApp support link
            const settings = await db.settings.getSettings().catch(() => defaultSystemSettings);
            const cleanPhone = settings.whatsappNumber.replace(/[\s+]/g, "");
            const customerName = cancelData.order?.customerName || "";
            const customerPhone = (cancelData.order?.customerCountryCode || "+966") + (cancelData.order?.customerPhone || "");

            const supportMsg = locale === "ar"
              ? `مرحباً،\nواجهت مشكلة أثناء محاولة دفع طلبي.\n\nرقم الطلب:\n${cancelData.orderId}\n\nاسم العميل:\n${customerName}\nجوال العميل:\n${customerPhone}\n\nالرجاء مساعدتي في إتمام عملية الدفع.`
              : `Hello,\nI encountered a payment issue while placing my order.\n\nOrder ID:\n${cancelData.orderId}\n\nCustomer Name:\n${customerName}\nCustomer Phone:\n${customerPhone}\n\nPlease help me complete my payment.`;

            setSupportLink(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(supportMsg)}`);
          }
          setPaymentStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setPaymentStatus("error");
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [paymentId, urlStatus, locale]);

  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(() => {
      router.push("/");
    }, 250);
  };

  const handleContinueToWhatsApp = () => {
    if (waLink) {
      window.open(waLink, "_blank");
    }
  };

  const handleRetry = async () => {
    if (!order) return;

    setRetrying(true);
    try {
      const servicesSummary = order.services
        .map((item: any) => `${locale === "ar" ? item.titleAr : item.titleEn} (x${item.quantity})`)
        .join(", ");

      const totalAmount = order.services.reduce(
        (acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1),
        0
      );

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
          {isAr ? "جاري التحقق من حالة الدفع، يرجى الانتظار..." : "Verifying payment status, please wait..."}
        </p>
      </div>
    );
  }

  // --- ERROR SCREEN ---
  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans text-center">
        <XCircle size={48} className="text-red-500 mb-4" />
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

  // --- SUCCESS SCREEN ---
  if (paymentStatus === "paid" && order) {
    const subtotal = order.services.reduce((acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);

    return (
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleModalClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 sm:p-6 font-sans cursor-pointer select-none"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-medium-gray/30 border border-gray-200 dark:border-border-dark rounded-3xl p-6 sm:p-8 shadow-xl text-center cursor-default select-text"
            >
              {/* Close button top corner */}
              <button
                ref={closeBtnRef}
                onClick={handleModalClose}
                aria-label={isAr ? "إغلاق" : "Close"}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-medium-gray/20 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-emerald-600 mb-2">
                {isAr ? "تم الدفع بنجاح!" : "Payment Successful!"}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 font-semibold max-w-xs mx-auto leading-relaxed">
                {isAr 
                  ? "شكراً لك. تم تأكيد سداد طلبك بنجاح. يرجى الضغط أدناه للتواصل ومتابعة الطلب." 
                  : "Thank you. Your order payment has been successfully confirmed. Please click below to follow up."}
              </p>

              {/* Order Info Panel */}
              <div className="bg-emerald-50/20 dark:bg-emerald-950/5 rounded-2xl p-4 sm:p-5 text-start space-y-3.5 mb-6 border border-emerald-500/10 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
                  <span className="text-gray-400 font-bold">{isAr ? "رقم الطلب" : "Order ID"}</span>
                  <span className="font-extrabold text-primary dark:text-primary-light select-all">{order.id}</span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
                  <span className="text-gray-400 font-bold">{isAr ? "المبلغ المدفوع" : "Amount Paid"}</span>
                  <span className="font-black text-gray-900 dark:text-white">{subtotal} {isAr ? "ريال" : "SAR"}</span>
                </div>

                <div>
                  <span className="text-gray-400 font-bold block mb-2">{isAr ? "الخدمات المدفوعة" : "Paid Services"}</span>
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

              {/* Confirm to WhatsApp Callout */}
              <button
                onClick={handleContinueToWhatsApp}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <MessageSquare size={16} fill="currentColor" />
                <span>{isAr ? "المتابعة عبر واتساب" : "Continue to WhatsApp"}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- FAILURE SCREEN ---
  const subtotalCancel = order ? order.services.reduce((acc: number, item: any) => acc + (parseFloat(item.price) || 0) * (item.quantity || 1), 0) : 0;

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
        {order && (
          <div className="bg-red-50/20 dark:bg-red-950/5 rounded-2xl p-4 sm:p-5 text-start space-y-3.5 mb-6 border border-red-500/10 font-sans text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
              <span className="text-gray-400 font-bold">{isAr ? "رقم الطلب" : "Order ID"}</span>
              <span className="font-extrabold text-primary dark:text-primary-light select-all">{order.id}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-gray-100 dark:border-border-dark">
              <span className="text-gray-400 font-bold">{isAr ? "المبلغ المطلوب" : "Amount"}</span>
              <span className="font-black text-gray-900 dark:text-white">{subtotalCancel} {isAr ? "ريال" : "SAR"}</span>
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
        )}

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
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {retrying ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>{isAr ? "إعادة المحاولة" : "Try Again"}</span>
          </button>

          {supportLink && (
            <a
              href={supportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageSquare size={16} fill="currentColor" />
              <span>{isAr ? "الدعم الفني عبر واتساب" : "Contact Support via WhatsApp"}</span>
            </a>
          )}
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 py-3 bg-white hover:bg-gray-100 dark:bg-medium-gray/40 dark:hover:bg-medium-gray text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-border-dark rounded-2xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Home size={14} />
          <span>{isAr ? "الرئيسية" : "Return to Home"}</span>
        </button>
      </motion.div>
    </div>
  );
}

export default function CheckoutResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
      </div>
    }>
      <CheckoutResultContent />
    </Suspense>
  );
}
