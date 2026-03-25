import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const clave = "morras123"; // cámbiala
  const form = document.getElementById("form-avisos");
  const lista = document.getElementById("lista-avisos");
  const params = new URLSearchParams(window.location.search);
  const acceso = params.get("admin");

 if (acceso !== clave) {
  document.body.innerHTML = "<h1>🚫 Acceso denegado</h1>";
  throw new Error("No autorizado");
}
  let editandoId = null;

  // =========================
  // 📥 CARGAR AVISOS
  // =========================
  async function cargarAvisos() {
    const { data, error } = await supabase
      .from("avisos")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) return console.error(error);
    document.getElementById("total").textContent = data.length;

const urgentes = data.filter(n => n.urgente).length;
document.getElementById("urgentes").textContent = urgentes;

const categorias = [...new Set(data.map(n => n.categoria))].length;
document.getElementById("categorias").textContent = categorias;

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
        <h3>${n.titulo}</h3>
        <p>${n.descripcion}</p>
        <small>${n.categoria || ""} | ${n.fecha || ""}</small>

        <div class="acciones">
          <button onclick="editar('${n.id}')">✏️</button>
          <button onclick="eliminar('${n.id}')">🗑️</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  // =========================
  // ❌ ELIMINAR
  // =========================
  window.eliminar = async (id) => {
    if (!confirm("¿Eliminar aviso?")) return;

    await supabase.from("avisos").delete().eq("id", id);

    cargarAvisos();
  };

  // =========================
  // ✏️ EDITAR
  // =========================
  window.editar = async (id) => {
    const { data } = await supabase
      .from("avisos")
      .select("*")
      .eq("id", id)
      .single();

    document.getElementById("titulo").value = data.titulo;
    document.getElementById("descripcion").value = data.descripcion;
    document.getElementById("fecha").value = data.fecha;

    editandoId = id;
  };

  // =========================
  // 📤 GUARDAR
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;

    if (editandoId) {
      await supabase.from("avisos").update({
        titulo,
        descripcion,
        fecha
      }).eq("id", editandoId);

      editandoId = null;
      alert("✏️ Aviso actualizado");
    } else {
      await supabase.from("avisos").insert([{
        titulo,
        descripcion,
        fecha
      }]);

      alert("🚀 Aviso creado");
    }

    form.reset();
    cargarAvisos();
  });

  cargarAvisos();
});