const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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
const key = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || env['SUPABASE_SERVICE_ROLE_KEY'];

console.log('Supabase URL:', url);
if (url && key) {
  const client = createClient(url, key);
  async function run() {
    const { count: servCount, error: servErr } = await client.from('services').select('*', { count: 'exact', head: true });
    console.log('Services in Supabase count:', servCount, 'error:', servErr);

    const { count: catCount, error: catErr } = await client.from('categories').select('*', { count: 'exact', head: true });
    console.log('Categories in Supabase count:', catCount, 'error:', catErr);

    if (servCount > 0) {
      const { data: servs } = await client.from('services').select('id, title_ar').limit(5);
      console.log('Sample services in Supabase:', servs);
    }
  }
  run();
}
