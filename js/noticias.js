import { supabase } from "./supabase.js";
const contenedor = document.getElementById("contenedor-noticias");
const destacada = document.getElementById("destacada");

// 🛡️ protección
if (!contenedor || !destacada) {
  console.error("Faltan elementos en noticias.html");
}

document.addEventListener("DOMContentLoaded", async () => {

  const contenedor = document.getElementById("contenedor-noticias");
  const destacada = document.getElementById("destacada");

  async function cargarNoticias() {

    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error(error);

    render(data);
  }

  function render(lista) {

    contenedor.innerHTML = "";
    destacada.innerHTML = "";

    if (lista.length === 0) return;

    const top = lista.find(n => n.destacada) || lista[0];

    destacada.innerHTML = `
      <div class="card-destacada">
        ${top.imagen ? `<img src="${top.imagen}">` : ""}
        <div class="contenido">
          <h2>🔥 ${top.titulo}</h2>
          <p>${top.descripcion}</p>
        </div>
      </div>
    `;

    lista
      .filter(n => n.id !== top.id)
      .forEach(n => {

        const card = document.createElement("div");
        card.className = "card-noticia";

        card.innerHTML = `
          ${n.imagen ? `<img src="${n.imagen}">` : ""}
          <h3>${n.titulo}</h3>
          <p>${n.descripcion}</p>

          <button onclick="like(${n.id})">❤️ ${n.likes || 0}</button>
        `;

        contenedor.appendChild(card);
      });
  }

  window.like = async (id) => {
    let { data } = await supabase
      .from("noticias")
      .select("likes")
      .eq("id", id)
      .single();

    await supabase
      .from("noticias")
      .update({ likes: (data.likes || 0) + 1 })
      .eq("id", id);

    cargarNoticias();
  };

  cargarNoticias();

});