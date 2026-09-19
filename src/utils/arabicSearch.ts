/**
 * Smart Arabic Fuzzy Search System for Code Services.
 *
 * Implements:
 * 1. Arabic Text Normalization (Tashkeel, Tatweel, Alef variants, Taa Marbuta, Yaa/Alef Maksura, Definite article).
 * 2. Multi-tier Hierarchical Scoring (Exact -> Normalized -> StartsWith -> Token Match -> Curated Aliases -> Keywords -> Fuzzy).
 * 3. Typo Tolerance & Levenshtein Similarity.
 * 4. Curated Aliases & Synonyms Dictionary for Saudi Government & Commercial Services.
 * 5. "Did You Mean / هل تقصد" fallback recommendation generator.
 */

import { ServiceItem } from "@/data/translations";

/**
 * Strips Tashkeel, Tatweel, and standardizes Arabic letters for robust matching.
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    // 1. Remove Tashkeel / Harakat (Fatha, Damma, Kasra, Sukun, Tanween, Shadda)
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // 2. Remove Tatweel / Kashida (ـ)
    .replace(/\u0640/g, "")
    // 3. Normalize Alef variants (إ, أ, آ, ٱ -> ا)
    .replace(/[إأآٱ]/g, "ا")
    // 4. Normalize Taa Marbuta to Haa (ة -> ه) for flexible matching
    .replace(/ة/g, "ه")
    // 5. Normalize Alef Maksura to Yaa (ى -> ي)
    .replace(/ى/g, "ي")
    // 6. Normalize Hamza variants (ؤ -> و, ئ -> ي, ء -> '')
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    // 7. Remove non-alphanumeric punctuation/special characters
    .replace(/[\-_/\\.,;:!?؟()[\]{}'"*#@~`^&+=|<>]/g, " ")
    // 8. Collapse multiple whitespace
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes a single search token, optionally removing the Arabic definite article "ال".
 */
export function normalizeToken(token: string): string {
  let norm = normalizeArabic(token);
  // Strip "ال" prefix if word has at least 4 letters (e.g. "السجل" -> "سجل", "البلدية" -> "بلدية")
  if (norm.startsWith("ال") && norm.length >= 4) {
    norm = norm.slice(2);
  }
  // Strip "و" prefix if followed by "ال" or 4+ letters (e.g. "والسجل" -> "سجل")
  if (norm.startsWith("و") && norm.length >= 4) {
    const withoutWaw = norm.slice(1);
    if (withoutWaw.startsWith("ال") && withoutWaw.length >= 4) {
      norm = withoutWaw.slice(2);
    } else {
      norm = withoutWaw;
    }
  }
  // Strip "لل" prefix (e.g. "للسجل" -> "سجل")
  if (norm.startsWith("لل") && norm.length >= 4) {
    norm = norm.slice(2);
  }
  return norm;
}

/**
 * Calculates Levenshtein Distance between two strings for typo tolerance.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates similarity ratio between two strings (0.0 to 1.0).
 */
