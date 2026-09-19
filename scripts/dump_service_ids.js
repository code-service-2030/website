const { defaultServices, defaultCategories } = require('../src/data/translations');

console.log("=== CATEGORIES ===");
defaultCategories.forEach(c => console.log(`${c.id}: ${c.nameAr}`));

console.log("\n=== SERVICES ===");
defaultServices.forEach(s => console.log(`${s.id} [${s.categoryId}]: ${s.titleAr}`));
