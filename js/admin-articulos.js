import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-articulos");
  const lista = document.getElementById("lista-articulos");
  const preview = document.getElementById("preview");

  let editandoId = null;
  let imagenActual = "";

  // =========================
  // 📥 CARGAR ARTÍCULOS
  // =========================
  async function cargarArticulos() {
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    document.getElementById("total").textContent = data.length;

    const totalLikes = data.reduce((acc, n) => acc + (n.likes || 0), 0);
    document.getElementById("urgentes").textContent = totalLikes;

    document.getElementById("categorias").textContent = "Artículos";

    render(data);
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render(data) {
    lista.innerHTML = "";

    data.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("card-admin");

      div.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-admin">` : ""}
        <h3>${n.titulo}</h3>
        <p>${n.contenido}</p>
        <small>${n.fecha || ""}</small>

        <div class="acciones">
          <button onclick="editar('${n.id}')">✏️</button>
          <button onclick="eliminar('${n.id}', '${n.imagen || ""}')">🗑️</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  // =========================
  // 🖼️ SUBIR IMAGEN
  // =========================
  async function subirImagen(file) {
    const fileName = `articulos/${Date.now()}_${file.name}`;

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

    await supabase.storage.from("imagenes").remove([path]);
  }

  // =========================
  // ❌ ELIMINAR
  // =========================
  window.eliminar = async (id, imagen) => {
    if (!confirm("¿Eliminar artículo?")) return;

    await eliminarImagen(imagen);
    await supabase.from("articulos").delete().eq("id", id);

    cargarArticulos();
  };

  // =========================
  // ✏️ EDITAR
  // =========================
  window.editar = async (id) => {
    const { data } = await supabase
      .from("articulos")
      .select("*")
      .eq("id", id)
      .single();

    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.contenido;
    document.getElementById("fecha").value = data.fecha;

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
    const contenido = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const file = document.getElementById("imagen").files[0];

    let imageUrl = imagenActual;

    if (file) {
      if (imagenActual) await eliminarImagen(imagenActual);
      imageUrl = await subirImagen(file);
    }

    if (editandoId) {
      await supabase.from("articulos").update({
        titulo,
        contenido,
        fecha,
        imagen: imageUrl
      }).eq("id", editandoId);

      editandoId = null;
      imagenActual = "";
      alert("✏️ Artículo actualizado");
    } else {
      await supabase.from("articulos").insert([{
        titulo,
        contenido,
        fecha,
        imagen: imageUrl
      }]);

      alert("🚀 Artículo creado");
    }

    form.reset();
    preview.innerHTML = "";
    cargarArticulos();
  });

  cargarArticulos();

});