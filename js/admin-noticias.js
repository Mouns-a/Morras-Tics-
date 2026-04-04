import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    const claveCorrecta = "morras123";
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== claveCorrecta) {
        const pass = prompt("🔐 Acceso Noticias. Introduce la clave:");
        if (pass !== claveCorrecta) {
            document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:50px;'>🚫 Acceso Denegado</h1>";
            return;
        }
    }

    const form = document.getElementById("form-noticia");
    const lista = document.getElementById("lista-noticias");
    const preview = document.getElementById("preview");
    let editandoId = null;
    let imagenActual = "";

    async function cargarNoticias() {
        const { data, error } = await supabase.from("noticias").select("*").order("fecha", { ascending: false });
        if (error) return;
        document.getElementById("total").textContent = data.length;
        document.getElementById("urgentes").textContent = data.filter(n => n.destacada).length;
        render(data);
    }

    function render(data) {
        lista.innerHTML = "";
        data.forEach(n => {
            const div = document.createElement("div");
            div.classList.add("card-admin");
            div.innerHTML = `
                ${n.imagen ? `<img src="${n.imagen}" class="img-admin" style="width:100px">` : ""}
                <h3>${n.titulo}</h3>
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
        const { data } = await supabase.from("noticias").select("*").eq("id", id).single();
        document.getElementById("titulo").value = data.titulo;
        document.getElementById("descripcion").value = data.descripcion;
        document.getElementById("fecha").value = data.fecha;
        document.getElementById("destacada").checked = data.destacada;
        editandoId = id;
        imagenActual = data.imagen;
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const file = document.getElementById("imagen").files[0];
        let url = imagenActual;

        if (file) {
            const path = `noticias/${Date.now()}_${file.name}`;
            const { data, error } = await supabase.storage.from("imagenes").upload(path, file);
            if (!error) {
                url = supabase.storage.from("imagenes").getPublicUrl(path).data.publicUrl;
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
        } else {
            await supabase.from("noticias").insert([payload]);
        }
        form.reset();
        editandoId = null;
        cargarNoticias();
    });

    cargarNoticias();
});