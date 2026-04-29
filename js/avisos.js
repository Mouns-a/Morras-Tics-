import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {

  const contenedor = document.getElementById("contenedor-avisos");
  const buscador = document.getElementById("buscador");
  const botonesFiltro = document.querySelectorAll(".filtros button");

  if (!contenedor) {
    console.error("❌ No existe #contenedor-avisos en el HTML");
    return;
  }

  let avisos = [];

  // =========================
  // 📥 CARGAR AVISOS
  // =========================
  async function cargarAvisos() {
    const { data, error } = await supabase
      .from("avisos")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error:", error);
      return;
    }

    avisos = data || [];
    render(avisos);
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render(lista) {
    contenedor.innerHTML = "";
  console.log("Avisos:", lista);
  
    if (lista.length === 0) {
      contenedor.innerHTML = `
        <div class="empty-state">
          <h2>🚀 Aún no hay avisos</h2>
          <p>Pero algo grande se está cocinando…</p>
        </div>
      `;
      return;
    }

    lista.forEach(aviso => {
      const card = document.createElement("div");
      card.classList.add("card-aviso");

      if (aviso.urgente) card.classList.add("urgente");
      if (aviso.destacado) card.classList.add("destacado");

      card.innerHTML = `
        ${aviso.imagen ? `<img src="${aviso.imagen}" class="img-aviso" alt="${aviso.titulo}">` : ""}

        <div class="contenido">
          <h3>${aviso.titulo}</h3>
          <p>${aviso.descripcion}</p>

          <div class="meta">
            <span class="tag-cat">${aviso.categoria || 'General'}</span>
            <span>📅 ${aviso.fecha}</span>
          </div>

          <div class="contador" data-fecha="${aviso.fecha}"></div>

          ${aviso.urgente ? '<span class="badge">🔥 URGENTE</span>' : ''}

          ${
            aviso.link &&
            aviso.link.trim() !== "" &&
            aviso.link !== "undefined" &&
            aviso.link !== "{}"
              ? `
            <a href="${aviso.link}" target="_blank" class="btn-aviso-link">
              🔗 Ver más información
            </a>
          `
              : ''
          }
        </div>
      `;

      contenedor.appendChild(card);
    });

    // ✨ Animación de entrada
    setTimeout(() => {
      document.querySelectorAll(".card-aviso").forEach(card => {
        card.classList.add("visible");
      });
    }, 50);

    iniciarContadores();
  }

  // =========================
  // ⏳ CONTADORES
  // =========================
  function iniciarContadores() {
    const contadores = document.querySelectorAll(".contador");

    contadores.forEach(contador => {
      const fechaMeta = contador.dataset.fecha;
      if (!fechaMeta) return;

      const intervalo = setInterval(() => {
        const ahora = new Date();
        const objetivo = new Date(fechaMeta + "T23:59:59");
        const diff = objetivo - ahora;

        if (diff <= 0) {
          contador.innerHTML = "⏱️ Finalizado";
          contador.style.color = "#ff0055";
          clearInterval(intervalo);
          return;
        }

        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        const segundos = Math.floor((diff / 1000) % 60);

        contador.innerHTML = `⏳ ${dias}d ${horas}h ${minutos}m ${segundos}s`;
      }, 1000);
    });
  }

  // =========================
  // 🎛️ FILTROS
  // =========================
  botonesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filtros .activo")?.classList.remove("activo");
      btn.classList.add("activo");

      const filtro = btn.dataset.filtro;

      const filtrados = (filtro === "todos")
        ? avisos
        : avisos.filter(a => a.categoria === filtro);

      render(filtrados);
    });
  });

  // =========================
  // 🔍 BUSCADOR
  // =========================
  if (buscador) {
    buscador.addEventListener("input", () => {
      const texto = buscador.value.toLowerCase();

      const filtrados = avisos.filter(a =>
        a.titulo.toLowerCase().includes(texto) ||
        a.descripcion.toLowerCase().includes(texto)
      );

      render(filtrados);
    });
  }

  // =========================
  // 🚀 INIT
  // =========================
  cargarAvisos();

});