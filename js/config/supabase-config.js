/**
 * js/config/supabase-config.js
 * 
 * ⚠️ SEGURIDAD CRÍTICA: Esta es una credencial de Supabase PÚBLICA (publishable key)
 * Solo se expone la clave pública. Las operaciones sensibles deben validarse en el backend.
 * 
 * @module supabaseConfig
 */

// ✅ Configuración segura - Solo usar credenciales públicas
const SUPABASE_CONFIG = {
  url: 'https://irftyulcfplwhubkcxpq.supabase.co',
  anonKey: 'sb_publishable_ujDzFGHQGvzXa6X4nICJcA_etcUOvSv'
};

/**
 * Inicializa la conexión con Supabase
 * @returns {Promise<Object>} Cliente de Supabase configurado
 */
export const initSupabase = async () => {
  try {
    // Cargar Supabase desde CDN si no está disponible
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@latest';
      document.head.appendChild(script);
      
      // Esperar a que cargue
      await new Promise(resolve => {
        script.onload = resolve;
      });
    }

    const { createClient } = window.supabase;
    
    if (!createClient) {
      throw new Error('❌ Supabase JS library no cargada. Verifica el CDN.');
    }

    const supabaseClient = createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey
    );

    console.log('✅ Supabase inicializado correctamente');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Error inicializando Supabase:', error);
    throw error;
  }
};

export default SUPABASE_CONFIG;
