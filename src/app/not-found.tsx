"use client";

import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-gray text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center space-y-6 max-w-md">
        
        {/* Animated Accent */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent blur opacity-30 animate-pulse"></div>
          <h1 className="relative text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent select-none font-poppins">
            404
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black font-cairo">
            الصفحة غير موجودة
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-cairo leading-relaxed">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون تم نقلها أو حذفها.
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-border-dark pt-6 space-y-2">
          <h2 className="text-lg font-bold font-poppins">
            Page Not Found
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-poppins leading-relaxed">
            Sorry, we couldn&apos;t find the page you are looking for. It might have been removed or renamed.
          </p>
        </div>

        <div className="pt-4 select-none">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-extrabold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer"
          >
            <Home size={16} />
            <span className="font-cairo">العودة للرئيسية</span>
            <span className="mx-1">/</span>
            <span className="font-poppins">Back Home</span>
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  );
}
