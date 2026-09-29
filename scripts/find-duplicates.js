const fs = require('fs');
const path = require('path');

// 1. Load extracted catalog
const rawExtracted = JSON.parse(fs.readFileSync('C:/Users/XPRISTO/.gemini/antigravity/scratch/abu_suhail_extracted_data.json', 'utf8'));
const extractedProducts = [];
rawExtracted.categories.forEach(cat => {
  (cat.products || []).forEach(p => {
    extractedProducts.push({
      id: p.id,
      name: p.name,
      category: cat.name,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      price: p.sale_price || p.regular_price || 0,
      promotion_title: p.promotion_title || '',
      image: p.image || ''
    });
  });
});
console.log('Total extracted products from json:', extractedProducts.length);

// Helper for Arabic normalization
function normalize(str) {
  if (!str) return '';
  return str
    .replace(/[\u064B-\u065F\u0640]/g, '') // tashkeel and tatweel
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function cleanKeywords(str) {
  return normalize(str)
    .replace(/\b(خدمه|خدمات|طلب|تسجيل|اصدار|تجديد|في|من|علي|عبر|منصه|موقع|برنامج)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 2. Read translations.ts
const transContent = fs.readFileSync(path.join(__dirname, '../src/data/translations.ts'), 'utf8');
const startToken = 'export const defaultServices: ServiceItem[] = [';
const endToken = 'export const defaultFAQs: FAQItem[] = [';
const startIdx = transContent.indexOf(startToken);
const endIdx = transContent.indexOf(endToken);

const servicesSlice = transContent.substring(startIdx + startToken.length - 1, endIdx).trim().replace(/;$/, '');
const currentServices = eval(servicesSlice);
console.log('Current defaultServices in translations.ts:', currentServices.length);

// Compare pairs in currentServices
const duplicateGroups = [];
const seen = new Set();

for (let i = 0; i < currentServices.length; i++) {
  if (seen.has(i)) continue;
  const s1 = currentServices[i];
  const n1 = normalize(s1.titleAr);
  const k1 = cleanKeywords(s1.titleAr);
  const group = [ { index: i, service: s1 } ];

  for (let j = i + 1; j < currentServices.length; j++) {
    if (seen.has(j)) continue;
    const s2 = currentServices[j];
    const n2 = normalize(s2.titleAr);
    const k2 = cleanKeywords(s2.titleAr);

    let isDuplicate = false;
    let reason = '';

    if (s1.id === s2.id) {
      isDuplicate = true;
      reason = 'Same ID (' + s1.id + ')';
    } else if (n1 === n2) {
      isDuplicate = true;
      reason = 'Exact normalized title: "' + s1.titleAr + '" === "' + s2.titleAr + '"';
    } else if (k1.length > 5 && k2.length > 5 && k1 === k2) {
      isDuplicate = true;
      reason = 'Identical core keywords: "' + k1 + '"';
    }

    if (isDuplicate) {
      group.push({ index: j, service: s2, reason });
      seen.add(j);
    }
  }

  if (group.length > 1) {
    seen.add(i);
    duplicateGroups.push(group);
  }
}

console.log('--- DUPLICATE GROUPS FOUND:', duplicateGroups.length, '---');
duplicateGroups.forEach((g, idx) => {
  console.log(`\nGroup #${idx + 1}:`);
  g.forEach(item => {
    console.log(`  - [idx: ${item.index}] ID: ${item.service.id} | Title: "${item.service.titleAr}" | Price: ${item.service.price} | Cat: ${item.service.categoryId} ${item.reason ? ' (' + item.reason + ')' : ''}`);
  });
});
