const fs = require('fs');
const path = require('path');

const rawExtracted = JSON.parse(fs.readFileSync('C:/Users/XPRISTO/.gemini/antigravity/scratch/abu_suhail_extracted_data.json', 'utf8'));
const extractedProducts = [];
rawExtracted.categories.forEach(cat => {
  (cat.products || []).forEach(p => {
    let cleanName = p.name.replace(/[.\s]+$/, '').trim();
    extractedProducts.push({
      id: String(p.id),
      name: cleanName,
      categoryName: cat.name,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      price: (p.sale_price || p.regular_price) ? `${p.sale_price || p.regular_price} ريال` : (p.regular_price === 0 ? 'مجاناً' : 'حسب الاتفاق'),
      salePrice: p.sale_price ? `${p.sale_price} ريال` : undefined,
      regularPrice: p.regular_price ? `${p.regular_price} ريال` : undefined,
      promotionTitle: p.promotion_title || undefined,
      image: p.image || undefined,
      url: p.url || undefined
    });
  });
});

console.log('Total extracted products:', extractedProducts.length);

// Print all extracted products with prices
extractedProducts.forEach((p, idx) => {
  console.log(`[${idx+1}] ${p.id} | ${p.name} | Price: ${p.price} | Reg: ${p.regularPrice || '-'} | Sale: ${p.salePrice || '-'} | Cat: ${p.categoryName}`);
});
