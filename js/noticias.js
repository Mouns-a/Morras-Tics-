import { supabase } from "./supabase.js";

const contenedor = document.getElementById("contenedor-noticias");
const destacada = document.getElementById("destacada");
let todasNoticias = [];

if (!contenedor || !destacada) {
  console.error("Faltan elementos en noticias.html");
}

document.addEventListener("DOMContentLoaded", async () => {

  async function cargarNoticias() {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error(error);

    todasNoticias = data;
    render(data); // ✅ solo una vez
  }

  function render(lista) {
    contenedor.innerHTML = "";
    destacada.innerHTML = "";
    if (lista.length === 0) return;

    const top = lista.find(n => n.destacada) || lista[0];

    destacada.innerHTML = `
      <div class="card-destacada" onclick="verNoticia(${top.id})" style="cursor:pointer;">
        ${top.imagen ? `<img src="${top.imagen}">` : ""}
        <div class="contenido">
          <h2>🔥 ${top.titulo}</h2>
          <p>${top.descripcion ? top.descripcion.substring(0, 150) + "..." : ""}</p>
          <button onclick="verNoticia(${top.id})">📖 Leer más</button>
        </div>
      </div>
    `;

    lista.filter(n => n.id !== top.id).forEach(n => {
      const card = document.createElement("div");
      card.className = "card-noticia";
      card.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-noticia">` : ""}
        <h3>${n.titulo}</h3>
        <p>${n.descripcion ? n.descripcion.substring(0, 100) + "..." : ""}</p>
        <div style="display:flex; gap:10px; margin-top:10px;">
          <button onclick="likenot(${n.id})">❤️ ${n.likes || 0}</button>
          <button onclick="verNoticia(${n.id})">📖 Leer más</button>
        </div>
      `;
      contenedor.appendChild(card);
    });
  }

  window.verNoticia = (id) => {
    const noticia = todasNoticias.find(n => n.id === id);
    if (!noticia) return;

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-noticia";
    modal.innerHTML = `
      <div class="modal-contenido">
        <span class="cerrar" onclick="document.getElementById('modal-noticia').remove()">✕</span>
        ${noticia.imagen ? `<img src="${noticia.imagen}" style="width:100%;border-radius:10px;margin-bottom:15px;">` : ""}
        <h2>${noticia.titulo}</h2>
        <small>📅 ${noticia.fecha || ""}</small>
        <hr style="border-color:#ff00ff33; margin:15px 0;">
        <p style="line-height:1.8; white-space:pre-wrap;">${noticia.descripcion || ""}</p>
        <div style="margin-top:20px;">
          <button onclick="likenot(${noticia.id})" style="background:transparent;border:1px solid #ff00ff;color:#ff00ff;padding:8px 16px;border-radius:20px;cursor:pointer;">
            ❤️ ${noticia.likes || 0} Me gusta
          </button>
        </div>
      </div>
    `;
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  };

  window.likenot = async (id) => {
    const { data, error } = await supabase
      .from("noticias")
      .select("likes")
      .eq("id", id)
      .single();

    if (error) return console.error("Error obteniendo likes:", error);

    const { error: updateError } = await supabase
      .from("noticias")
      .update({ likes: (data.likes || 0) + 1 })
      .eq("id", id);

    if (updateError) return console.error("Error actualizando likes:", updateError);

    cargarNoticias();
  };

  cargarNoticias();
});