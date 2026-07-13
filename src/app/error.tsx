"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if desired
    console.error("Application Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-gray text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center space-y-6 max-w-md w-full glass p-8 rounded-3xl border border-red-500/10 shadow-xl">
        
        {/* Warning Icon with pulse */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center animate-bounce">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black font-cairo text-red-600 dark:text-red-400">
            حدث خطأ غير متوقع!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium font-cairo leading-relaxed">
            عذراً، حدثت مشكلة أثناء تحميل هذه الصفحة. يمكنك محاولة إعادة المحاولة أو الرجوع للصفحة الرئيسية.
          </p>
        </div>

        <div className="border-t border-gray-100 dark:border-border-dark pt-6 space-y-2">
          <h3 className="text-md font-bold font-poppins text-red-600 dark:text-red-400">
            An unexpected error occurred!
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium font-poppins leading-relaxed">
            Sorry, we encountered a problem loading this page. You can try refreshing or returning home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 select-none">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span className="font-cairo">إعادة المحاولة</span>
            <span>/</span>
            <span className="font-poppins">Retry</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-gray-200 dark:border-border-dark cursor-pointer"
          >
            <Home size={14} />
            <span className="font-cairo">الرئيسية</span>
            <span>/</span>
            <span className="font-poppins">Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
