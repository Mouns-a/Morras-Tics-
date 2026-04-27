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

  const form = document.getElementById("form-noticia");
  const lista = document.getElementById("lista-noticias");
  const preview = document.getElementById("preview");
  const previewBtn = document.getElementById("preview-btn");

  let editandoId = null;
  let imagenActual = "";

  // 👁️ VISTA PREVIA
  previewBtn.addEventListener("click", () => {
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const file = document.getElementById("imagen").files[0];

    if (!titulo || !descripcion) {
      preview.style.display = "block";
      preview.innerHTML = "<p style='color:#ff00ff'>⚠️ Completa título y descripción.</p>";
      return;
    }

    let imagenURL = file ? URL.createObjectURL(file) : imagenActual;

    preview.style.display = "block";
    preview.style.border = "2px dashed #00ffff";
    preview.style.borderRadius = "15px";
    preview.style.padding = "20px";
    preview.style.marginTop = "20px";
    preview.innerHTML = `
      <div class="card-noticia">
        ${imagenURL ? `<img src="${imagenURL}" style="width:100%;border-radius:10px;">` : ""}
        <h3>${titulo}</h3>
        <small>Vista previa</small>
        <p>${descripcion.substring(0, 150)}...</p>
      </div>
    `;
  });

  // 📥 CARGAR
  async function cargarNoticias() {
    const { data, error } = await supabase
      .from("noticias").select("*").order("fecha", { ascending: false });
    if (error) return console.error(error);

    if (document.getElementById("total"))
      document.getElementById("total").textContent = data.length;
    if (document.getElementById("urgentes"))
      document.getElementById("urgentes").textContent =
        data.filter(n => n.destacada).length;

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
        <p>${n.descripcion ? n.descripcion.substring(0, 50) : ""}...</p>
        <div class="acciones">
          <button onclick="window.editarNoticia('${n.id}')">✏️</button>
          <button onclick="window.eliminarNoticia('${n.id}')">🗑️</button>
        </div>`;
      lista.appendChild(div);
    });
  }

  window.eliminarNoticia = async (id) => {
    if (!confirm("¿Eliminar noticia?")) return;
    await supabase.from("noticias").delete().eq("id", id);
    cargarNoticias();
  };

  window.editarNoticia = async (id) => {
    const { data } = await supabase
      .from("noticias").select("*").eq("id", id).single();
    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.descripcion;
    document.getElementById("fecha").value = data.fecha;
    document.getElementById("destacada").checked = data.destacada;
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
      const path = `noticias/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagenes").upload(path, file, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("imagenes").getPublicUrl(path);
        url = urlData.publicUrl;
      }
    }

    const payload = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      fecha: document.getElementById("fecha").value,
      destacada: document.getElementById("destacada").checked,
      imagen: url
    };

    if (editandoId) {
      await supabase.from("noticias").update(payload).eq("id", editandoId);
      alert("✅ Noticia actualizada");
    } else {
      await supabase.from("noticias").insert([payload]);
      alert("🚀 Noticia publicada");
    }

    form.reset();
    preview.style.display = "none";
    editandoId = null;
    imagenActual = "";
    cargarNoticias();
  });

  cargarNoticias();
});