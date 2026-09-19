/**
 * Comprehensive Automated Test Suite for Smart Arabic Fuzzy Search System.
 * Tests 50+ realistic Saudi citizen & business search queries.
 */

const { defaultServices } = require('../src/data/translations');
const { 
  normalizeArabic, 
  normalizeToken, 
  levenshteinDistance, 
  similarityRatio, 
  searchServices 
} = require('../src/utils/arabicSearch');

console.log("===============================================================");
console.log("STARTING SMART ARABIC SEARCH AUTOMATED TEST SUITE (50+ CASES)");
console.log("===============================================================\n");

let passedCount = 0;
let failedCount = 0;

function assert(condition, description, details = "") {
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    if (details) console.error(`     Details: ${details}`);
    failedCount++;
  }
}

// ─────────────────────────────────────────────
// Group 1: Arabic Normalization Utilities
// ─────────────────────────────────────────────
console.log("▶ GROUP 1: Arabic Normalization & Tashkeel / Tatweel Removal");

assert(
  normalizeArabic("إِصْدَارُ السِّجِلِّ التِّجَارِيِّ") === "اصدار السجل التجاري",
  "Tashkeel stripping on all vowels and tanween"
);

assert(
  normalizeArabic("السجــــــل التجـــــاري") === "السجل التجاري",
  "Tatweel (Kashida) stripping"
);

assert(
  normalizeArabic("أبشر إقامة آفاق ٱستعلام") === "ابشر اقامه افاق استعلام",
  "Alef unification (أ, إ, آ, ٱ -> ا)"
);

assert(
  normalizeArabic("منشأة") === "منشاه" && normalizeArabic("رخصة") === "رخصه",
  "Taa Marbuta normalization to Haa (ة -> ه)"
);

assert(
  normalizeArabic("بلدى") === "بلدي" && normalizeArabic("قوى") === "قوي",
  "Alef Maksura normalization to Yaa (ى -> ي)"
);

assert(
  normalizeToken("السجل") === "سجل" && normalizeToken("والسجل") === "سجل" && normalizeToken("للسجل") === "سجل",
  "Definite article ('ال') and prefix trimming on tokens"
);

// ─────────────────────────────────────────────
// Group 2: Exact & Normalized Queries
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 2: Exact & Normalized Queries");

const exactCases = [
  { q: "تعديل السجل التجاري", expectedId: "commerce-edit-cr" },
  { q: "تجديد السجل التجاري", expectedId: "commerce-renew-cr" },
  { q: "إصدار سجل تجاري", expectedId: "commerce-issue-cr" },
  { q: "شطب السجل التجاري", expectedId: "commerce-cancel-cr" },
  { q: "إصدار رخصة بلدي", expectedId: "muni-issue-license" },
  { q: "تجديد رخصة بلدي", expectedId: "muni-renew-license" },
  { q: "نقل كفالة", expectedId: "qiwa-transfer-sponsorship" },
  { q: "توثيق عقد العمل", expectedId: "qiwa-issue-contracts" },
  { q: "تقديم الإقرارات الضريبية", expectedId: "zatca-vat-returns" },
  { q: "إصدار الوكالات الإلكترونية", expectedId: "najiz-issue-poa" },
  { q: "عقود الإيجار", expectedId: "ops-service-contracts" }
];

for (const { q, expectedId } of exactCases) {
  const res = searchServices(defaultServices, q);
  const found = res.services.some(s => s.id === expectedId);
  const topMatch = res.services[0]?.id;
  assert(found && topMatch === expectedId, `Query "${q}" matches ${expectedId}`, `Top match was: ${topMatch}`);
}

// ─────────────────────────────────────────────
// Group 3: Letter Variations (ة/ه, أ/إ/آ, ى/ي)
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 3: Letter Variations (ة/ه, أ/إ/آ, ى/ي)");

const variationCases = [
  { q: "تعديل السجل التجارى", expectedId: "commerce-edit-cr" },
  { q: "السجل التجارى", expectedId: "commerce-issue-cr" },
  { q: "رخصه بلديه", expectedId: "muni-issue-license" },
  { q: "رخصة بلدى", expectedId: "muni-issue-license" },
  { q: "قوي", expectedId: "qiwa-open-account" },
  { q: "قوى", expectedId: "qiwa-open-account" },
  { q: "تامينات", expectedId: "gosi-add-employee" },
  { q: "التأمينات", expectedId: "gosi-add-employee" },
  { q: "التجاره", expectedId: "commerce-issue-cr" },
  { q: "تجاره", expectedId: "commerce-issue-cr" },
  { q: "ناجز", expectedId: "najiz-issue-poa" },
  { q: "ابشر", expectedId: "absher-renew-iqama" }
];

for (const { q, expectedId } of variationCases) {
  const res = searchServices(defaultServices, q);
  const found = res.services.length > 0;
  assert(found, `Letter variation query "${q}" returned results (${res.services.length} items)`);
}

