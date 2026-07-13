"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Menu, X, Sun, Moon, Globe, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header: React.FC = () => {
  const { locale, t, toggleLanguage, theme, toggleTheme } = useLanguage();
  const { cartItems, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { label: t("navHome"), href: "#home" },
    { label: t("navServices"), href: "#services" },
    { label: t("navAbout"), href: "#about" },
    { label: t("navReviews"), href: "#reviews" },
    { label: t("navLocation"), href: "#location" },
    { label: t("navContact"), href: "#contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass border-b border-border-light/10 dark:border-border-dark/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand Title */}
        <a href="#home" onClick={(e) => handleScroll(e, "#home")} className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo.jpg"
              alt="كود خدمات Logo"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent transition-all">
            {t("heroTitle")}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors relative py-2 group text-sm lg:text-base"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary dark:bg-primary-light transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Shopping Cart Button */}
          <button
            onClick={openCart}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray dark:hover:bg-primary/20 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer relative"
            aria-label="Open Cart"
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-dark-gray shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-medium-gray dark:hover:bg-primary/20 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark dark:bg-primary/20 dark:hover:bg-primary/30 text-white dark:text-primary-light transition-colors font-semibold text-sm cursor-pointer border border-transparent dark:border-primary/30"
          >
            <Globe size={16} />
            <span>{locale === "ar" ? "English" : "العربية"}</span>
          </button>
        </div>

        {/* Mobile Hamburger Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Shopping Cart Button (Mobile) */}
          <button
            onClick={openCart}
            className="p-2 rounded-lg bg-gray-100 dark:bg-medium-gray text-gray-700 dark:text-gray-200 relative cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingCart size={18} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-dark-gray shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Theme Button (Mobile) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-medium-gray text-gray-700 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language Button (Mobile) */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light flex items-center justify-center font-bold text-xs"
          >
            {locale === "ar" ? "EN" : "عربي"}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-medium-gray text-gray-700 dark:text-gray-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full overflow-hidden bg-white/95 dark:bg-dark-gray/95 backdrop-blur-lg border-t border-border-light/10 dark:border-border-dark/30 shadow-inner"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="py-3 px-4 rounded-xl text-gray-700 hover:text-white dark:text-gray-200 hover:bg-primary dark:hover:bg-primary/30 transition-all font-medium text-base text-start"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Header;
