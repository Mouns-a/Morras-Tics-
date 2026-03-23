document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenedor-avisos");

  if (!contenedor) {
    console.error("❌ No existe #contenedor-avisos en el HTML");
    return;
  }

let avisos = JSON.parse(localStorage.getItem("avisos")) || [];

// 🧠 LIMPIEZA DE DATOS
avisos = avisos.filter(a => a.titulo && a.descripcion);

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

    card.innerHTML = `
      <h3>${aviso.titulo}</h3>
      <p>${aviso.descripcion}</p>
      <span>${aviso.categoria}</span><br>
      <span>${aviso.fecha}</span>
    `;

    contenedor.appendChild(card);
  });
}

  // =========================
  // 🎛️ FILTROS
  // =========================
  const botones = document.querySelectorAll(".filtros button");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {

      document.querySelector(".filtros .activo").classList.remove("activo");
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

});