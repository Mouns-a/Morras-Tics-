import { supabase } from "./supabase.js";
import { verificarSesion, cerrarSesion } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {

  // ✅ Verificar sesión
  const session = await verificarSesion();
  if (!session) return;

  const infoAdmin = document.getElementById("info-admin");
  if (infoAdmin) infoAdmin.textContent = `👤 ${session.user.email}`;

  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) btnSalir.addEventListener("click", cerrarSesion);

  const form = document.getElementById("form-articulos");
  const lista = document.getElementById("lista-articulos");
  const preview = document.getElementById("preview");
  const previewBtn = document.getElementById("preview-btn");

  let editandoId = null;
  let imagenActual = "";

  // 👁️ VISTA PREVIA
  previewBtn.addEventListener("click", () => {
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const contenido = document.getElementById("descripcion").value;
    const file = document.getElementById("imagen").files[0];

    if (!titulo || !contenido) {
      preview.style.display = "block";
      preview.innerHTML = "<p style='color:#ff00ff'>⚠️ Completa título y contenido.</p>";
      return;
    }

    let imagenURL = file ? URL.createObjectURL(file) : imagenActual;

    preview.style.display = "block";
    preview.style.border = "2px dashed #00ffff";
    preview.style.borderRadius = "15px";
    preview.style.padding = "20px";
    preview.style.marginTop = "20px";
    preview.innerHTML = `
      <div class="card-articulo">
        ${imagenURL ? `<img src="${imagenURL}" class="img-articulo">` : ""}
        <h3>${titulo}</h3>
        <p><strong>${autor || "Admin"}</strong></p>
        <small>Vista previa</small>
        <p>${contenido.substring(0, 150)}...</p>
      </div>
    `;
  });

  // 📥 CARGAR
  async function cargarArticulos() {
    const { data, error } = await supabase
      .from("articulos").select("*").order("fecha", { ascending: false });
    if (error) return console.error(error);

    if (document.getElementById("total"))
      document.getElementById("total").textContent = data.length;
    if (document.getElementById("urgentes"))
      document.getElementById("urgentes").textContent =
        data.reduce((acc, n) => acc + (n.likes || 0), 0);

    render(data);
  }

  function render(data) {
    lista.innerHTML = "";
    data.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("card-admin");
      div.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-admin" style="width:100px;border-radius:8px;">` : ""}
        <h3>${n.titulo}</h3>
        <p>${n.contenido ? n.contenido.substring(0, 50) : ""}...</p>
        <div class="acciones">
          <button onclick="window.editarArticulo('${n.id}')">✏️</button>
          <button onclick="window.eliminarArticulo('${n.id}', '${n.imagen || ""}')">🗑️</button>
        </div>`;
      lista.appendChild(div);
    });
  }

  window.editarArticulo = async (id) => {
    const { data } = await supabase
      .from("articulos").select("*").eq("id", id).single();
    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.contenido;
    document.getElementById("autor").value = data.autor || "";
    editandoId = id;
    imagenActual = data.imagen || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🚀 PUBLICAR
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("imagen").files[0];
    let url = imagenActual;

    if (file) {
      const path = `articulos/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagenes").upload(path, file, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("imagenes").getPublicUrl(path);
        url = urlData.publicUrl;
        console.log("URL generada:", url);
      }
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
      alert("✅ Artículo actualizado");
    } else {
      await supabase.from("articulos").insert([payload]);
      alert("🚀 Artículo publicado");
    }

    form.reset();
    preview.style.display = "none";
    editandoId = null;
    imagenActual = "";
    cargarArticulos();
  });

  // 🗑️ ELIMINAR
  window.eliminarArticulo = async (id, imagen) => {
    if (!confirm("¿Deseas eliminar este artículo?")) return;
    try {
      if (imagen) {
        const nombreArchivo = imagen.split("/").pop();
        await supabase.storage
          .from("imagenes").remove([`articulos/${nombreArchivo}`]);
      }
      const { error } = await supabase
        .from("articulos").delete().eq("id", id);
      if (error) throw error;
      alert("✅ Artículo eliminado");
      cargarArticulos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ No se pudo eliminar");
    }
  };

  cargarArticulos();
});