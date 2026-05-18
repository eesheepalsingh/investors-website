const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey || serviceKey === 'PASTE_YOUR_SECRET_KEY_HERE') {
  console.error('\n\x1b[31m[supabaseAdmin] Server cannot start.\x1b[0m');
  console.error('Missing or placeholder SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in server/.env');
  console.error('  → Get the secret key from Supabase: Project Settings → API → API Keys');
  console.error('  → Paste it into server/.env as SUPABASE_SERVICE_ROLE_KEY=sb_secret_...\n');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'investors-website' },
});

module.exports = supabaseAdmin;
