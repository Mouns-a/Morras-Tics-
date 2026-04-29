import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {

  const contenedor = document.getElementById("contenedor-articulos");
  const buscador = document.getElementById("buscador-articulos");
  const stats = document.getElementById("stats-articulos");

  let articulos = [];

  // =========================
  // 📥 CARGAR ARTÍCULOS
  // =========================
  async function cargarArticulos() {
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .order("likes", { ascending: false });

    if (error) {
      console.error("Error:", error);
      return;
    }
    console.log("Artículos cargados:", data);



    // Normalizar
    articulos = data.map(a => ({
      ...a,
      likes: a.likes || 0,
      comentarios: a.comentarios || []
    }));


    render(articulos);
    actualizarStats();
  }

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

    lista.forEach((a) => {
      const card = document.createElement("div");
      card.classList.add("card-articulo");
      if (a.destacado) card.classList.add("destacado");

card.innerHTML = `
  ${a.imagen ? `<img src="${a.imagen}" class="img-aviso" alt="${a.titulo}">` : ""}

  <div class="contenido">
    <h3>${a.titulo}</h3>

    <p>
      ${(a.contenido || "").substring(0, 150)}...
    </p>

    <div class="meta">
      <span>✍️ ${a.autor || "Anónimo"}</span>
      <span>📅 ${tiempoRelativo(a.fecha)}</span>
    </div>

    <div class="acciones">

      <button onclick="like(${a.id})" class="btn-like">
        ❤️ ${a.likes}
      </button>

      <button onclick="toggleComentarios(${a.id})" class="btn-comentarios">
        💬 ${a.comentarios.length}
      </button>

      <button onclick="verArticulo(${a.id})" class="btn-leer">
        📖 Leer más
      </button>

    </div>

    <div id="comentarios-${a.id}" class="comentarios-box" style="display:none;">

      <div class="lista-comentarios">
        ${
          a.comentarios.length > 0
            ? a.comentarios.map(c => `
              <div class="comentario">
                <strong>${c.nombre}</strong>
                <p>${c.texto}</p>
              </div>
            `).join("")
            : "<p>Sin comentarios aún ✨</p>"
        }
      </div>

      <input 
        type="text" 
        id="nombre-${a.id}" 
        placeholder="Tu nombre"
      >

      <textarea 
        id="input-${a.id}" 
        placeholder="Escribe un comentario..."
      ></textarea>

      <button onclick="comentar(${a.id})">
        Enviar comentario
      </button>

    </div>
  </div>
`;

      contenedor.appendChild(card);
    });
  }

  // ✅ Modal ver artículo completo
  window.verArticulo = (id) => {
    const articulo = articulos.find(a => a.id === id);
    if (!articulo) return;

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-articulo";

    modal.innerHTML = `
      <div class="modal-contenido">
        <span class="cerrar" onclick="document.getElementById('modal-articulo').remove()">✕</span>
        ${articulo.imagen ? `<img src="${articulo.imagen}" style="width:100%;border-radius:10px;margin-bottom:15px;">` : ""}
        <h2>${articulo.titulo}</h2>
        <p><strong>✍️ ${articulo.autor}</strong> · <small>${tiempoRelativo(articulo.fecha)}</small></p>
        <hr style="border-color:#ff00ff33; margin:15px 0;">
        <p style="line-height:1.8; white-space:pre-wrap;">${articulo.contenido || ""}</p>
      </div>
    `;

    // Cierra al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
  };

  

  // =========================
  // ❤️ LIKE
  // =========================
  window.like = async (id) => {

    let { data, error } = await supabase
      .from("articulos")
      .select("likes")
      .eq("id", id)
      .single();

    if (error) return console.error(error);

    await supabase
      .from("articulos")
      .update({ likes: (data.likes || 0) + 1 })
      .eq("id", id);

    cargarArticulos();
  };

  // =========================
  // 💬 MOSTRAR COMENTARIOS
  // =========================
  window.toggleComentarios = function(id) {
    const div = document.getElementById(`comentarios-${id}`);
    div.style.display = div.style.display === "none" ? "block" : "none";
  };

  // =========================
  // ✍️ COMENTAR
  // =========================
// Dentro de articulos.js
window.comentar = async function(id) {
    const nombre = document.getElementById(`nombre-${id}`).value.trim();
    const texto = document.getElementById(`input-${id}`).value.trim();

    if (!nombre || !texto) return alert("Completa los campos");

    // Obtenemos comentarios actuales para no sobreescribir
    const { data: art } = await supabase.from("articulos").select("comentarios").eq("id", id).single();
    
    const nuevoComentario = { 
        nombre, 
        texto, 
        fecha: new Date().toISOString() 
    };

    const { error } = await supabase
        .from("articulos")
        .update({ comentarios: [...(art.comentarios || []), nuevoComentario] })
        .eq("id", id);

    if (!error) cargarArticulos(); // Recarga la lista
};
  // =========================
  // 🔍 BUSCADOR
  // =========================
  if (buscador) {
  buscador.addEventListener("input", () => {

    const texto = buscador.value.toLowerCase();

    const filtrados = articulos.filter(a =>
      a.titulo.toLowerCase().includes(texto) ||
      a.contenido.toLowerCase().includes(texto)
    );

    render(filtrados);
   });
}

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
  // ⏱️ TIEMPO RELATIVO
  // =========================
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

  // =========================
  // 🚀 INIT
  // =========================
  cargarArticulos();

});