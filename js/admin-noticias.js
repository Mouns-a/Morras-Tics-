import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-noticia");
  const lista = document.getElementById("lista-noticias");
  const preview = document.getElementById("preview");
  const clave = "morras123"; // cámbiala
  const params = new URLSearchParams(window.location.search);
  const acceso = params.get("admin");

  if (acceso !== clave) {
  document.body.innerHTML = "<h1>🚫 Acceso denegado</h1>";
  throw new Error("No autorizado");
}

  let editandoId = null;
  let imagenActual = "";

  // =========================
  // 📥 CARGAR NOTICIAS
  // =========================
  async function cargarNoticias() {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error(error);
    document.getElementById("total").textContent = data.length;

const urgentes = data.filter(n => n.destacada).length;
document.getElementById("urgentes").textContent = urgentes;

document.getElementById("categorias").textContent = "—";
    render(data);
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render(noticias) {
    lista.innerHTML = "";

    noticias.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("card-admin");

      div.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-admin">` : ""}
        <h3>${n.titulo}</h3>
        <p>${n.descripcion}</p>
        <small>${n.fecha || ""}</small>

        <div class="acciones">
          <button onclick="editarNoticia('${n.id}')">✏️</button>
          <button onclick="eliminarNoticia('${n.id}', '${n.imagen}')">🗑️</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  // =========================
  // 🖼️ SUBIR IMAGEN
  // =========================
  async function subirImagen(file) {
    const fileName = `noticias/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("imagenes")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return "";
    }

    const { data } = supabase.storage
      .from("imagenes")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // =========================
  // ❌ ELIMINAR IMAGEN
  // =========================
  async function eliminarImagen(url) {
    if (!url) return;

    const path = url.split("/imagenes/")[1];

    await supabase.storage
      .from("imagenes")
      .remove([path]);
  }

  // =========================
  // ❌ ELIMINAR NOTICIA
  // =========================
  window.eliminarNoticia = async (id, imagen) => {
    if (!confirm("¿Eliminar noticia?")) return;

    await eliminarImagen(imagen);

    const { error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (error) return console.error(error);

    cargarNoticias();
  };

  // =========================
  // ✏️ EDITAR NOTICIA
  // =========================
  window.editarNoticia = async (id) => {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return console.error(error);

    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.descripcion;
    document.getElementById("fecha").value = data.fecha;
    document.getElementById("destacada").checked = data.destacada;

    editandoId = id;
    imagenActual = data.imagen;

    preview.innerHTML = data.imagen
      ? `<img src="${data.imagen}" class="img-admin">`
      : "";
  };

  // =========================
  // 👁️ PREVIEW
  // =========================
  document.getElementById("preview-btn").addEventListener("click", () => {
    const file = document.getElementById("imagen").files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      preview.innerHTML = `<img src="${url}" class="img-admin">`;
    }
  });

  // =========================
  // 📤 GUARDAR
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const destacada = document.getElementById("destacada").checked;
    const file = document.getElementById("imagen").files[0];

    let imageUrl = imagenActual;

    if (file) {
      if (imagenActual) await eliminarImagen(imagenActual);
      imageUrl = await subirImagen(file);
    }

    if (editandoId) {
      await supabase
        .from("noticias")
        .update({
          titulo,
          descripcion,
          fecha,
          imagen: imageUrl,
          destacada
        })
        .eq("id", editandoId);

      editandoId = null;
      imagenActual = "";
      alert("✏️ Noticia actualizada");
    } else {
      await supabase
        .from("noticias")
        .insert([{
          titulo,
          descripcion,
          fecha,
          imagen: imageUrl,
          destacada
        }]);

      alert("🚀 Noticia creada");
    }

    form.reset();
    preview.innerHTML = "";
    cargarNoticias();
  });

  // =========================
  // 🚀 INIT
  // =========================
  cargarNoticias();
});