const fs = require('fs');
const path = require('path');

const transContent = fs.readFileSync(path.join(__dirname, '../src/data/translations.ts'), 'utf8');
const startToken = 'export const defaultServices: ServiceItem[] = [';
const endToken = 'export const defaultFAQs: FAQItem[] = [';
const startIdx = transContent.indexOf(startToken);
const endIdx = transContent.indexOf(endToken);
const currentServices = eval(transContent.substring(startIdx + startToken.length - 1, endIdx).trim().replace(/;$/, ''));

function norm(s) {
  if (!s) return '';
  return s
    .replace(/[\u064B-\u065F\u0640]/g, '')
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, '')
    .toLowerCase();
}

console.log('Total services:', currentServices.length);

// Group by normalized title
const titleGroups = new Map();
currentServices.forEach(s => {
  const k = norm(s.titleAr);
  if (!titleGroups.has(k)) titleGroups.set(k, []);
  titleGroups.get(k).push(s);
});

console.log('\n--- EXACT NORMALIZED TITLE DUPLICATES ---');
let exactDups = 0;
for (const [k, list] of titleGroups.entries()) {
  if (list.length > 1) {
    exactDups++;
    console.log(`[Duplicate Title: "${list[0].titleAr}"]`);
    list.forEach(item => {
      console.log(`   - ID: ${item.id} | Cat: ${item.categoryId} | Price: ${item.price} | Reg: ${item.regularPrice} | Sale: ${item.salePrice}`);
    });
  }
}
console.log('Total exact duplicate title sets:', exactDups);
