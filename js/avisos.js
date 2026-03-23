document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenedor-avisos");

  if (!contenedor) {
    console.error("❌ No existe #contenedor-avisos en el HTML");
    return;
  }

  let avisos = JSON.parse(localStorage.getItem("avisos")) || [];

  // 🧠 LIMPIEZA DE DATOS
  avisos = avisos.filter(a => {
    return a.titulo && a.descripcion && !isNaN(new Date(a.fecha));
  });

  // 🔥 ORDENAR (IMPORTANTE: aquí va)
  avisos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  console.log("📦 Avisos encontrados:", avisos);

  render(avisos);

  // =========================
  // 🎨 RENDER
  // =========================
  function render(lista) {

    contenedor.innerHTML = "";

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
        ${aviso.imagen ? `<img src="${aviso.imagen}" class="img-aviso">` : ""}

        <div class="contenido">
          <h3>${aviso.titulo}</h3>
          <p>${aviso.descripcion}</p>

          <div class="meta">
            <span>${aviso.categoria}</span>
            <span>${aviso.fecha}</span>
          </div>

          <div class="contador" data-fecha="${aviso.fecha}"></div>

          ${aviso.urgente ? '<span class="badge">🔥 URGENTE</span>' : ''}
        </div>
      `;

      contenedor.appendChild(card);
    });

    // 💫 ANIMACIÓN
    setTimeout(() => {
      document.querySelectorAll(".card-aviso").forEach(card => {
        card.classList.add("visible");
      });
    }, 50);

    // ⏳ CONTADOR
    iniciarContadores();
  }

  // =========================
  // ⏳ CONTADOR
  // =========================
  function iniciarContadores() {
    const contadores = document.querySelectorAll(".contador");

    contadores.forEach(contador => {
      const fecha = contador.getAttribute("data-fecha");

      if (!fecha) return;

      function actualizar() {
        const ahora = new Date();
        const objetivo = new Date(fecha);
        const diff = objetivo - ahora;

        if (diff <= 0) {
          contador.innerHTML = "⏱️ Finalizado";
          contador.style.color = "#ff0055";
          return;
        }

        const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diff / (1000 * 60)) % 60);
        const segundos = Math.floor((diff / 1000) % 60);

        contador.innerHTML = `⏳ ${dias}d ${horas}h ${minutos}m ${segundos}s`;
      }

      actualizar();
      setInterval(actualizar, 1000);
    });
  }

  // =========================
  // 🎛️ FILTROS
  // =========================
  const botones = document.querySelectorAll(".filtros button");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {

      document.querySelector(".filtros .activo")?.classList.remove("activo");
      btn.classList.add("activo");

      const filtro = btn.dataset.filtro;

      if (filtro === "todos") {
        render(avisos);
      } else {
        const filtrados = avisos.filter(a => a.categoria === filtro);
        render(filtrados);
      }
    });
  });

  // =========================
  // 🔍 BUSCADOR
  // =========================
  const buscador = document.getElementById("buscador");

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

});