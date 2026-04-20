/**
 * js/modules/articles-manager.js
 * 
 * Gestiona artículos con likes y comentarios
 * 
 * @module ArticlesManager
 */

import { initSupabase } from '../config/supabase-config.js';

class ArticlesManager {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || '#contenedor-articulos';
    this.supabase = null;
    this.articulos = [];
    this.container = null;
  }

  /**
   * Inicializa el manager
   */
  async init() {
    try {
      this.container = document.querySelector(this.containerSelector);

      if (!this.container) {
        throw new Error('Contenedor de artículos no encontrado');
      }

      this.supabase = await initSupabase();
      await this.loadArticulos();

      this._setupSearchListener();

      console.log('✅ ArticlesManager inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error en ArticlesManager:', error);
      return false;
    }
  }

  /**
   * Carga artículos desde Supabase
   */
  async loadArticulos() {
    try {
      const { data, error } = await this.supabase
        .from('articulos')
        .select('*')
        .order('likes', { ascending: false });

      if (error) throw error;

      this.articulos = data || [];
      this.render(this.articulos);
    } catch (error) {
      console.error('❌ Error cargando artículos:', error);
    }
  }

  /**
   * Renderiza artículos
   */
  render(lista) {
    this.container.innerHTML = '';

    if (lista.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <h2>🧠 Sin artículos</h2>
        </div>
      `;
      return;
    }

    lista.forEach(articulo => {
      const card = document.createElement('div');
      card.classList.add('card-articulo');

      card.innerHTML = `
        <h3>${this._escapeHTML(articulo.titulo)}</h3>
        <p><strong>${this._escapeHTML(articulo.autor)}</strong></p>
        <p>${(articulo.contenido || '').substring(0, 100)}...</p>
        <button class="like-btn" data-id="${articulo.id}">
          ❤️ ${articulo.likes || 0}
        </button>
      `;

      card.querySelector('.like-btn').addEventListener('click', () => {
        this.addLike(articulo.id);
      });

      this.container.appendChild(card);
    });
  }

  /**
   * Incrementa likes
   */
  async addLike(articuloId) {
    try {
      const articulo = this.articulos.find(a => a.id === articuloId);
      if (!articulo) return;

      const currentLikes = articulo.likes || 0;

      const { error } = await this.supabase
        .from('articulos')
        .update({ likes: currentLikes + 1 })
        .eq('id', articuloId);

      if (error) throw error;

      articulo.likes = currentLikes + 1;
      this.loadArticulos();
    } catch (error) {
      console.error('❌ Error dando like:', error);
    }
  }

  /**
   * Configura buscador
   * @private
   */
  _setupSearchListener() {
    const buscador = document.getElementById('buscador-articulos');
    if (buscador) {
      buscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtrados = this.articulos.filter(a =>
          a.titulo.toLowerCase().includes(texto)
        );
        this.render(filtrados);
      });
    }
  }

  /**
   * Escapa HTML
   * @private
   */
  _escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default ArticlesManager;
