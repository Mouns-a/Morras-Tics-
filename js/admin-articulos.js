import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {

  const claveCorrecta = "morras123";
  const params = new URLSearchParams(window.location.search);

  if (params.get("admin") !== claveCorrecta) {
    const pass = prompt("🔐 Acceso Artículos. Introduce la clave:");
    if (pass !== claveCorrecta) {
      document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:50px;'>🚫 Acceso Denegado</h1>";
      return;
    }
  }

  const form = document.getElementById("form-articulos");
  const lista = document.getElementById("lista-articulos");
  const preview = document.getElementById("preview");
  const previewBtn = document.getElementById("preview-btn");

  let editandoId = null;
  let imagenActual = "";

  // =========================
  // 👁️ VISTA PREVIA
  // =========================
  previewBtn.addEventListener("click", () => {

    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const contenido = document.getElementById("descripcion").value;
    const file = document.getElementById("imagen").files[0];

    let imagenURL = "";

    if (file) {
      imagenURL = URL.createObjectURL(file);
    } else if (imagenActual) {
      imagenURL = imagenActual;
    }

    preview.innerHTML = `
      <div class="card-articulo">
        ${imagenURL ? `<img src="${imagenURL}" class="img-articulo">` : ""}
        <h3>${titulo || "Sin título"}</h3>
        <p><strong>${autor || "Admin"}</strong></p>
        <small>Vista previa</small>
        <p>${(contenido || "").substring(0, 150)}...</p>
      </div>
    `;
  });

  // =========================
  // 📥 CARGAR
  // =========================
  async function cargarArticulos() {
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error(error);

    render(data);
  }

  // =========================
  // 🎨 RENDER
  // =========================
div.innerHTML = `
  ${n.imagen ? `<img src="${fixUrl(n.imagen)}" class="img-admin" style="width:100px">` : ""}
  <h3>${n.titulo}</h3>
  <p>${n.contenido?.substring(0, 50) || ""}...</p>

  <div class="acciones">
    <button onclick="window.editarArticulo('${n.id}')">✏️</button>
    <button onclick="window.eliminarArticulo('${n.id}', '${n.imagen || ""}')">🗑️</button>
  </div>
}`;
  function fixUrl(url) {
  if (!url) return "";
  if (url.includes("/object/public/")) return url;
  return url.replace("/object/", "/object/public/");
}

  // =========================
  // ✏️ EDITAR
  // =========================
  window.editarArticulo = async (id) => {
    const { data } = await supabase
      .from("articulos")
      .select("*")
      .eq("id", id)
      .single();

    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.contenido;

    editandoId = id;
    imagenActual = data.imagen;
  };

  // =========================
  // 🚀 SUBMIT
  // =========================
 form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("imagen");
  const file = fileInput.files[0];

  console.log("📂 FILE:", file);

  let url = imagenActual;

  // 🚨 Validación
  if (!file && !editandoId) {
    alert("❌ Selecciona una imagen");
    return;
  }

  if (file) {
    const cleanName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");

    const path = `articulos/${Date.now()}_${cleanName}`;

    console.log("📤 PATH:", path);

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("imagenes")
      .upload(path, file, { upsert: true });

    console.log("📦 RESPUESTA:", { uploadData, uploadError });

    if (uploadError) {
      console.error("💥 ERROR REAL:", uploadError);
      alert("Error al subir imagen");
      return;
    }

    const { data } = supabase
      .storage
      .from("imagenes")
      .getPublicUrl(path);

    url = data.publicUrl;
    url = url.replace("/object/", "/object/public/");
    console.log("🌐 URL:", url);
  }

  const payload = {
    titulo: document.getElementById("titulo").value,
    contenido: document.getElementById("descripcion").value,
    autor: document.getElementById("autor").value || "Admin",
    imagen: url,
    fecha: new Date().toISOString()
  };

  if (editandoId) {
    await supabase.from("articulos").update(payload).eq("id", editandoId);
  } else {
    await supabase.from("articulos").insert([payload]);
  }

  form.reset();
  editandoId = null;
  imagenActual = "";

  cargarArticulos();
});

  // =========================
  // 🗑️ ELIMINAR
  // =========================
  window.eliminarArticulo = async (id, imagen) => {
    const confirmar = confirm("¿Deseas eliminar este artículo?");
    if (!confirmar) return;

    try {
      if (imagen) {
        const nombreArchivo = imagen.split("/articulos/")[1];

        if (nombreArchivo) {
          await supabase.storage
            .from("imagenes")
            .remove([`articulos/${nombreArchivo}`]);
        }
      }

      await supabase.from("articulos").delete().eq("id", id);

      alert("✅ Eliminado");
      cargarArticulos();

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al eliminar");
    }
  };

  cargarArticulos();
});