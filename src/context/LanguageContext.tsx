"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/data/translations";

type Theme = "light" | "dark";

interface LanguageContextType {
  locale: Language;
  dir: "rtl" | "ltr";
  t: (key: keyof typeof translations["ar"]) => string;
  toggleLanguage: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Language>("ar");
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read preference from localStorage
    const savedLocale = localStorage.getItem("locale") as Language;
    if (savedLocale === "en" || savedLocale === "ar") {
      setLocale(savedLocale);
    } else {
      // Default to Arabic for Saudi services
      setLocale("ar");
    }

    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Set html direction and lang
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    localStorage.setItem("locale", locale);
  }, [locale, mounted]);

  useEffect(() => {
    if (!mounted) return;
    // Set dark class on document element
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleLanguage = () => {
    setLocale((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const t = (key: keyof typeof translations["ar"]): string => {
    const translationSet = translations[locale] || translations["ar"];
    return translationSet[key] || translations["ar"][key] || String(key);
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  // Render dummy context before hydration to prevent mismatch
  if (!mounted) {
    const fallbackValue: LanguageContextType = {
      locale: "ar",
      dir: "rtl",
      t: (key) => translations["ar"][key] || String(key),
      toggleLanguage: () => {},
      theme: "light",
      toggleTheme: () => {},
    };

    return (
      <LanguageContext.Provider value={fallbackValue}>
        <div style={{ visibility: "hidden" }}>
          {children}
        </div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, dir, t, toggleLanguage, theme, toggleTheme }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
