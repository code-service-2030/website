"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface Country {
  nameAr: string;
  nameEn: string;
  code: string;
  flag: string;
}

export const countries: Country[] = [
  { nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { nameAr: "مصر", nameEn: "Egypt", code: "+20", flag: "🇪🇬" },
  { nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { nameAr: "الكويت", nameEn: "Kuwait", code: "+965", flag: "🇰🇼" },
  { nameAr: "البحرين", nameEn: "Bahrain", code: "+973", flag: "🇧🇭" },
  { nameAr: "عمان", nameEn: "Oman", code: "+968", flag: "🇴🇲" },
  { nameAr: "قطر", nameEn: "Qatar", code: "+974", flag: "🇶🇦" },
  { nameAr: "الأردن", nameEn: "Jordan", code: "+962", flag: "🇯🇴" },
  { nameAr: "اليمن", nameEn: "Yemen", code: "+967", flag: "🇾🇪" },
  { nameAr: "العراق", nameEn: "Iraq", code: "+964", flag: "🇮🇶" },
  { nameAr: "سوريا", nameEn: "Syria", code: "+963", flag: "🇸🇾" },
  { nameAr: "لبنان", nameEn: "Lebanon", code: "+961", flag: "🇱🇧" },
  { nameAr: "فلسطين", nameEn: "Palestine", code: "+970", flag: "🇵🇸" },
  { nameAr: "الجزائر", nameEn: "Algeria", code: "+213", flag: "🇩🇿" },
  { nameAr: "المغرب", nameEn: "Morocco", code: "+212", flag: "🇲🇦" },
  { nameAr: "تونس", nameEn: "Tunisia", code: "+216", flag: "🇹🇳" },
  { nameAr: "ليبيا", nameEn: "Libya", code: "+218", flag: "🇱🇾" },
  { nameAr: "السودان", nameEn: "Sudan", code: "+249", flag: "🇸🇩" },
];

interface CountryPhoneInputProps {
  value: string; // The full phone number, e.g. "+966501234567"
  onChange: (fullNumber: string, countryName: string, countryCode: string, localNum: string) => void;
  required?: boolean;
  error?: boolean;
  placeholder?: string;
}

export const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({
  value,
  onChange,
  required = false,
  error = false,
  placeholder
}) => {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [localNumber, setLocalNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Initialize and sync values
  useEffect(() => {
    if (!value) {
      setLocalNumber("");
      return;
    }

    // Try to find matching country code prefix
    const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
    const matched = sortedCountries.find(c => value.startsWith(c.code));

    if (matched) {
      setSelectedCountry(matched);
      setLocalNumber(value.replace(matched.code, ""));
    } else if (value.startsWith("+")) {
      // Fallback: If it starts with + but not in our list, use default but keep the value
      setLocalNumber(value);
    } else {
      setLocalNumber(value);
    }
  }, [value]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filter countries list
  const filteredCountries = countries.filter(c => {
    const name = locale === "ar" ? c.nameAr : c.nameEn;
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
    );
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");
    
    const fullNum = country.code + localNumber;
    onChange(fullNum, country.nameEn, country.code, localNumber);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    
    // Clean input to remove non-digit characters except leading +
    let cleaned = inputVal.replace(/[^\d+]/g, "");

    // Auto-detection logic: if user pastes/types a number with country prefix
    if (cleaned.startsWith("+")) {
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find(c => cleaned.startsWith(c.code));
      if (matched) {
        setSelectedCountry(matched);
        const remainder = cleaned.replace(matched.code, "");
        setLocalNumber(remainder);
        onChange(cleaned, matched.nameEn, matched.code, remainder);
        return;
      }
    } else if (cleaned.startsWith("00")) {
      // Convert 00 to +
      cleaned = "+" + cleaned.slice(2);
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find(c => cleaned.startsWith(c.code));
      if (matched) {
        setSelectedCountry(matched);
        const remainder = cleaned.replace(matched.code, "");
        setLocalNumber(remainder);
        onChange(cleaned, matched.nameEn, matched.code, remainder);
        return;
      }
    } else if (cleaned.length >= 7 && !cleaned.startsWith("0") && !cleaned.startsWith("+")) {
      // If it doesn't start with 0 or +, check if it starts with one of our codes without '+'
      const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length);
      const matched = sortedCountries.find(c => cleaned.startsWith(c.code.replace("+", "")));
      if (matched) {
        setSelectedCountry(matched);
        const remainder = cleaned.replace(matched.code.replace("+", ""), "");
        setLocalNumber(remainder);
        onChange(matched.code + remainder, matched.nameEn, matched.code, remainder);
        return;
      }
    }

    // Strip leading zero if it's Saudi and starts with 05
    let finalLocal = cleaned;
    if (selectedCountry.code === "+966" && cleaned.startsWith("0")) {
      finalLocal = cleaned.slice(1);
    }

    setLocalNumber(finalLocal);
    onChange(selectedCountry.code + finalLocal, selectedCountry.nameEn, selectedCountry.code, finalLocal);
  };

  const isRtl = locale === "ar";

  return (
    <div className="w-full text-start relative" ref={dropdownRef}>
      <div className={`flex rounded-xl border bg-white dark:bg-medium-gray transition-all overflow-hidden ${
        error 
          ? "border-red-500 ring-2 ring-red-500/10" 
          : "border-gray-200 dark:border-border-dark focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
      }`}>
        
        {/* Country Code Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-3 border-gray-150 dark:border-border-dark bg-gray-50 dark:bg-medium-gray/50 hover:bg-gray-100 dark:hover:bg-primary/10 transition-colors text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer select-none ${
            isRtl ? "border-l" : "border-r"
          }`}
        >
          <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
          <span className="text-xs font-black dir-ltr">{selectedCountry.code}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {/* Local Number Input */}
        <input
          type="tel"
          value={localNumber}
          onChange={handlePhoneInputChange}
          required={required}
          placeholder={placeholder || (selectedCountry.code === "+966" ? "501234567" : "12345678")}
          className="flex-1 px-4 py-3 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none font-extrabold text-sm tracking-wide dir-ltr text-start"
        />
      </div>

      {/* Searchable Dropdown */}
      {isOpen && (
        <div className={`absolute z-30 mt-1.5 w-64 glass rounded-2xl border border-primary/10 shadow-2xl overflow-hidden py-2 ${
          isRtl ? "right-0" : "left-0"
        }`}>
          
          {/* Search box */}
          <div className="px-3 pb-2 pt-1 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "ابحث عن دولة..." : "Search country..."}
              className="w-full bg-transparent border-none text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* List */}
          <div className="max-h-48 overflow-y-auto mt-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-medium-gray">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-3 text-center text-xxs font-bold text-gray-400">
                {isRtl ? "لا توجد نتائج" : "No results found"}
              </div>
            ) : (
              filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountrySelect(c)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-start text-xs font-bold hover:bg-primary/5 dark:hover:bg-primary/15 transition-colors cursor-pointer ${
                    selectedCountry.code === c.code 
                      ? "bg-primary/5 dark:bg-primary/20 text-primary dark:text-primary-light" 
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm leading-none">{c.flag}</span>
                    <span className="truncate">{locale === "ar" ? c.nameAr : c.nameEn}</span>
                  </div>
                  <span className="text-xxs font-black text-gray-400 dark:text-gray-500 dir-ltr">{c.code}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
