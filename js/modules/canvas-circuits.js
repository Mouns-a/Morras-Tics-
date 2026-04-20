/**
 * js/modules/canvas-circuits.js
 * 
 * Gestiona la animación de circuitos en el canvas
 * - Creación y animación de nodos
 * - Conexiones dinámicas
 * - Optimización de rendimiento
 * 
 * @module CanvasCircuits
 */

class CanvasCircuits {
  /**
   * @constructor
   * @param {string} canvasId - ID del elemento canvas
   * @param {Object} options - Opciones de configuración
   */
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    
    if (!this.canvas) {
      throw new Error(`Canvas no encontrado: ${canvasId}`);
    }

    this.ctx = this.canvas.getContext('2d');
    this.nodeCount = options.nodeCount || 80;
    this.connectionDistance = options.connectionDistance || 120;
    this.nodeColor = options.nodeColor || '#00ffff';
    this.connectionColor = options.connectionColor || 'rgba(0, 255, 255';
    
    this.nodes = [];
    this.isAnimating = false;
    this.rafId = null;
    this.resizeHandler = null;
  }

  /**
   * Inicializa el canvas
   */
  init() {
    this._setupCanvas();
    this._createNodes();
    this._setupResizeListener();
    this._startAnimation();
    
    console.log(`✅ Canvas animado con ${this.nodeCount} nodos`);
  }

  /**
   * Configura el tamaño del canvas
   * @private
   */
  _setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    resize();
    this.resizeHandler = resize;
    window.addEventListener('resize', resize);
  }

  /**
   * Crea los nodos iniciales
   * @private
   */
  _createNodes() {
    this.nodes = [];
    
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2 + Math.random() * 2
      });
    }
  }

  /**
   * Configura el listener de redimensionamiento
   * @private
   */
  _setupResizeListener() {
    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * Dibuja las conexiones entre nodos
   * @private
   */
  _drawConnections() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.connectionDistance) {
          const opacity = 1 - (dist / this.connectionDistance);

          this.ctx.strokeStyle = `${this.connectionColor}, ${opacity})`;
          this.ctx.lineWidth = 1;

          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  /**
   * Dibuja un nodo
   * @private
   */
  _drawNode(node) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.nodeColor;
    this.ctx.fill();
  }

  /**
   * Actualiza la posición de un nodo
   * @private
   */
  _updateNode(node) {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > this.canvas.width) {
      node.vx *= -1;
      node.x = Math.max(0, Math.min(this.canvas.width, node.x));
    }
    
    if (node.y < 0 || node.y > this.canvas.height) {
      node.vy *= -1;
      node.y = Math.max(0, Math.min(this.canvas.height, node.y));
    }
  }

  /**
   * Loop principal de animación
   * @private
   */
  _animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawConnections();

    this.nodes.forEach(node => {
      this._updateNode(node);
      this._drawNode(node);
    });

    this.rafId = requestAnimationFrame(this._animate);
  }

  /**
   * Inicia la animación
   * @private
   */
  _startAnimation() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this._animate();
    }
  }

  /**
   * Detiene la animación
   */
  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.isAnimating = false;
    }
  }

  /**
   * Limpia recursos
   */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resizeHandler);
  }
}

export default CanvasCircuits;
