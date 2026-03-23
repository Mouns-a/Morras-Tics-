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

    lista.forEach((a, index) => {

      const card = document.createElement("div");
      card.classList.add("card-articulo");

      card.innerHTML = `
        ${a.imagen ? `<img src="${a.imagen}" class="img-articulo">` : ""}

        <h3>${a.titulo}</h3>
        <p><strong>${a.autor}</strong></p>
        <p>${a.contenido.substring(0, 100)}...</p>

        <div class="acciones">
          <button onclick="like(${index})">❤️ ${a.likes}</button>
          <button onclick="toggleComentarios(${index})">💬 ${a.comentarios.length}</button>
        </div>

        <div class="comentarios" id="comentarios-${index}" style="display:none;">
          <input type="text" id="input-${index}" placeholder="Escribe un comentario...">
          <button onclick="comentar(${index})">Enviar</button>

          <div class="lista-comentarios">
            ${a.comentarios.map(c => `<p>💬 ${c}</p>`).join("")}
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

    const input = document.getElementById(`input-${index}`);
    const texto = input.value.trim();

    if (!texto) return;

    articulos[index].comentarios.push(texto);

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

});