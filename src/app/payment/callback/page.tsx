"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function CallbackPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [locale, setLocale] = useState("ar");

  const invoiceId = searchParams.get("id");
  const orderId = searchParams.get("orderId");
  const statusParam = searchParams.get("status");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language");
      if (stored) setLocale(stored);
    }
  }, []);

  useEffect(() => {
    if (!invoiceId || !orderId) {
      router.push("/");
      return;
    }

    async function verifyAndRoute() {
      try {
        if (statusParam === "paid") {
          // Call backend verify endpoint to mark order as paid securely
          const verifyRes = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ sessionId: invoiceId, orderId })
          });

          if (verifyRes.ok) {
            const data = await verifyRes.json();
            if (data.success) {
              router.push(`/payment/success?session_id=${invoiceId}&orderId=${orderId}`);
              return;
            }
          }
        }

        // If status was not paid, or verification call failed, treat as failed payment
        await fetch("/api/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ sessionId: invoiceId, orderId })
        }).catch(console.error);

        router.push(`/payment/cancel?orderId=${orderId}&session_id=${invoiceId}`);
      } catch (err) {
        console.error("Callback handling failed:", err);
        router.push(`/payment/cancel?orderId=${orderId}&session_id=${invoiceId}`);
      }
    }

    verifyAndRoute();
  }, [invoiceId, orderId, statusParam, router]);

  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
      <Loader2 size={40} className="text-primary animate-spin mb-4" />
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
        {isAr ? "جاري التحقق من حالة الدفع، يرجى الانتظار..." : "Verifying payment status, please wait..."}
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-gray p-6 font-sans">
        <Loader2 size={40} className="text-primary animate-spin mb-4" />
      </div>
    }>
      <CallbackPageContent />
    </Suspense>
  );
}
