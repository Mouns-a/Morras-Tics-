import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Panel admin listo 🚀");

  const form = document.getElementById("form-noticia");
  const lista = document.getElementById("lista-noticias");

  if (!form || !lista) {
    console.error("Faltan elementos en el HTML");
    return;
  }

  // =========================
  // 📥 CARGAR NOTICIAS
  // =========================
  async function cargarNoticias() {
    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando noticias:", error);
      return;
    }

    render(data);
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render(noticias) {
    lista.innerHTML = "";

    if (!noticias || noticias.length === 0) {
      lista.innerHTML = "<p>Sin noticias aún</p>";
      return;
    }

    noticias.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("card-admin");

      div.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-admin">` : ""}
        <h3>${n.titulo}</h3>
        <p>${n.descripcion}</p>
        <small>📅 ${n.fecha || ""}</small>

        <div class="acciones">
          <button onclick="eliminarNoticia('${n.id}')">❌ Eliminar</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  // =========================
  // ❌ ELIMINAR NOTICIA
  // =========================
  window.eliminarNoticia = async (id) => {
    if (!confirm("¿Eliminar esta noticia?")) return;

    const { error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando:", error);
      return;
    }

    alert("🗑️ Noticia eliminada");
    cargarNoticias();
  };

  // =========================
  // 🖼️ SUBIR IMAGEN
  // =========================
  async function subirImagen(file) {
    const fileName = `noticias/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("imagenes")
      .upload(fileName, file);

    if (error) {
      console.error("Error subiendo imagen:", error);
      return "";
    }

    // Obtener URL pública correctamente
    const { data } = supabase.storage
      .from("imagenes")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // =========================
  // 📤 CREAR NOTICIA
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const destacada = document.getElementById("destacada").checked;
    const file = document.getElementById("imagen").files[0];

    let imageUrl = "";

    if (file) {
      imageUrl = await subirImagen(file);
    }

    const { error } = await supabase
      .from("noticias")
      .insert([{
        titulo,
        descripcion,
        fecha,
        imagen: imageUrl,
        destacada
      }]);

    if (error) {
      console.error("Error insertando:", error);
      return;
    }

    alert("🚀 Noticia publicada");
    form.reset();
    cargarNoticias();
  });

  // =========================
  // 🚀 INIT
  // =========================
  cargarNoticias();
});