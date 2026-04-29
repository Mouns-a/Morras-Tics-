import { supabase } from "./supabase.js";
import { verificarSesion, cerrarSesion } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {

  // ✅ Verificar sesión
  const session = await verificarSesion();
  if (!session) return;

  // ✅ Mostrar correo de quien está logueada
  const infoAdmin = document.getElementById("info-admin");
  if (infoAdmin) infoAdmin.textContent = `👤 ${session.user.email}`;

  // ✅ Botón cerrar sesión
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) btnSalir.addEventListener("click", cerrarSesion);

  const formAvisos = document.getElementById("form-avisos");
  const listaAvisos = document.getElementById("lista-avisos");
  const previewBtn = document.getElementById("preview-btn");
  const previewBox = document.getElementById("preview");

  let editandoId = null;

  async function cargarAvisos() {
    if (!listaAvisos) return;

    const { data, error } = await supabase
      .from("avisos")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error("Error cargando avisos:", error);

    if (document.getElementById("total"))
      document.getElementById("total").textContent = data.length;
    if (document.getElementById("urgentes"))
      document.getElementById("urgentes").textContent =
        data.filter(n => n.urgente).length;
    if (document.getElementById("categorias"))
      document.getElementById("categorias").textContent =
        [...new Set(data.map(n => n.categoria))].length;

    renderAvisos(data);
  }

  function renderAvisos(data) {
    listaAvisos.innerHTML = "";
    data.forEach(n => {
      const div = document.createElement("div");
      div.classList.add("aviso-admin");
      div.innerHTML = `
        <h3>${n.titulo}</h3>
        <p>${n.descripcion ? n.descripcion.substring(0, 100) + "..." : ""}</p>
        <small>${n.categoria || "Sin categoría"} | ${n.fecha || ""}</small>
        <div class="acciones">
          <button class="btn-editar" onclick="window.editarAviso('${n.id}')">✏️ Editar</button>
          <button class="btn-eliminar" onclick="window.eliminarAviso('${n.id}')">🗑️ Borrar</button>
        </div>
      `;
      listaAvisos.appendChild(div);
    });
  }

  window.eliminarAviso = async (id) => {
    if (!confirm("¿Eliminar este aviso?")) return;
    const { error } = await supabase.from("avisos").delete().eq("id", id);
    if (error) alert("Error al eliminar");
    cargarAvisos();
  };

  window.editarAviso = async (id) => {
    const { data } = await supabase
      .from("avisos").select("*").eq("id", id).single();
    if (data) {
      document.getElementById("titulo").value = data.titulo;
      document.getElementById("descripcion").value = data.descripcion;
      document.getElementById("fecha").value = data.fecha;
      if (document.getElementById("categoria"))
        document.getElementById("categoria").value = data.categoria;
      editandoId = id;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (formAvisos) {
    formAvisos.addEventListener("submit", async (e) => {
      e.preventDefault();
      const titulo = document.getElementById("titulo").value;
      const descripcion = document.getElementById("descripcion").value;
      const fecha = document.getElementById("fecha").value;
      const categoria = document.getElementById("categoria")?.value || "General";
      const urgente = document.getElementById("urgente")?.checked || false;
      const destacado = document.getElementById("destacado")?.checked || false;
      link: document.getElementById("link").value || null

      const payload = { titulo, descripcion, fecha, categoria, urgente, destacado, link };

      if (editandoId) {
        await supabase.from("avisos").update(payload).eq("id", editandoId);
        editandoId = null;
        alert("✅ Aviso actualizado");
      } else {
        await supabase.from("avisos").insert([payload]);
        alert("🚀 Aviso creado");
      }

      formAvisos.reset();
      cargarAvisos();
    });
  }

  if (previewBtn && previewBox) {
    previewBtn.addEventListener("click", () => {
      const titulo = document.getElementById("titulo").value;
      const desc = document.getElementById("descripcion").value;
      previewBox.style.display = "block";
      previewBox.style.border = "2px dashed #00ffff";
      previewBox.style.borderRadius = "15px";
      previewBox.style.padding = "20px";
      previewBox.innerHTML = `
        <div class="card-aviso">
          <h3>${titulo || "Sin título"}</h3>
          <p>${desc || "Sin descripción..."}</p>
        </div>
      `;
    });
  }

  cargarAvisos();
});