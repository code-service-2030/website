const fs = require('fs');
const path = require('path');

const rawExtracted = JSON.parse(fs.readFileSync('C:/Users/XPRISTO/.gemini/antigravity/scratch/abu_suhail_extracted_data.json', 'utf8'));
const extractedList = [];
rawExtracted.categories.forEach(cat => {
  (cat.products || []).forEach(p => {
    extractedList.push({
      id: String(p.id),
      name: p.name.trim(),
      categoryName: cat.name,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      price: p.sale_price || p.regular_price || 0,
      promotion_title: p.promotion_title || '',
      image: p.image || ''
    });
  });
});

console.log('Extracted items count:', extractedList.length);

function normalize(str) {
  if (!str) return '';
  return str
    .replace(/[\u064B-\u065F\u0640]/g, '')
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function tokenize(str) {
  const stopWords = new Set(['خدمه', 'خدمات', 'طلب', 'تسجيل', 'اصدار', 'تجديد', 'في', 'من', 'علي', 'عبر', 'منصه', 'موقع', 'برنامج', 'الكتروني', 'الكترونيه', 'شامل', 'دراسه', 'جدوي', 'ريف']);
  return normalize(str).split(' ').filter(w => w.length > 1 && !stopWords.has(w));
}

// Read translations.ts
const transContent = fs.readFileSync(path.join(__dirname, '../src/data/translations.ts'), 'utf8');
const startToken = 'export const defaultServices: ServiceItem[] = [';
const endToken = 'export const defaultFAQs: FAQItem[] = [';
const startIdx = transContent.indexOf(startToken);
const endIdx = transContent.indexOf(endToken);
const currentServices = eval(transContent.substring(startIdx + startToken.length - 1, endIdx).trim().replace(/;$/, ''));

console.log('Current services count in translations.ts:', currentServices.length);

// Let's analyze overlaps between the old 162 services (indices 0..161) and new 144 services (indices 162..305)
const oldServices = currentServices.filter(s => !s.id.startsWith('ext-') && !s.salePrice && !s.regularPrice);
const newServices = currentServices.filter(s => s.id.startsWith('ext-') || s.salePrice || s.regularPrice);

console.log('Old services (from original site):', oldServices.length);
console.log('New/Extracted services in current site:', newServices.length);

// Compare old vs new for semantic duplicates
const matches = [];

oldServices.forEach(oldS => {
  const normOld = normalize(oldS.titleAr);
  const tokensOld = tokenize(oldS.titleAr);

  extractedList.forEach(ext => {
    const normExt = normalize(ext.name);
    const tokensExt = tokenize(ext.name);

    let score = 0;
    let reason = '';

    if (normOld === normExt) {
      score = 100;
      reason = 'Exact match';
    } else if (normOld.includes(normExt) || normExt.includes(normOld)) {
      score = 80;
      reason = 'Substring match';
    } else if (tokensOld.length > 0 && tokensExt.length > 0) {
      const intersection = tokensOld.filter(t => tokensExt.includes(t));
      const overlapRatio = (2 * intersection.length) / (tokensOld.length + tokensExt.length);
      if (overlapRatio >= 0.7 && intersection.length >= 2) {
        score = Math.round(overlapRatio * 100);
        reason = `High token overlap (${intersection.join(', ')})`;
      }
    }

    if (score >= 70) {
      matches.push({
        score,
        reason,
        oldId: oldS.id,
        oldTitle: oldS.titleAr,
        oldCat: oldS.categoryId,
        oldPrice: oldS.price,
        extId: ext.id,
        extTitle: ext.name,
        extCat: ext.categoryName,
        extPrice: ext.sale_price || ext.regular_price,
        extRegular: ext.regular_price,
        extSale: ext.sale_price,
        extImage: ext.image,
        extPromo: ext.promotion_title
      });
    }
  });
});

console.log('\n--- MATCHES/OVERLAPS FOUND BETWEEN OLD SERVICES & EXTRACTED FILE:', matches.length, '---');
matches.forEach(m => {
  console.log(`[Score: ${m.score}% | ${m.reason}]`);
  console.log(`   Old Service: "${m.oldTitle}" (ID: ${m.oldId}, Price: ${m.oldPrice}, Cat: ${m.oldCat})`);
  console.log(`   Extracted:   "${m.extTitle}" (Price: ${m.extPrice} SAR [Sale: ${m.extSale}, Reg: ${m.extRegular}], Promo: "${m.extPromo}")\n`);
});