// ─────────────────────────────────────────────
// Group 4: Typo Tolerance & Fuzzy Matching
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 4: Typo Tolerance & Levenshtein Distance");

const typoCases = [
  { q: "تعدبل السجل التجاري", targetName: "تعديل السجل التجاري" }, // Typo 'ب' instead of 'ي'
  { q: "تعديل السجل التجار", targetName: "تعديل السجل التجاري" }, // Missing 'ي' at end
  { q: "تجديد السحل التجاري", targetName: "تجديد السجل التجاري" }, // Typo 'ح' instead of 'ج'
  { q: "ناجزز", targetName: "الوكالات" }, // Extra letter 'ز'
  { q: "اصدار اقامهه", targetName: "الإقامة" }, // Extra 'ه'
  { q: "رخصه بلديي", targetName: "بلدي" } // Extra 'ي'
];

for (const { q, targetName } of typoCases) {
  const res = searchServices(defaultServices, q);
  const matched = res.services.length > 0 && res.services.some(s => s.titleAr.includes(targetName) || (res.didYouMean && res.didYouMean.includes(targetName)));
  assert(matched, `Typo query "${q}" resolves to "${targetName}" (via match or Did-You-Mean)`);
}

// ─────────────────────────────────────────────
// Group 5: Word Permutations & Partial Queries
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 5: Word Order & Partial Substring Queries");

const permutationCases = [
  { q: "السجل التجاري تعديل", expectedId: "commerce-edit-cr" },
  { q: "السجل تعديل", expectedId: "commerce-edit-cr" },
  { q: "تعديل سجل", expectedId: "commerce-edit-cr" },
  { q: "تعديل السجل", expectedId: "commerce-edit-cr" },
  { q: "سجل تجاري", expectedId: "commerce-issue-cr" },
  { q: "تجديد سجل", expectedId: "commerce-renew-cr" },
  { q: "تجديد السجل", expectedId: "commerce-renew-cr" },
  { q: "رخصة بلدية تجديد", expectedId: "muni-renew-license" },
  { q: "بلدي رخصة", expectedId: "muni-issue-license" },
  { q: "عقد ايجار توثيق", expectedId: "ops-service-contracts" }
];

for (const { q, expectedId } of permutationCases) {
  const res = searchServices(defaultServices, q);
  const found = res.services.some(s => s.id === expectedId);
  assert(found, `Permutation / Partial query "${q}" matched ${expectedId}`);
}

// ─────────────────────────────────────────────
// Group 6: Curated Aliases & Colloquial Keywords
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 6: Curated Aliases & Colloquial Keywords");

const aliasCases = [
  { q: "تعديل بيانات السجل", expectedId: "commerce-edit-cr" },
  { q: "تغيير بيانات السجل", expectedId: "commerce-edit-cr" },
  { q: "تعديل نشاط السجل", expectedId: "commerce-edit-cr" },
  { q: "فتح محل", expectedId: "muni-issue-license" },
  { q: "رخصة كافيه", expectedId: "muni-issue-license" },
  { q: "رخصة مطعم", expectedId: "muni-issue-license" },
  { q: "استخراج سجل", expectedId: "commerce-issue-cr" },
  { q: "عمل سجل تجاري", expectedId: "commerce-issue-cr" },
  { q: "حذف السجل التجاري", expectedId: "commerce-cancel-cr" },
  { q: "اغلاق السجل التجاري", expectedId: "commerce-cancel-cr" },
  { q: "فسخ وكالة", expectedId: "najiz-cancel-poa" },
  { q: "وكالة شرعية", expectedId: "najiz-issue-poa" },
  { q: "اقرار ضريبي", expectedId: "zatca-vat-returns" },
  { q: "فاتورة ضريبية", expectedId: "zatca-vat-returns" },
  { q: "شهادة سلامة", expectedId: "safety-tech-reports" },
  { q: "دفاع مدني", expectedId: "safety-tech-reports" },
  { q: "رخصة قيادة", expectedId: "traffic-license-services" },
  { q: "كرت تشغيل", expectedId: "tga-operating-cards" }
];

for (const { q, expectedId } of aliasCases) {
  const res = searchServices(defaultServices, q);
  const found = res.services.some(s => s.id === expectedId);
  assert(found, `Colloquial alias "${q}" matched target service ${expectedId}`);
}

// ─────────────────────────────────────────────
// Group 7: Did You Mean / Fallback Recommendations
// ─────────────────────────────────────────────
console.log("\n▶ GROUP 7: Did You Mean & Fallback Suggestions");

const fallbackQuery = "سجلل تجااريي";
const fallbackRes = searchServices(defaultServices, fallbackQuery);
assert(
  fallbackRes.didYouMean !== null || fallbackRes.suggestions.length > 0,
  `Gibberish/extreme typo query "${fallbackQuery}" generated Did-You-Mean suggestions`
);

console.log("\n===============================================================");
console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED out of ${passedCount + failedCount} TOTAL`);
console.log("===============================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL ARABIC SEARCH TESTS PASSED WITH 100% ACCURACY!\n");
}
