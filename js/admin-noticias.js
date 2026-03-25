import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {

  // 🔐 PROTECCIÓN ADMIN
  const clave = "morras123";
  const params = new URLSearchParams(window.location.search);
  const acceso = params.get("admin");

  if (acceso !== clave) {
    document.body.innerHTML = "<h1>🚫 Acceso denegado</h1>";
    throw new Error("No autorizado");
  }

  const form = document.getElementById("form-noticia");
  const lista = document.getElementById("lista-noticias");
  const preview = document.getElementById("preview");

  if (!form || !lista) {
    console.error("❌ Faltan elementos HTML");
    return;
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

    if (error) {
      console.error(error);
      return;
    }

    if (!data) return;

    // 📊 STATS
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

    if (noticias.length === 0) {
      lista.innerHTML = "<p>Sin noticias aún</p>";
      return;
    }

    noticias.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("card-admin");

      div.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-admin">` : ""}
        <h3>${n.titulo}</h3>
        <p>${n.descripcion || ""}</p>
        <small>${n.fecha || ""}</small>

        <div class="acciones">
          <button onclick="editarNoticia('${n.id}')">✏️</button>
          <button onclick="eliminarNoticia('${n.id}', '${n.imagen || ""}')">🗑️</button>
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

    try {
      const path = url.split("/imagenes/")[1];
      if (!path) return;

      await supabase.storage
        .from("imagenes")
        .remove([path]);

    } catch (err) {
      console.error("Error eliminando imagen:", err);
    }
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

    if (error) {
      console.error(error);
      return;
    }

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

    if (error) {
      console.error(error);
      return;
    }

    document.getElementById("titulo").value = data.titulo || "";
    document.getElementById("descripcion").value = data.descripcion || "";
    document.getElementById("fecha").value = data.fecha || "";
    document.getElementById("destacada").checked = data.destacada || false;

    editandoId = id;
    imagenActual = data.imagen;

    preview.innerHTML = data.imagen
      ? `<img src="${data.imagen}" class="img-admin">`
      : "";
  };

  // =========================
  // 👁️ PREVIEW
  // =========================
  const previewBtn = document.getElementById("preview-btn");

  if (previewBtn) {
    previewBtn.addEventListener("click", () => {
      const file = document.getElementById("imagen").files[0];

      if (file) {
        const url = URL.createObjectURL(file);
        preview.innerHTML = `<img src="${url}" class="img-admin">`;
      }
    });
  }

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