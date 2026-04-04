import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // 🔐 SEGURIDAD Y ACCESO
    // =========================
    const claveCorrecta = "morras123";
    const params = new URLSearchParams(window.location.search);
    const acceso = params.get("admin");

    // Si no entraste con ?admin=morras123, pedimos la clave
    if (acceso !== claveCorrecta) {
        const pass = prompt("Acceso restringido. Introduce la clave:");
        if (pass !== claveCorrecta) {
            document.body.innerHTML = "<div style='color:white; text-align:center; margin-top:100px;'><h1>⛔ Acceso Denegado</h1><p>Clave incorrecta.</p></div>";
            return;
        }
    }

    // =========================
    // 🔎 SELECTORES GLOBALES
    // =========================
    const formAvisos = document.getElementById("form-avisos");
    const listaAvisos = document.getElementById("lista-avisos");
    const previewBtn = document.getElementById("preview-btn");
    const previewBox = document.getElementById("preview");

    let editandoId = null;

    // =========================
    // 📥 LÓGICA DE AVISOS
    // =========================
    async function cargarAvisos() {
        if (!listaAvisos) return; // Si no estamos en la página de avisos, salir.

        const { data, error } = await supabase
            .from("avisos")
            .select("*")
            .order("fecha", { ascending: false });

        if (error) return console.error("Error cargando avisos:", error);

        // Actualizar contadores si existen en el HTML
        if(document.getElementById("total")) document.getElementById("total").textContent = data.length;
        if(document.getElementById("urgentes")) document.getElementById("urgentes").textContent = data.filter(n => n.urgente).length;
        if(document.getElementById("categorias")) document.getElementById("categorias").textContent = [...new Set(data.map(n => n.categoria))].length;

        renderAvisos(data);
    }

    function renderAvisos(data) {
        listaAvisos.innerHTML = "";
        data.forEach(n => {
            const div = document.createElement("div");
            div.classList.add("aviso-admin"); // Usamos tu clase de CSS
            div.innerHTML = `
                <h3>${n.titulo}</h3>
                <p>${n.descripcion}</p>
                <small>${n.categoria || "Sin categoría"} | ${n.fecha || ""}</small>
                <div class="acciones">
                    <button class="btn-editar" onclick="window.editarAviso('${n.id}')">✏️ Editar</button>
                    <button class="btn-eliminar" onclick="window.eliminarAviso('${n.id}')">🗑️ Borrar</button>
                </div>
            `;
            listaAvisos.appendChild(div);
        });
    }

    // Funciones globales para los botones onclick
    window.eliminarAviso = async (id) => {
        if (!confirm("¿Eliminar este aviso?")) return;
        const { error } = await supabase.from("avisos").delete().eq("id", id);
        if (error) alert("Error al eliminar");
        cargarAvisos();
    };

    window.editarAviso = async (id) => {
        const { data } = await supabase.from("avisos").select("*").eq("id", id).single();
        if (data) {
            document.getElementById("titulo").value = data.titulo;
            document.getElementById("descripcion").value = data.descripcion;
            document.getElementById("fecha").value = data.fecha;
            if(document.getElementById("categoria")) document.getElementById("categoria").value = data.categoria;
            editandoId = id;
            window.scrollTo(0,0);
        }
    };

    // Evento Submit de Avisos
    if (formAvisos) {
        formAvisos.addEventListener("submit", async (e) => {
            e.preventDefault();
            const titulo = document.getElementById("titulo").value;
            const descripcion = document.getElementById("descripcion").value;
            const fecha = document.getElementById("fecha").value;
            const categoria = document.getElementById("categoria")?.value || "General";

            const payload = { titulo, descripcion, fecha, categoria };

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

    // =========================
    // 👁️ VISTA PREVIA (Seguro)
    // =========================
    if (previewBtn && previewBox) {
        previewBtn.addEventListener("click", () => {
            const titulo = document.getElementById("titulo").value;
            const desc = document.getElementById("descripcion").value;
            previewBox.style.display = "block";
            previewBox.innerHTML = `
                <div class="card-aviso">
                    <h3>${titulo || 'Sin título'}</h3>
                    <p>${desc || 'Sin descripción...'}</p>
                </div>
            `;
        });
    }

    // Inicializar
    cargarAvisos();
});