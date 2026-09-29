const fs = require('fs');
const path = require('path');

// 1. Read extracted catalog
const rawExtracted = JSON.parse(fs.readFileSync('C:/Users/XPRISTO/.gemini/antigravity/scratch/abu_suhail_extracted_data.json', 'utf8'));
const extractedItems = rawExtracted.services || rawExtracted;
console.log('Total extracted items in JSON:', extractedItems.length);

// Helper for Arabic text normalization
function normalizeText(txt) {
  if (!txt) return '';
  return txt
    .replace(/[ـ\s\-_,.:;()\/\\|[\]]+/g, ' ')
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // remove tashkeel
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Read translations.ts
const transContent = fs.readFileSync(path.join(__dirname, '../src/data/translations.ts'), 'utf8');

// Parse defaultServices by finding its bounds
const startToken = 'export const defaultServices: ServiceItem[] = [';
const endToken = 'export const defaultFAQs: FAQItem[] = [';
const startIdx = transContent.indexOf(startToken);
const endIdx = transContent.indexOf(endToken);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find defaultServices bounds in translations.ts');
  process.exit(1);
}

const servicesSlice = transContent.substring(startIdx + startToken.length - 1, endIdx).trim().replace(/;$/, '');
const services = eval(servicesSlice);
console.log('Current defaultServices count:', services.length);

// Let's create an index of extracted items by normalized title
const extractedMap = new Map();
extractedItems.forEach(item => {
  const norm = normalizeText(item.name || item.title || item.titleAr);
  extractedMap.set(norm, item);
});

console.log('Extracted map unique keys:', extractedMap.size);

// Check for duplicates within current defaultServices
const seenNormalized = new Map();
const duplicates = [];
const uniqueServices = [];

services.forEach((s, idx) => {
  const normTitle = normalizeText(s.titleAr);
  
  // Also check if this matches an extracted service
  // If matched, we ensure we use the extracted service's price, salePrice, regularPrice, image, etc.
  let matchedExtracted = extractedMap.get(normTitle);
  if (!matchedExtracted) {
    // Try finding by substring / fuzzy match
    for (const [extNorm, extItem] of extractedMap.entries()) {
      if (normTitle === extNorm || 
          (normTitle.length > 8 && extNorm.length > 8 && (normTitle.includes(extNorm) || extNorm.includes(normTitle)))) {
        matchedExtracted = extItem;
        break;
      }
    }
  }

  if (seenNormalized.has(normTitle)) {
    const existing = seenNormalized.get(normTitle);
    duplicates.push({
      duplicateIndex: idx,
      duplicateId: s.id,
      duplicateTitle: s.titleAr,
      duplicatePrice: s.price,
      existingId: existing.id,
      existingTitle: existing.titleAr,
      existingPrice: existing.price,
      matchedExtracted: !!matchedExtracted
    });

    // Update existing service with the extracted data or newer pricing if available
    if (matchedExtracted) {
      if (matchedExtracted.price) existing.price = String(matchedExtracted.price);
      if (matchedExtracted.salePrice) existing.salePrice = String(matchedExtracted.salePrice);
      if (matchedExtracted.regularPrice) existing.regularPrice = String(matchedExtracted.regularPrice);
      if (matchedExtracted.image && !existing.image) existing.image = matchedExtracted.image;
      if (matchedExtracted.notes && !existing.descAr) existing.descAr = matchedExtracted.notes;
    } else if (s.price && (!existing.price || s.price !== '0')) {
      existing.price = s.price;
      if (s.salePrice) existing.salePrice = s.salePrice;
      if (s.regularPrice) existing.regularPrice = s.regularPrice;
      if (s.image && !existing.image) existing.image = s.image;
    }
  } else {
    // If matched extracted, update its price/image from the extracted item!
    if (matchedExtracted) {
      if (matchedExtracted.price) s.price = String(matchedExtracted.price);
      if (matchedExtracted.salePrice) s.salePrice = String(matchedExtracted.salePrice);
      if (matchedExtracted.regularPrice) s.regularPrice = String(matchedExtracted.regularPrice);
      if (matchedExtracted.image) s.image = matchedExtracted.image;
      if (matchedExtracted.promotionTitle) s.promotionTitle = matchedExtracted.promotionTitle;
    }
    seenNormalized.set(normTitle, s);
    uniqueServices.push(s);
  }
});

console.log('Duplicates found and merged:', duplicates.length);
duplicates.forEach((d, i) => {
  console.log(`[${i+1}] Duplicate: "${d.duplicateTitle}" (${d.duplicateId}, Price: ${d.duplicatePrice}) -> merged into "${d.existingTitle}" (${d.existingId}, Final Price: ${d.existingPrice})`);
});

console.log('Final unique services count:', uniqueServices.length);
