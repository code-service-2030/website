const fs = require('fs');
const path = require('path');

// Load raw extracted data
const rawExtracted = JSON.parse(fs.readFileSync('C:/Users/XPRISTO/.gemini/antigravity/scratch/abu_suhail_extracted_data.json', 'utf8'));

// Build list of extracted items with clean attributes
const extractedItems = [];
rawExtracted.categories.forEach(cat => {
  (cat.products || []).forEach(p => {
    let cleanTitle = p.name.replace(/[.\s]+$/, '').trim();
    // format prices
    const regPriceNum = p.regular_price;
    const salePriceNum = p.sale_price;
    
    let priceStr = 'حسب الاتفاق';
    let salePriceStr = undefined;
    let regularPriceStr = undefined;

    if (salePriceNum && salePriceNum > 0) {
      salePriceStr = `${salePriceNum} ريال`;
      priceStr = salePriceStr;
    }
    if (regPriceNum && regPriceNum > 0) {
      regularPriceStr = `${regPriceNum} ريال`;
      if (!salePriceStr) {
        priceStr = regularPriceStr;
      }
    } else if (regPriceNum === 0 && (!salePriceNum || salePriceNum === 0)) {
      priceStr = 'مجاناً';
    }

    extractedItems.push({
      id: String(p.id),
      titleAr: cleanTitle,
      categoryName: cat.name,
      price: priceStr,
      salePrice: salePriceStr,
      regularPrice: regularPriceStr,
      promotionTitle: p.promotion_title ? p.promotion_title.trim() : undefined,
      image: p.image || undefined,
      url: p.url || undefined
    });
  });
});

console.log('Extracted items loaded:', extractedItems.length);

// Normalization function
function norm(str) {
  if (!str) return '';
  return str
    .replace(/[\u064B-\u065F\u0640]/g, '')
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, '')
    .toLowerCase();
}

// Read translations.ts
const transPath = path.join(__dirname, '../src/data/translations.ts');
let transContent = fs.readFileSync(transPath, 'utf8');

const startToken = 'export const defaultServices: ServiceItem[] = [';
const endToken = 'export const defaultFAQs: FAQItem[] = [';
const startIdx = transContent.indexOf(startToken);
const endIdx = transContent.indexOf(endToken);
const currentServices = eval(transContent.substring(startIdx + startToken.length - 1, endIdx).trim().replace(/;$/, ''));

console.log('Current services count before cleaning:', currentServices.length);

// 1. First, disambiguate the 3 identical title services in different categories
currentServices.forEach(s => {
  if (s.id === 'commerce-add-activities') {
    s.titleAr = 'إضافة أنشطة السجل التجاري';
    s.titleEn = 'Add Commercial Register Activities';
  } else if (s.id === 'invest-add-activities') {
    s.titleAr = 'إضافة أنشطة الاستثمار';
    s.titleEn = 'Add Investment Activities';
  } else if (s.id === 'muni-resolve-notes') {
    s.titleAr = 'معالجة ملاحظات وطلبات بلدي';
    s.titleEn = 'Balady Notes & Requests Resolution';
  } else if (s.id === 'gosi-resolve-requests') {
    s.titleAr = 'معالجة ملاحظات التأمينات الاجتماعية';
    s.titleEn = 'GOSI Notes & Requests Resolution';
  } else if (s.id === 'zatca-update-profile') {
    s.titleAr = 'تعديل بيانات المنشأة بالزكاة والضريبة';
    s.titleEn = 'Update Facility Data in ZATCA';
  } else if (s.id === 'modon-modify-profile') {
    s.titleAr = 'تعديل بيانات المنشأة في مدن';
    s.titleEn = 'Update Facility Data in MODON';
  }
});

// 2. Specific merge: 'commerce-issue-cr' and 'serv-1206607412' ("أستخراج سجل تجاري")
const crIssue = currentServices.find(s => s.id === 'commerce-issue-cr');
const crExtract = extractedItems.find(e => e.id === '1206607412' || e.titleAr.includes('استخراج سجل تجاري') || e.titleAr.includes('أستخراج سجل تجاري'));
if (crIssue && crExtract) {
  crIssue.titleAr = 'إصدار واستخراج سجل تجاري';
  crIssue.titleEn = 'Commercial Registration Issuance';
  crIssue.price = crExtract.price;
  crIssue.regularPrice = crExtract.regularPrice;
  crIssue.salePrice = crExtract.salePrice;
  if (crExtract.image) crIssue.image = crExtract.image;
  if (crExtract.promotionTitle) crIssue.promotionTitle = crExtract.promotionTitle;
}

// Specific merge: 'serv-116356397' ("بكج الوثائق الشهائد و السجلات إلكترونية")
// Specific merge: 'serv-1299058500' ("بكج الوظائف")

// 3. Now let's build the definitive deduplicated list
const finalServices = [];
const seenKeys = new Map(); // key -> service object

currentServices.forEach(s => {
  // Clean trailing dots and spaces from titleAr
  s.titleAr = s.titleAr.replace(/[.\s]+$/, '').trim();

  // If this service is the redundant copy of 'commerce-issue-cr' (id: serv-1206607412 or 312642196), skip it
  if (s.id === 'serv-1206607412' || (s.id.startsWith('serv-') && s.titleAr === 'أستخراج سجل تجاري')) {
    console.log('Skipping redundant duplicate of commercial register:', s.id, s.titleAr);
    return;
  }

  // Check matching extracted item for accurate pricing
  const normTitle = norm(s.titleAr);
  const matchedExt = extractedItems.find(e => norm(e.titleAr) === normTitle || e.id === s.id.replace('serv-', ''));
  if (matchedExt) {
    s.price = matchedExt.price;
    s.salePrice = matchedExt.salePrice;
    s.regularPrice = matchedExt.regularPrice;
    if (matchedExt.image) s.image = matchedExt.image;
    if (matchedExt.promotionTitle) s.promotionTitle = matchedExt.promotionTitle;
  }

  // Deduplication check by normalized title + category
  const key = normTitle;
  if (seenKeys.has(key)) {
    const existing = seenKeys.get(key);
    console.log(`Duplicate detected: "${s.titleAr}" (${s.id}) -> matches existing "${existing.titleAr}" (${existing.id})`);
    // Merge properties into existing
    if (s.price && s.price !== 'حسب الاتفاق' && (!existing.price || existing.price === 'حسب الاتفاق')) {
      existing.price = s.price;
      existing.salePrice = s.salePrice;
      existing.regularPrice = s.regularPrice;
    }
    if (s.image && !existing.image) existing.image = s.image;
    if (s.promotionTitle && !existing.promotionTitle) existing.promotionTitle = s.promotionTitle;
    return; // Do not add duplicate
  }

  seenKeys.set(key, s);
  finalServices.push(s);
});

console.log('\nFinal cleaned services count:', finalServices.length);

// Format clean JSON representation
const formattedServices = 'export const defaultServices: ServiceItem[] = ' + JSON.stringify(finalServices, null, 2) + ';\n\n';

const newTransContent = transContent.substring(0, startIdx) + formattedServices + transContent.substring(endIdx);
fs.writeFileSync(transPath, newTransContent, 'utf8');
console.log('Updated translations.ts successfully!');
