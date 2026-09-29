const fs = require('fs');

let content = fs.readFileSync('src/data/translations.ts', 'utf8');

const servMatch = content.match(/export const defaultServices: ServiceItem\[\] = (\[[\s\S]*?\n\];)/);
let defaultServices = eval(servMatch[1].replace(/;$/, ''));

defaultServices = defaultServices.map(s => {
  if (s.categoryId === 'general') {
    if (s.id === 'serv-116356397' || s.id === 'serv-620902541') {
      s.categoryId = 'freelance-licenses';
    } else if (s.id === 'serv-2117600159') {
      s.categoryId = 'appeals-complaints';
    } else if (s.id === 'serv-1383515549') {
      s.categoryId = 'zatca';
    } else {
      s.categoryId = 'freelance-licenses';
    }
  }
  return s;
});

const formattedServices = JSON.stringify(defaultServices, null, 2);
content = content.replace(
  /export const defaultServices: ServiceItem\[\] = \[[\s\S]*?\n\];/,
  `export const defaultServices: ServiceItem[] = ${formattedServices};`
);

fs.writeFileSync('src/data/translations.ts', content, 'utf8');
console.log('Successfully fixed all general categoryIds in translations.ts');
