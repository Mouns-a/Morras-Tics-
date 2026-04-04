import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    // 🔐 PROTECCIÓN DE ACCESO
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

    // 📥 CARGAR ARTÍCULOS
    async function cargarArticulos() {
        const { data, error } = await supabase.from("articulos").select("*").order("fecha", { ascending: false });
        if (error) return console.error(error);
        
        document.getElementById("total").textContent = data.length;
        document.getElementById("urgentes").textContent = data.reduce((acc, n) => acc + (n.likes || 0), 0);
        
        render(data);
    }

    function render(data) {
        lista.innerHTML = "";
        data.forEach(n => {
            const div = document.createElement("div");
            div.classList.add("card-admin");
            div.innerHTML = `
                ${n.imagen ? `<img src="${n.imagen}" class="img-admin">` : ""}
                <h3>${n.titulo}</h3>
                <p>${n.contenido.substring(0, 100)}...</p>
                <div class="acciones">
                    <button onclick="window.editarArticulo('${n.id}')">✏️</button>
                    <button onclick="window.eliminarArticulo('${n.id}', '${n.imagen || ""}')">🗑️</button>
                </div>`;
            lista.appendChild(div);
        });
    }

    // 👁️ VISTA PREVIA
    previewBtn?.addEventListener("click", () => {
        const file = document.getElementById("imagen").files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            preview.innerHTML = `<img src="${url}" class="img-admin">`;
        }
        preview.style.display = "block";
    });

    // 🛠️ ACCIONES GLOBALES
    window.eliminarArticulo = async (id, img) => {
        if (!confirm("¿Eliminar artículo?")) return;
        if (img) await supabase.storage.from("imagenes").remove([img.split("/imagenes/")[1]]);
        await supabase.from("articulos").delete().eq("id", id);
        cargarArticulos();
    };

    window.editarArticulo = async (id) => {
        const { data } = await supabase.from("articulos").select("*").eq("id", id).single();
        document.getElementById("titulo").value = data.titulo;
        document.getElementById("descripcion").value = data.contenido;
        document.getElementById("fecha").value = data.fecha;
        editandoId = id;
        imagenActual = data.imagen;
        if(data.imagen) preview.innerHTML = `<img src="${data.imagen}" class="img-admin">`;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const file = document.getElementById("imagen").files[0];
        let url = imagenActual;

        if (file) {
            const path = `articulos/${Date.now()}_${file.name}`;
            await supabase.storage.from("imagenes").upload(path, file);
            url = supabase.storage.from("imagenes").getPublicUrl(path).data.publicUrl;
        }

        const payload = {
            titulo: document.getElementById("titulo").value,
            contenido: document.getElementById("descripcion").value,
            fecha: document.getElementById("fecha").value,
            imagen: url
        };

        if (editandoId) {
            await supabase.from("articulos").update(payload).eq("id", editandoId);
        } else {
            await supabase.from("articulos").insert([payload]);
        }
        form.reset();
        preview.innerHTML = "";
        editandoId = null;
        cargarArticulos();
    });

    cargarArticulos();
});