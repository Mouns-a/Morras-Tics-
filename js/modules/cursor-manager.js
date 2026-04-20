/**
 * js/modules/cursor-manager.js
 * 
 * Gestiona el efecto del cursor neón personalizado
 * - Seguimiento suave del ratón
 * - Efectos hover en elementos interactivos
 * - Animaciones performantes
 * 
 * @module CursorManager
 * @example
 * const cursorManager = new CursorManager();
 * cursorManager.init();
 */

class CursorManager {
  /**
   * @constructor
   * @param {Object} options - Configuración opcional
   */
  constructor(options = {}) {
    this.selector = options.selector || '.cursor-luz';
    this.size = options.size || 200;
    this.smoothing = options.smoothing !== false;
    
    this.position = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.isHovering = false;
    
    this.cursor = null;
    this.rafId = null;
    this.lastUpdateTime = Date.now();
    this.updateThrottle = 16; // ~60fps
  }

  /**
   * Inicializa el cursor neón
   */
  init() {
    this.cursor = document.querySelector(this.selector);
    
    if (!this.cursor) {
      console.warn(`⚠️ Cursor no encontrado: ${this.selector}`);
      return false;
    }

    this._setupEventListeners();
    this._startAnimation();
    
    console.log('✅ Cursor Manager inicializado');
    return true;
  }

  /**
   * Configura los listeners
   * @private
   */
  _setupEventListeners() {
    document.addEventListener('mousemove', (e) => this._onMouseMove(e), false);
    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
    }, false);
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
    }, false);

    document.querySelectorAll('a, button, .card-articulo, .card-noticia, .rol-card').forEach(el => {
      el.addEventListener('mouseenter', () => this._setHoverState(true), false);
      el.addEventListener('mouseleave', () => this._setHoverState(false), false);
    });
  }

  /**
   * Maneja el movimiento del ratón
   * @private
   */
  _onMouseMove(e) {
    this.target.x = e.clientX;
    this.target.y = e.clientY;
  }

  /**
   * Actualiza el estado hover
   * @private
   */
  _setHoverState(isHovering) {
    this.isHovering = isHovering;
    
    if (isHovering) {
      this.cursor.style.width = '250px';
      this.cursor.style.height = '250px';
      this.cursor.style.background = 'radial-gradient(circle, rgba(255, 0, 255, 0.8), transparent 70%)';
    } else {
      this.cursor.style.width = '200px';
      this.cursor.style.height = '200px';
      this.cursor.style.background = 'radial-gradient(circle, rgba(255, 0, 255, 0.4), transparent 70%)';
    }
  }

  /**
   * Inicia la animación
   * @private
   */
  _startAnimation() {
    const animate = () => {
      const now = Date.now();
      
      if (now - this.lastUpdateTime >= this.updateThrottle) {
        if (this.smoothing) {
          this.position.x += (this.target.x - this.position.x) * 0.2;
          this.position.y += (this.target.y - this.position.y) * 0.2;
        } else {
          this.position = { ...this.target };
        }

        this.cursor.style.left = `${this.position.x}px`;
        this.cursor.style.top = `${this.position.y}px`;
        
        this.lastUpdateTime = now;
      }

      this.rafId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * Destruye el cursor manager
   */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

export default CursorManager;