export function similarityRatio(a: string, b: string): number {
  const normA = normalizeArabic(a);
  const normB = normalizeArabic(b);
  if (normA === normB) return 1.0;
  const maxLen = Math.max(normA.length, normB.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(normA, normB);
  return Math.max(0, 1.0 - dist / maxLen);
}

/**
 * Curated Aliases & Synonyms Dictionary for Saudi Services.
 * Maps common citizen / business phrases to matching target services and keywords.
 */
export const CURATED_ALIASES_MAP: Record<string, { aliases: string[]; keywords: string[] }> = {
  // Commercial Registration (Ministry of Commerce)
  "commerce-issue-cr": {
    aliases: ["اصدار سجل تجاري", "فتح سجل تجاري", "استخراج سجل", "عمل سجل تجاري", "انشاء سجل تجاري", "تأسيس سجل", "سجل جديد", "سجل تجاري جديد", "سجل مؤسسة", "سجل شركة", "سجل تجاري", "السجل التجاري", "السجل التجارى", "سجل", "السجل"],
    keywords: ["سجل", "تجاري", "اصدار", "وزارة التجارة", "مركز الاعمال", "مؤسسة", "شركة", "سجل تجارى", "التجاره", "تجاره"]
  },
  "commerce-renew-cr": {
    aliases: ["تجديد السجل التجاري", "تجديد سجل تجاري", "تجديد السجل", "تجديد سجل", "تمديد السجل التجاري", "تجديد الرخصه التجارية", "السجل التجاري تجديد", "السجل تجديد"],
    keywords: ["تجديد", "سجل", "تجاري", "وزارة التجارة", "مركز الاعمال", "سجلات", "تجديده"]
  },
  "commerce-edit-cr": {
    aliases: ["تعديل السجل التجاري", "تعديل سجل تجاري", "تعديل السجل", "تعديل سجل", "تعديل بيانات السجل", "تغيير بيانات السجل", "تعديل نشاط السجل", "تعديل الاسم التجاري", "تغيير نشاط المؤسسة", "تعديل السجل التجارى", "تعديل السجل التجار", "السجل التجاري تعديل", "السجل تعديل", "تعدبل السجل التجاري"],
    keywords: ["تعديل", "سجل", "تجاري", "بيانات", "نشاط", "وزارة التجارة", "مركز الاعمال", "تعديله", "تعديل بيانات"]
  },
  "commerce-cancel-cr": {
    aliases: ["شطب السجل التجاري", "شطب سجل تجاري", "شطب السجل", "الغاء السجل التجاري", "حذف السجل التجاري", "اغلاق السجل التجاري", "انهاء السجل", "شطب سجل"],
    keywords: ["شطب", "الغاء", "حذف", "سجل", "تجاري", "اغلاق", "وزارة التجارة"]
  },
  "commerce-reserve-name": {
    aliases: ["حجز اسم تجاري", "حجز اسم", "تسمية تجارية", "اسم مؤسسة", "اسم شركة", "اسم تجاري جديد", "حجز الاسماء التجارية"],
    keywords: ["حجز", "اسم", "تجاري", "اسماء", "تجارة", "وزارة التجارة"]
  },

  // Balady & Municipal Licenses
  "muni-issue-license": {
    aliases: ["اصدار رخصة بلدية", "رخصة بلدية", "رخصة بلدي", "رخصة محل", "رخصة تجارية", "فتح محل", "رخصة كافيه", "رخصة مطعم", "رخصة مغسلة", "بلدى", "بلديه", "منصة بلدي", "بلدي", "البلدية", "بلدي رخصة", "رخصه بلدي"],
    keywords: ["بلدي", "بلدية", "رخصة", "محل", "متجر", "مؤسسة", "امانة", "تراخيص", "بلدى"]
  },
  "muni-renew-license": {
    aliases: ["تجديد رخصة بلدية", "تجديد رخصة بلدي", "تجديد رخصة المحل", "تجديد رخصة تجارية", "تمديد رخصة بلدي", "رخصة بلدية تجديد", "بلدي تجديد"],
    keywords: ["تجديد", "رخصة", "بلدية", "بلدي", "محل", "امانة"]
  },
  "muni-modify-license": {
    aliases: ["تعديل رخصة بلدية", "تعديل رخصة بلدي", "تعديل بيانات رخصة المحل", "نقل موقع محل بلدي", "رخصة بلدية تعديل"],
    keywords: ["تعديل", "رخصة", "بلدية", "بلدي", "محل"]
  },
  "muni-cancel-license": {
    aliases: ["الغاء رخصة بلدية", "شطب رخصة بلدية", "اغلاق رخصة محل", "انهاء رخصة بلدي"],
    keywords: ["الغاء", "شطب", "رخصة", "بلدية", "بلدي"]
  },

  // Qiwa & HR Services
  "qiwa-open-account": {
    aliases: ["فتح حساب قوى", "تفعيل حساب قوى", "منصة قوى", "قوى", "قوي", "تسجيل قوى", "حساب المنشاة قوى"],
    keywords: ["قوى", "قوي", "موارد بشرية", "منشأة", "تفعيل"]
  },
  "qiwa-transfer-sponsorship": {
    aliases: ["نقل كفالة", "نقل كفاله", "نقل خدمات العمالة", "نقل خدمة عامل", "نقل خدمات", "نقل موظف", "طلب نقل كفالة", "نقل كفالة قوى"],
    keywords: ["نقل", "كفالة", "خدمة", "عامل", "موظف", "قوى", "عمالة"]
  },
  "qiwa-issue-contracts": {
    aliases: ["توثيق عقد العمل", "توثيق عقود العمل", "توثيق عقود", "عقد عمل سعودي", "توثيق قوى", "عقود الموظفين", "تسجيل عقد", "توثيق العقود", "عقد العمل توثيق", "اصدار عقود العمل", "انشاء عقد عمل", "عقد عمل موظف", "كتابة عقد"],
    keywords: ["توثيق", "عقود", "عقد", "عمل", "موظف", "قوى"]
  },
  "qiwa-renew-contracts": {
    aliases: ["تجديد عقود العمل", "تجديد عقد العمل", "تمديد عقد العمل", "تجديد العقد"],
    keywords: ["تجديد", "عقود", "عقد", "عمل"]
  },

  // Absher & Passports (Jawazat)
  "absher-issue-iqama": {
    aliases: ["اصدار اقامة", "اصدار هوية مقيم", "عمل اقامة جديدة", "اقامة عامل", "اقامة سائق", "اقامة خادمة", "اصدار اقامه"],
    keywords: ["اقامة", "هوية مقيم", "ابشر", "جوازات", "اصدار", "اقامه"]
  },
  "absher-renew-iqama": {
    aliases: ["تجديد اقامة", "تجديد هوية مقيم", "تمديد اقامة", "تجديد اقامة سائق", "تجديد اقامة عامل", "تجديد اقامه", "ابشر", "الجوازات", "جوازات"],
    keywords: ["تجديد", "اقامة", "مقيم", "ابشر", "جوازات", "اقامه"]
  },
  "absher-exit-reentry-issue": {
    aliases: ["خروج وعودة", "تاشيرة خروج وعودة", "اصدار خروج وعودة", "تمديد خروج وعودة", "تاشيرة سفر", "خروج وعوده"],
    keywords: ["خروج", "عودة", "سفر", "تاشيرة", "ابشر", "جوازات"]
  },

  // ZATCA (Zakat, Tax and Customs)
  "zatca-vat-returns": {
    aliases: ["الاقرار الضريبي", "تقديم الاقرار الضريبي", "ضريبة القيمة المضافة", "زكاة ودخل", "زاتكا", "فاتورة ضريبية", "zatca", "ضريبه", "اقرار ضريبي", "الضريبة", "ضريبة", "تقديم الاقرارات الضريبية", "الاقرارات الضريبية"],
    keywords: ["ضريبة", "اقرار", "زكاة", "زاتكا", "قيمة مضافة", "ضريبية", "zatca", "الضريبة"]
  },
  "zatca-zakat-returns": {
    aliases: ["تقديم الاقرارات الزكوية", "اقرار زكوي", "الزكاة والدخل", "الزكاة"],
    keywords: ["زكاة", "اقرار", "دخل", "زاتكا"]
  },
  "zatca-certificates": {
    aliases: ["شهادة الزكاة", "اصدار شهادة الزكاة", "شهادة الزكاة والضريبة", "الشهادات الزكوية"],
    keywords: ["شهادة", "زكاة", "ضريبة", "زاتكا"]
  },
  "zatca-e-invoicing": {
    aliases: ["الفوترة الالكترونية", "فاتورة الكترونية", "ربط الفاتورة الالكترونية", "الفاتورة الالكترونية"],
    keywords: ["فوترة", "فاتورة", "الكترونية", "زاتكا"]
  },

  // Najiz & Ministry of Justice
  "najiz-issue-poa": {
    aliases: ["وكالة الكترونية", "اصدار وكالة", "عمل وكالة ناجز", "وكالة شرعية", "ناجز", "ناجزز", "وزارة العدل", "اصدار الوكالات الالكترونية", "وكاله الكترونيه", "وكاله", "الوكالات الالكترونية"],
    keywords: ["ناجز", "وكالة", "عدل", "محكمة", "توكيل", "ناجزز", "وكاله"]
  },
  "najiz-cancel-poa": {
    aliases: ["فسخ وكالة", "الغاء وكالة", "فسخ الوكالة", "ابطال وكالة ناجز"],
    keywords: ["فسخ", "وكالة", "ناجز", "عدل"]
  },

  // GOSI (Social Insurance)
  "gosi-add-employee": {
    aliases: ["تسجيل في التامينات", "اضافة مشترك تامينات", "تسجيل سعودي بالتامينات", "التامينات الاجتماعية", "تامينات", "تأمينات", "اضافة المشتركين", "التأمينات"],
    keywords: ["تامينات", "تأمينات", "مشترك", "سعودة", "gosi", "التأمينات"]
  },
  "gosi-register-company": {
    aliases: ["تسجيل المنشاة في التامينات", "فتح ملف تامينات", "تسجيل مؤسسة في التامينات"],
    keywords: ["تامينات", "تسجيل", "منشأة", "gosi"]
  },

  // Contracts & Ejar
  "ops-labor-contracts": {
    aliases: ["عقود العمل", "توثيق عقد عمل", "عقد عمل رسمي"],
    keywords: ["عقود", "عمل", "عقد"]
  },
  "ops-service-contracts": {
    aliases: ["توثيق عقد ايجار", "عقد ايجار الكتروني", "ايجار سكني", "منصة ايجار", "عقد ايجار", "ايجار تجاري", "عقد ايجار توثيق", "عقود الايجار", "عقود ايجار", "عقد ايجار", "الايجار"],
    keywords: ["ايجار", "عقد", "سكني", "تجاري", "شبكة ايجار", "توثيق", "عقود"]
  },

  // Civil Defense & Safety
  "safety-tech-reports": {
    aliases: ["تصريح الدفاع المدني", "شهادة سلامة", "رخصة سلامة", "تقرير سلامة", "ادوات سلامة", "دفاع مدني", "الدفاع المدني", "التقارير الفنية المتعلقة بالسلامة"],
    keywords: ["سلامة", "دفاع مدني", "تصريح", "شهادة", "بلدي", "الدفاع المدني"]
  },

  // Traffic & Vehicles
  "traffic-license-services": {
    aliases: ["تجديد رخصة قيادة", "تجديد رخصة السير", "خدمات الرخص والقيادة", "رخصة قيادة", "مرور", "المرور", "رخص القيادة"],
    keywords: ["مرور", "رخصة قيادة", "قيادة", "رخصة", "المرور"]
  },
  "traffic-transfer-vehicle": {
    aliases: ["نقل ملكية مركبة", "نقل ملكية سيارة", "اسقاط مركبة", "تفويض قيادة", "نقل سيارة"],
    keywords: ["مرور", "سيارة", "مركبة", "نقل ملكية"]
  },

  // Transportation (TGA)
  "tga-operating-cards": {
    aliases: ["بطاقات التشغيل", "كرت تشغيل", "بطاقة تشغيل شاحنة", "هيئة النقل", "كروت التشغيل", "بطاقة تشغيل"],
    keywords: ["نقل", "تشغيل", "بطاقة", "شاحنة", "تراخيص"]
  }
};

export interface SearchMatch {
  service: ServiceItem;
  score: number;
  matchType: "exact" | "normalized" | "starts_with" | "tokens" | "alias" | "keyword" | "partial" | "fuzzy";
  matchedField?: string;
  matchedText?: string;
}

export interface SearchResult {
  query: string;
  normalizedQuery: string;
  matches: SearchMatch[];
  services: ServiceItem[];
  didYouMean: string | null;
  suggestions: ServiceItem[];
  totalMatches: number;
}

/**
 * Main Smart Arabic Search Engine.
 * Performs hierarchical scoring, token alignment, alias matching, and typo-tolerant fuzzy suggestions.
 */
export function searchServices(
  servicesList: ServiceItem[],
  rawQuery: string,
  categoryId: string = "all"
): SearchResult {
  const query = (rawQuery || "").trim();
  const normalizedQuery = normalizeArabic(query);

  // If query is empty, return services filtered by category
  if (!query) {
    const list = categoryId === "all" 
      ? servicesList 
      : servicesList.filter(s => s.categoryId === categoryId);
    return {
      query: "",
      normalizedQuery: "",
      matches: list.map(s => ({ service: s, score: 100, matchType: "exact" })),
      services: list,
      didYouMean: null,
      suggestions: [],
      totalMatches: list.length
    };
  }

  const queryTokens = normalizedQuery
    .split(/\s+/)
    .filter(t => t.length > 0)
    .map(t => normalizeToken(t));

  const scoredMatches: SearchMatch[] = [];

  for (const service of servicesList) {
    // Check category filter
    if (categoryId !== "all" && service.categoryId !== categoryId) {
      continue;
    }

    const titleArNorm = normalizeArabic(service.titleAr || "");
    const titleEnNorm = (service.titleEn || "").toLowerCase().trim();
    const descArNorm = normalizeArabic(service.descAr || "");
    const descEnNorm = (service.descEn || "").toLowerCase().trim();
    const serviceKeywords = (service.keywords || []).map(k => normalizeArabic(k));

    const titleTokens = titleArNorm.split(/\s+/).map(t => normalizeToken(t));

    // Retrieve curated aliases
    const curatedData = CURATED_ALIASES_MAP[service.id];
    const aliases = (curatedData?.aliases || []).map(a => normalizeArabic(a));
    const allKeywords = [...serviceKeywords, ...(curatedData?.keywords || []).map(k => normalizeArabic(k))];

    let bestScore = 0;
    let matchType: SearchMatch["matchType"] = "partial";
    let matchedField = "title";
    let matchedText = service.titleAr;

    // ─────────────────────────────────────────────
    // Level 1: Exact Match (Raw or Normalized)
    // ─────────────────────────────────────────────
    if (titleArNorm === normalizedQuery || titleEnNorm === query.toLowerCase()) {
      bestScore = 100;
      matchType = "exact";
    }

    // ─────────────────────────────────────────────
    // Level 2: Title Starts With Query
    // ─────────────────────────────────────────────
    else if (titleArNorm.startsWith(normalizedQuery) || titleEnNorm.startsWith(query.toLowerCase())) {
      bestScore = 90;
      matchType = "starts_with";
    }

    // ─────────────────────────────────────────────
    // Level 3: Token Alignment (All query tokens match title tokens)
    // ─────────────────────────────────────────────
    else {
      let matchingTokenCount = 0;
      for (const qToken of queryTokens) {
        if (titleTokens.some(tToken => tToken === qToken || tToken.includes(qToken) || qToken.includes(tToken))) {
          matchingTokenCount++;
        }
      }

      if (queryTokens.length > 0 && matchingTokenCount === queryTokens.length) {
        bestScore = 80;
        matchType = "tokens";
      } else if (matchingTokenCount > 0 && matchingTokenCount >= Math.ceil(queryTokens.length * 0.66)) {
        bestScore = 65;
        matchType = "tokens";
      }
    }

    // ─────────────────────────────────────────────
    // Level 4: Curated Aliases Match
    // ─────────────────────────────────────────────
    if (bestScore < 95) {
      for (const alias of aliases) {
        if (alias === normalizedQuery) {
          bestScore = 95;
          matchType = "alias";
          matchedField = "alias";
          matchedText = alias;
          break;
        } else if (alias.startsWith(normalizedQuery)) {
          bestScore = Math.max(bestScore, 85);
          matchType = "alias";
          matchedField = "alias";
          matchedText = alias;
        } else if (alias.includes(normalizedQuery) || normalizedQuery.includes(alias)) {
          bestScore = Math.max(bestScore, 75);
          matchType = "alias";
          matchedField = "alias";
          matchedText = alias;
        } else {
          // Check token overlap in alias
          const aliasTokens = alias.split(/\s+/).map(t => normalizeToken(t));
          const aliasMatchCount = queryTokens.filter(qT => aliasTokens.includes(qT)).length;
          if (queryTokens.length > 0 && aliasMatchCount === queryTokens.length) {
            bestScore = Math.max(bestScore, 72);
            matchType = "alias";
            matchedField = "alias";
            matchedText = alias;
          }
        }
      }
    }

    // ─────────────────────────────────────────────
    // Level 5: Keywords & Department Match
    // ─────────────────────────────────────────────
    if (bestScore < 60) {
      for (const kw of allKeywords) {
        if (kw === normalizedQuery || normalizedQuery.includes(kw)) {
          bestScore = Math.max(bestScore, 60);
          matchType = "keyword";
          matchedField = "keyword";
          matchedText = kw;
          break;
        } else if (queryTokens.some(qT => normalizeToken(kw).includes(qT) || qT.includes(normalizeToken(kw)))) {
          bestScore = Math.max(bestScore, 55);
          matchType = "keyword";
          matchedField = "keyword";
          matchedText = kw;
        }
      }
    }

    // ─────────────────────────────────────────────
    // Level 6: Substring Match in Description or Title
    // ─────────────────────────────────────────────
    if (bestScore < 50) {
      if (titleArNorm.includes(normalizedQuery) || titleEnNorm.includes(query.toLowerCase())) {
        bestScore = Math.max(bestScore, 50);
        matchType = "partial";
      } else if (descArNorm.includes(normalizedQuery) || descEnNorm.includes(query.toLowerCase())) {
        bestScore = Math.max(bestScore, 45);
        matchType = "partial";
        matchedField = "description";
      }
    }

    // ─────────────────────────────────────────────
    // Level 7: Fuzzy & Typo Tolerance (Levenshtein)
    // ─────────────────────────────────────────────
    if (bestScore < 45) {
      // Compare overall string similarity to title
      const simToTitle = similarityRatio(titleArNorm, normalizedQuery);
      if (simToTitle >= 0.70) {
        bestScore = Math.max(bestScore, Math.floor(simToTitle * 50));
        matchType = "fuzzy";
      }

      // Check token by token fuzzy similarity for typos (e.g. "تعدبل" -> "تعديل", "ناجزز" -> "ناجز")
      let fuzzyTokenMatches = 0;
      for (const qToken of queryTokens) {
        for (const tToken of titleTokens) {
          const tokenDist = levenshteinDistance(qToken, tToken);
          // Allow 1-2 char edits depending on token length
          const maxAllowedDist = qToken.length >= 5 ? 2 : 1;
          if (tokenDist <= maxAllowedDist) {
            fuzzyTokenMatches++;
            break;
          }
        }
      }

      if (queryTokens.length > 0 && fuzzyTokenMatches >= queryTokens.length) {
        bestScore = Math.max(bestScore, 48);
        matchType = "fuzzy";
      } else if (fuzzyTokenMatches > 0 && fuzzyTokenMatches >= Math.ceil(queryTokens.length * 0.5)) {
        bestScore = Math.max(bestScore, 42);
        matchType = "fuzzy";
      }

      // Check fuzzy against curated aliases
      for (const alias of aliases) {
        const simToAlias = similarityRatio(alias, normalizedQuery);
        if (simToAlias >= 0.70) {
          bestScore = Math.max(bestScore, Math.floor(simToAlias * 48));
          matchType = "fuzzy";
          matchedField = "alias";
          matchedText = alias;
          break;
        }
      }
    }

    if (bestScore >= 40) {
      scoredMatches.push({
        service,
        score: bestScore,
        matchType,
        matchedField,
        matchedText
      });
    }
  }

  // Sort matches descending by score, then by original order
  scoredMatches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.service.order || 0) - (b.service.order || 0);
  });

  const matchedServices = scoredMatches.map(m => m.service);

  // ─────────────────────────────────────────────
  // Did You Mean & Suggestion Fallback Engine
  // ─────────────────────────────────────────────
  let didYouMean: string | null = null;
  let suggestions: ServiceItem[] = [];

  // If no exact matches or very few matches found, compute closest suggestions
  if (scoredMatches.length === 0 || scoredMatches[0].score < 80) {
    const candidateScores: { service: ServiceItem; sim: number; candidateTitle: string }[] = [];

    for (const service of servicesList) {
      const titleArNorm = normalizeArabic(service.titleAr || "");
      const sim = similarityRatio(titleArNorm, normalizedQuery);
      
      let maxAliasSim = 0;
      let bestAlias = service.titleAr;
      const curatedData = CURATED_ALIASES_MAP[service.id];
      if (curatedData) {
        for (const alias of curatedData.aliases) {
          const aSim = similarityRatio(normalizeArabic(alias), normalizedQuery);
          if (aSim > maxAliasSim) {
            maxAliasSim = aSim;
            bestAlias = service.titleAr;
          }
        }
      }

      // Token overlap ratio for suggestions
      const serviceTokens = titleArNorm.split(/\s+/).map(t => normalizeToken(t));
      let tokenOverlap = 0;
      for (const qT of queryTokens) {
        for (const sT of serviceTokens) {
          if (similarityRatio(qT, sT) >= 0.6) {
            tokenOverlap += 1;
            break;
          }
        }
      }
      const tokenOverlapRatio = queryTokens.length > 0 ? tokenOverlap / queryTokens.length : 0;

      const topSim = Math.max(sim, maxAliasSim, tokenOverlapRatio * 0.85);
      if (topSim >= 0.3) {
        candidateScores.push({ service, sim: topSim, candidateTitle: bestAlias });
      }
    }

    candidateScores.sort((a, b) => b.sim - a.sim);
    const topCandidates = candidateScores.slice(0, 5);

    if (topCandidates.length > 0) {
      suggestions = topCandidates.map(c => c.service);
      if (topCandidates[0].sim >= 0.4) {
        didYouMean = topCandidates[0].service.titleAr;
      }
    }
  }

  return {
    query,
    normalizedQuery,
    matches: scoredMatches,
    services: matchedServices,
    didYouMean,
    suggestions,
    totalMatches: matchedServices.length
  };
}
