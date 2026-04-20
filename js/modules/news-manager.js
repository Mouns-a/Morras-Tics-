/**
 * js/modules/news-manager.js
 * 
 * Gestiona noticias con sanitización XSS
 * 
 * @module NewsManager
 */

import { initSupabase } from '../config/supabase-config.js';

class NewsManager {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || '#contenedor-noticias';
    this.featuredSelector = options.featuredSelector || '#destacada';
    this.supabase = null;
    this.newsList = [];
    this.container = null;
    this.featured = null;
  }

  /**
   * Inicializa el manager
   */
  async init() {
    try {
      this.container = document.querySelector(this.containerSelector);
      this.featured = document.querySelector(this.featuredSelector);

      if (!this.container || !this.featured) {
        throw new Error('Elementos del DOM no encontrados');
      }

      this.supabase = await initSupabase();
      await this.loadNews();

      console.log('✅ NewsManager inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error en NewsManager:', error);
      return false;
    }
  }

  /**
   * Carga noticias desde Supabase
   */
  async loadNews() {
    try {
      const { data, error } = await this.supabase
        .from('noticias')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;

      this.newsList = data || [];
      this.render();
    } catch (error) {
      console.error('❌ Error cargando noticias:', error);
    }
  }

  /**
   * Renderiza las noticias
   */
  render() {
    this.container.innerHTML = '';
    this.featured.innerHTML = '';

    if (this.newsList.length === 0) {
      this._showEmpty();
      return;
    }

    const topNews = this.newsList.find(n => n.destacada) || this.newsList[0];
    this.featured.appendChild(this._createFeaturedCard(topNews));

    this.newsList
      .filter(n => n.id !== topNews.id)
      .forEach(news => {
        this.container.appendChild(this._createNewsCard(news));
      });
  }

  /**
   * Crea tarjeta destacada
   * @private
   */
  _createFeaturedCard(news) {
    const card = document.createElement('div');
    card.className = 'card-destacada';

    const imageHTML = news.imagen 
      ? `<img src="${this._sanitizeUrl(news.imagen)}" alt="${this._escapeHTML(news.titulo)}" />` 
      : '';

    card.innerHTML = `
      ${imageHTML}
      <div class="contenido">
        <h2>🔥 ${this._escapeHTML(news.titulo)}</h2>
        <p>${this._escapeHTML(news.descripcion)}</p>
      </div>
    `;

    return card;
  }

  /**
   * Crea tarjeta de noticia
   * @private
   */
  _createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'card-noticia';

    const imageHTML = news.imagen 
      ? `<img src="${this._sanitizeUrl(news.imagen)}" alt="${this._escapeHTML(news.titulo)}" />` 
      : '';

    card.innerHTML = `
      ${imageHTML}
      <h3>${this._escapeHTML(news.titulo)}</h3>
      <p>${this._escapeHTML(news.descripcion)}</p>
      <button class="like-btn" data-id="${news.id}">
        ❤️ <span>${news.likes || 0}</span>
      </button>
    `;

    card.querySelector('.like-btn').addEventListener('click', () => {
      this.addLike(news.id);
    });

    return card;
  }

  /**
   * Incrementa likes
   */
  async addLike(newsId) {
    try {
      const news = this.newsList.find(n => n.id === newsId);
      if (!news) return;

      const currentLikes = news.likes || 0;

      const { error } = await this.supabase
        .from('noticias')
        .update({ likes: currentLikes + 1 })
        .eq('id', newsId);

      if (error) throw error;

      news.likes = currentLikes + 1;

      const btn = document.querySelector(`[data-id="${newsId}"]`);
      if (btn) {
        btn.querySelector('span').textContent = news.likes;
      }
    } catch (error) {
      console.error('❌ Error dando like:', error);
    }
  }

  /**
   * Escapa HTML para prevenir XSS
   * @private
   */
  _escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Sanitiza URLs
   * @private
   */
  _sanitizeUrl(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.href;
    } catch {
      return '';
    }
  }

  /**
   * Muestra estado vacío
   * @private
   */
  _showEmpty() {
    this.container.innerHTML = `
      <div class="empty-state">
        <h2>📰 Sin noticias</h2>
      </div>
    `;
  }
}

export default NewsManager;
