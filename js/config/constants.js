/**
 * js/config/constants.js
 * 
 * Constantes centralizadas de la aplicación
 * Importa este archivo cuando necesites referencias globales
 * 
 * @module Constants
 */

export const CONSTANTS = {
  // Timeouts
  ANIMATION_DURATION: 300,
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 300,
  TRANSITION_SLOW: 500,

  // Canvas
  CANVAS_NODE_COUNT: 80,
  CANVAS_CONNECTION_DISTANCE: 120,
  CANVAS_NODE_COLOR: '#00ffff',

  // Cursor
  CURSOR_DEFAULT_SIZE: 200,
  CURSOR_HOVER_SIZE: 250,
  CURSOR_SMOOTHING_ENABLED: true,

  // Supabase Tables
  TABLES: {
    NOTICIAS: 'noticias',
    AVISOS: 'avisos',
    ARTICULOS: 'articulos'
  },

  // Selectors
  SELECTORS: {
    CURSOR: '.cursor-luz',
    CANVAS: '#circuitos',
    NEWS_CONTAINER: '#contenedor-noticias',
    FEATURED: '#destacada',
    NOTICES_CONTAINER: '#contenedor-avisos',
    ARTICLES_CONTAINER: '#contenedor-articulos'
  },

  // Admin
  ADMIN_PASSWORD: 'morras123', // ⚠️ TODO: Mover a backend auth

  // Messages
  MESSAGES: {
    LOADING: '⏳ Cargando...',
    ERROR: '❌ Error al cargar los datos',
    EMPTY: '📭 Sin contenido',
    SUCCESS: '✅ Operación exitosa'
  }
};

export default CONSTANTS;
