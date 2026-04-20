import { createClient } from 'https://irftyulcfplwhubkcxpq.supabase.co';

const supabaseUrl = 'https://irftyulcfplwhubkcxpq.supabase.co';
const supabaseKey = 'sb_publishable_ujDzFGHQGvzXa6X4nICJcA_etcUOvSv';

export const supabase = createClient(supabaseUrl, supabaseKey);