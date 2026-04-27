import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ⚠️ Nota el @2 al final — especifica la versión 2 estable

const supabaseUrl = 'https://irftyulcfplwhubkcxpq.supabase.co';
const supabaseKey = 'sb_publishable_ujDzFGHQGvzXa6X4nICJcA_etcUOvSv';

export const supabase = createClient(supabaseUrl, supabaseKey);