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

      card.innerHTML = `
        ${a.imagen ? `<img src="${a.imagen}" class="img-articulo">` : ""}

        <h3>${a.titulo}</h3>
        <p><strong>${a.autor}</strong></p>
        <small>${tiempoRelativo(a.fecha)}</small>
        <p>${a.contenido.substring(0, 100)}...</p>

        <div class="acciones">
          <button onclick="like(${a.id})">❤️ ${a.likes}</button>
          <button onclick="toggleComentarios(${a.id})">💬 ${a.comentarios.length}</button>
        </div>

        <div class="comentarios" id="comentarios-${a.id}" style="display:none;">
          
          <input type="text" id="nombre-${a.id}" placeholder="Tu nombre">
          <input type="text" id="input-${a.id}" placeholder="Escribe un comentario...">
          <button onclick="comentar(${a.id})">Enviar</button>

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