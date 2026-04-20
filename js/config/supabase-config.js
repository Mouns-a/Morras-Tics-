const SUPABASE_CONFIG = {
  url: 'https://irftyulcfplwhubkcxpq.supabase.co',
  anonKey: 'sb_publishable_ujDzFGHQGvzXa6X4nICJcA_etcUOvSv'
};

export const initSupabase = async () => {
  try {
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@latest';
      document.head.appendChild(script);
      await new Promise(resolve => { script.onload = resolve; });
    }
    const { createClient } = window.supabase;
    if (!createClient) throw new Error('Supabase JS library no cargada');
    const supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('✅ Supabase inicializado');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

export default SUPABASE_CONFIG;
