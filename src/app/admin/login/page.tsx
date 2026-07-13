"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, User, Eye, EyeOff, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLogin() {
  const { locale } = useLanguage();
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if session already exists
    const session = localStorage.getItem("code_services_admin_session");
    if (session === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulated Authentication
    setTimeout(() => {
      if (username.trim() === "admin" && password === "code966") {
        localStorage.setItem("code_services_admin_session", "true");
        router.push("/admin");
      } else {
        setError(
          locale === "ar"
            ? "اسم المستخدم أو كلمة المرور غير صحيحة"
            : "Invalid username or password"
        );
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-primary-pale/30 to-white dark:from-dark-gray dark:via-primary/5 dark:to-dark-gray transition-colors">
      
      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 start-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 dark:bg-medium-gray dark:hover:bg-primary/10 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-border-dark text-sm font-bold shadow-sm transition-all"
      >
        {locale === "ar" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        <span>{locale === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md glass p-8 sm:p-10 rounded-3xl border border-primary/15 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Ring */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full filter blur-xl pointer-events-none" />

        {/* Brand/Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 overflow-hidden rounded-2xl border border-primary/20 shadow-md mb-4">
            <Image
              src="/images/logo.jpg"
              alt="كود خدمات"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {locale === "ar" ? "لوحة التحكم | تسجيل الدخول" : "Admin Panel | Login"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">
            {locale === "ar" ? "الرجاء إدخال بيانات الاعتماد للمتابعة" : "Please enter credentials to proceed"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-semibold flex items-center gap-2 text-start">
              <ShieldAlert size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="text-start">
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
              {locale === "ar" ? "اسم المستخدم" : "Username"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={locale === "ar" ? "أدخل اسم المستخدم" : "Enter username"}
                className="w-full ps-12 pe-4 py-3.5 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="text-start">
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase">
              {locale === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-4 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full ps-12 pe-12 py-3.5 rounded-xl bg-white dark:bg-medium-gray border border-gray-200 dark:border-border-dark text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Info Details */}
          <div className="p-3.5 rounded-xl bg-primary/5 text-gray-500 dark:text-gray-400 text-xs font-semibold text-start border border-primary/5">
            💡 {locale === "ar" ? "تجربة لوحة التحكم: استخدم اسم المستخدم admin وكلمة المرور code966 للولوج." : "Demo credentials: use admin as username and code966 as password."}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span>{locale === "ar" ? "جاري التحقق..." : "Verifying..."}</span>
            ) : (
              <span>{locale === "ar" ? "تسجيل الدخول" : "Login"}</span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
