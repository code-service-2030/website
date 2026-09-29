const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    env[k] = v;
  }
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['SUPABASE_SERVICE_ROLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || !key) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

// Read translations.ts to get defaultCategories and defaultServices
const transContent = fs.readFileSync('src/data/translations.ts', 'utf8');

const catMatch = transContent.match(/export const defaultCategories: Category\[\] = (\[[\s\S]*?\n\];)/);
const defaultCategories = eval(catMatch[1].replace(/;$/, ''));

const servMatch = transContent.match(/export const defaultServices: ServiceItem\[\] = (\[[\s\S]*?\n\];)/);
const defaultServices = eval(servMatch[1].replace(/;$/, ''));

console.log(`Loaded ${defaultCategories.length} categories and ${defaultServices.length} services from translations.ts`);

async function sync() {
  try {
    // 1. Upsert Categories
    console.log('Upserting categories into Supabase...');
    const catPayloads = defaultCategories.map(c => ({
      id: c.id,
      name_ar: c.nameAr,
      name_en: c.nameEn,
      desc_ar: c.descAr || '',
      desc_en: c.descEn || '',
      icon: c.icon || 'Layers',
      visible: c.visible !== false,
      order: c.order || 10
    }));

    const { error: catErr } = await supabase.from('categories').upsert(catPayloads, { onConflict: 'id' });
    if (catErr) {
      console.error('Category upsert error:', catErr);
    } else {
      console.log(`Successfully synced ${catPayloads.length} categories to Supabase.`);
    }

    // 2. Check services table columns
    const { data: sampleRow, error: sampleErr } = await supabase.from('services').select('*').limit(1);
    console.log('Sample service row in Supabase:', sampleRow);

    // 3. Upsert Services in chunks of 50
    console.log('Upserting services into Supabase...');
    const servPayloads = defaultServices.map(s => ({
      id: s.id,
      title_ar: s.titleAr,
      title_en: s.titleEn,
      desc_ar: s.descAr || '',
      desc_en: s.descEn || '',
      category_id: s.categoryId,
      price: s.price || '',
      docs_ar: s.docsAr || '',
      docs_en: s.docsEn || '',
      completion_time_ar: s.completionTimeAr || '',
      completion_time_en: s.completionTimeEn || '',
      keywords: s.keywords || [],
      featured: s.featured === true,
      featured_order: s.featuredOrder || null,
      visible: s.visible !== false,
      order: s.order || 10
    }));

    const chunkSize = 50;
    for (let i = 0; i < servPayloads.length; i += chunkSize) {
      const chunk = servPayloads.slice(i, i + chunkSize);
      const { error: servErr } = await supabase.from('services').upsert(chunk, { onConflict: 'id' });
      if (servErr) {
        console.error(`Error in chunk ${i}-${i + chunkSize}:`, servErr);
      } else {
        console.log(`Synced services ${i + 1} to ${Math.min(i + chunkSize, servPayloads.length)} / ${servPayloads.length}`);
      }
    }

    // Verify counts in Supabase
    const { count: finalServCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
    const { count: finalCatCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

    console.log(`\n=== SYNC COMPLETE ===`);
    console.log(`Supabase Categories: ${finalCatCount}`);
    console.log(`Supabase Services: ${finalServCount}`);

  } catch (err) {
    console.error('Fatal sync error:', err);
  }
}

sync();
