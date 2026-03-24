import { supabase, supabaseUrl } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-aviso");
  const lista = document.getElementById("lista-avisos");

  // =========================
  // 🔐 LOGIN SIMPLE
  // =========================
  const password = prompt("Acceso restringido");

  if (password !== "morras123") {
    document.body.innerHTML = "<h1>⛔ Acceso denegado</h1>";
    return;
  }

  // =========================
  // 📥 OBTENER AVISOS
  // =========================
  async function cargarAvisos() {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error al cargar:", error);
      return;
    }

    render(data);
    actualizarStats(data);
  }

  // =========================
  // 📊 STATS
  // =========================
  function actualizarStats(avisos) {
    document.getElementById("total").innerText = avisos.length;

    const urgentes = avisos.filter(a => a.urgente).length;
    document.getElementById("urgentes").innerText = urgentes;

    const categorias = new Set(avisos.map(a => a.categoria)).size;
    document.getElementById("categorias").innerText = categorias;
  }

  // =========================
  // 🖼️ SUBIR IMAGEN
  // =========================
  async function subirImagen(file) {
    const fileName = `noticias/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("imagenes")
      .upload(fileName, file);

    if (error) {
      console.error("Error subiendo imagen:", error);
      return "";
    }

    return `${supabaseUrl}/storage/v1/object/public/imagenes/${data.path}`;
  }

  // =========================
  // 📤 GUARDAR AVISO
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const categoria = document.getElementById("categoria").value;
    const fecha = document.getElementById("fecha").value;
    const urgente = document.getElementById("urgente").checked;
    const destacado = document.getElementById("destacado").checked;

    const file = document.getElementById("imagen").files[0];

    let imageUrl = "";
    if (file) {
      imageUrl = await subirImagen(file);
    }

    const { error } = await supabase.from("noticias").insert([{
      titulo,
      descripcion,
      categoria,
      fecha,
      urgente,
      destacado,
      imagen: imageUrl
    }]);

    if (error) {
      console.error("Error al guardar:", error);
      return;
    }

    form.reset();
    cargarAvisos();
  });

  // =========================
  // 🖥️ RENDER
  // =========================
  function render(avisos) {
    lista.innerHTML = "";

    avisos.forEach((aviso) => {
      const div = document.createElement("div");
      div.classList.add("aviso-card");

      div.innerHTML = `
        <div class="aviso-header">
          <h3>${aviso.titulo}</h3>
          ${aviso.urgente ? '<span class="badge urgente">URGENTE</span>' : ''}
        </div>

        <p class="descripcion">${aviso.descripcion}</p>

        ${aviso.imagen ? `<img src="${aviso.imagen}" class="imagen-aviso">` : ""}

        <div class="aviso-footer">
          <span class="categoria">${aviso.categoria}</span>
          <span class="fecha">${aviso.fecha}</span>
        </div>

        <button onclick="eliminar('${aviso.id}')">❌ Eliminar</button>
      `;

      lista.appendChild(div);
    });

    // ✨ Animación
    setTimeout(() => {
      const cards = document.querySelectorAll(".aviso-card");
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 100);
      });
    }, 50);
  }

  // =========================
  // ❌ ELIMINAR
  // =========================
  window.eliminar = async function(id) {
    const { error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar:", error);
      return;
    }

    cargarAvisos();
  };

  // =========================
  // 🚀 INIT
  // =========================
  cargarAvisos();

});