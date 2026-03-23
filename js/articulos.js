document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenedor-articulos");
  const buscador = document.getElementById("buscador-articulos");
  const stats = document.getElementById("stats-articulos");

  let articulos = JSON.parse(localStorage.getItem("articulos")) || [];

  // 🔧 NORMALIZAR DATOS
  articulos.forEach(a => {
    if (!a.likes) a.likes = 0;
    if (!a.comentarios) a.comentarios = [];
  });

  guardar();

  render(articulos);
  actualizarStats();
  articulos.sort((a, b) => b.likes - a.likes);
  // =========================
  // 🎨 RENDER
  // =========================
function render(lista) {

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <h2>🧠 Sin artículos</h2>
      </div>
    `;
    return;
  }

  // 🔥 ordenar por likes
  lista.sort((a, b) => b.likes - a.likes);

  lista.forEach((a, index) => {

    const card = document.createElement("div");
    card.classList.add("card-articulo");

    card.innerHTML = `
      ${a.imagen ? `<img src="${a.imagen}" class="img-articulo">` : ""}

      <h3>${a.titulo}</h3>
      <p><strong>${a.autor}</strong></p>
      <small>${tiempoRelativo(a.fecha)}</small>
      <p>${a.contenido.substring(0, 100)}...</p>

      <div class="acciones">
        <button class="like-btn" onclick="like(${index})">❤️ ${a.likes}</button>
        <button onclick="toggleComentarios(${index})">💬 ${a.comentarios.length}</button>
      </div>

      <div class="comentarios" id="comentarios-${index}" style="display:none;">
        
        <input type="text" id="nombre-${index}" placeholder="Tu nombre">
        <input type="text" id="input-${index}" placeholder="Escribe un comentario...">
        <button onclick="comentar(${index})">Enviar</button>

        <div class="lista-comentarios">
          ${a.comentarios.map(c => `
            <p>💬 <strong>${c.nombre}</strong>: ${c.texto}</p>
          `).join("")}
        </div>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

  // =========================
  // ❤️ LIKE
  // =========================
window.like = function(index) {

  articulos[index].likes++;

  guardar();
  render(articulos);
  actualizarStats();

  // 💥 animación
  setTimeout(() => {
    const btns = document.querySelectorAll(".like-btn");
    if (btns[index]) {
      btns[index].classList.add("liked");

      setTimeout(() => {
        btns[index].classList.remove("liked");
      }, 200);
    }
  }, 50);
}

  // =========================
  // 💬 MOSTRAR COMENTARIOS
  // =========================
  window.toggleComentarios = function(index) {
    const div = document.getElementById(`comentarios-${index}`);
    div.style.display = div.style.display === "none" ? "block" : "none";
  }

  // =========================
  // ✍️ COMENTAR
  // =========================
window.comentar = function(index) {

  const nombre = document.getElementById(`nombre-${index}`).value.trim();
  const texto = document.getElementById(`input-${index}`).value.trim();

  if (!nombre || !texto) return;

  articulos[index].comentarios.push({
    nombre,
    texto,
    fecha: new Date().toISOString()
  });

  guardar();
  render(articulos);
  actualizarStats();
}

  // =========================
  // 🔍 BUSCADOR
  // =========================
  buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtrados = articulos.filter(a =>
      a.titulo.toLowerCase().includes(texto) ||
      a.contenido.toLowerCase().includes(texto)
    );

    render(filtrados);
  });

  // =========================
  // 📊 STATS
  // =========================
  function actualizarStats() {

    const total = articulos.length;
    const totalLikes = articulos.reduce((acc, a) => acc + a.likes, 0);
    const totalComentarios = articulos.reduce((acc, a) => acc + a.comentarios.length, 0);

    if (stats) {
      stats.innerHTML = `
        📊 Artículos: ${total} |
        ❤️ Likes: ${totalLikes} |
        💬 Comentarios: ${totalComentarios}
      `;
    }
  }

  // =========================
  // 💾 GUARDAR
  // =========================
  function guardar() {
    localStorage.setItem("articulos", JSON.stringify(articulos));
  }

 function tiempoRelativo(fecha) {

  const ahora = new Date();
  const publicado = new Date(fecha);
  const diff = Math.floor((ahora - publicado) / 1000);

  const minutos = Math.floor(diff / 60);
  const horas = Math.floor(diff / 3600);
  const dias = Math.floor(diff / 86400);

  if (diff < 60) return "Hace unos segundos";
  if (minutos < 60) return `Hace ${minutos} min`;
  if (horas < 24) return `Hace ${horas} h`;
  return `Hace ${dias} días`;
}
});