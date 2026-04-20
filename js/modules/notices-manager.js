/**
 * js/modules/notices-manager.js
 * 
 * Gestiona avisos con filtros y contadores
 * 
 * @module NoticesManager
 */

import { initSupabase } from '../config/supabase-config.js';

class NoticesManager {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || '#contenedor-avisos';
    this.supabase = null;
    this.avisos = [];
    this.container = null;
  }

  /**
   * Inicializa el manager
   */
  async init() {
    try {
      this.container = document.querySelector(this.containerSelector);

      if (!this.container) {
        throw new Error('Contenedor de avisos no encontrado');
      }

      this.supabase = await initSupabase();
      await this.loadAvisos();

      this._setupFilterListeners();
      this._setupSearchListener();

      console.log('✅ NoticesManager inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error en NoticesManager:', error);
      return false;
    }
  }

  /**
   * Carga avisos desde Supabase
   */
  async loadAvisos() {
    try {
      const { data, error } = await this.supabase
        .from('avisos')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;

      this.avisos = data || [];
      this.render(this.avisos);
    } catch (error) {
      console.error('❌ Error cargando avisos:', error);
    }
  }

  /**
   * Renderiza avisos
   */
  render(lista) {
    this.container.innerHTML = '';

    if (lista.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <h2>🚀 Aún no hay avisos</h2>
        </div>
      `;
      return;
    }

    lista.forEach(aviso => {
      const card = document.createElement('div');
      card.classList.add('card-aviso');

      if (aviso.urgente) card.classList.add('urgente');
      if (aviso.destacado) card.classList.add('destacado');

      card.innerHTML = `
        <h3>${this._escapeHTML(aviso.titulo)}</h3>
        <p>${this._escapeHTML(aviso.descripcion)}</p>
        <span class="tag-cat">${aviso.categoria || 'General'}</span>
        ${aviso.urgente ? '<span class="badge">🔥 URGENTE</span>' : ''}
      `;

      this.container.appendChild(card);
    });
  }

  /**
   * Configura filtros
   * @private
   */
  _setupFilterListeners() {
    document.querySelectorAll('.filtros button').forEach(btn => {
      btn.addEventListener('click', () => {
        const filtro = btn.dataset.filtro;
        const filtrados = filtro === 'todos'
          ? this.avisos
          : this.avisos.filter(a => a.categoria === filtro);

        this.render(filtrados);
      });
    });
  }

  /**
   * Configura buscador
   * @private
   */
  _setupSearchListener() {
    const buscador = document.getElementById('buscador');
    if (buscador) {
      buscador.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtrados = this.avisos.filter(a =>
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

export default NoticesManager;
