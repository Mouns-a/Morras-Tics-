document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenedor-noticias");
  const destacada = document.getElementById("destacada");
  const buscador = document.getElementById("buscador-noticias");

  let noticias = JSON.parse(localStorage.getItem("noticias")) || [];

  // 🧠 NORMALIZAR
  noticias.forEach(n => {
    if (!n.likes) n.likes = 0;
  });

  // 🔥 ORDENAR POR FECHA
  noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  render(noticias);

  // =========================
  // 🎨 RENDER
  // =========================
  function render(lista) {

    contenedor.innerHTML = "";
    destacada.innerHTML = "";

    if (lista.length === 0) {
      contenedor.innerHTML = `
        <div class="empty-state">
          <h2>📰 Sin noticias</h2>
          <p>Algo grande viene en camino...</p>
        </div>
      `;
      return;
    }

    // ⭐ DESTACADA (la primera)
    const top = lista[0];

    destacada.innerHTML = `
      <div class="card-destacada">
        ${top.imagen ? `<img src="${top.imagen}">` : ""}
        <div class="contenido">
          <h2>🔥 ${top.titulo}</h2>
          <p>${top.descripcion}</p>
          <small>${tiempoRelativo(top.fecha)}</small>
        </div>
      </div>
    `;

    // 📰 RESTO
    lista.slice(1).forEach((n, index) => {

      const card = document.createElement("div");
      card.classList.add("card-noticia");

      card.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-noticia">` : ""}

        <h3>${n.titulo}</h3>
        <p>${n.descripcion}</p>

        <small>${tiempoRelativo(n.fecha)}</small>

        <div class="acciones">
          <button onclick="likeNoticia(${index+1})">❤️ ${n.likes}</button>
        </div>
      `;

      contenedor.appendChild(card);
    });
  }

  // =========================
  // ❤️ LIKE
  // =========================
  window.likeNoticia = function(index) {
    noticias[index].likes++;
    localStorage.setItem("noticias", JSON.stringify(noticias));
    render(noticias);
  }

  // =========================
  // 🔍 BUSCADOR
  // =========================
  buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtrados = noticias.filter(n =>
      n.titulo.toLowerCase().includes(texto) ||
      n.descripcion.toLowerCase().includes(texto)
    );

    render(filtrados);
  });

  // =========================
  // ⏱️ TIEMPO
  // =========================
  function tiempoRelativo(fecha) {

    const ahora = new Date();
    const publicado = new Date(fecha);
    const diff = Math.floor((ahora - publicado) / 1000);

    const min = Math.floor(diff / 60);
    const h = Math.floor(diff / 3600);
    const d = Math.floor(diff / 86400);

    if (diff < 60) return "Hace segundos";
    if (min < 60) return `Hace ${min} min`;
    if (h < 24) return `Hace ${h} h`;
    return `Hace ${d} días`;
  }

});