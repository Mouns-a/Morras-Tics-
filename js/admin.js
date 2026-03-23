document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-aviso");
  const lista = document.getElementById("lista-avisos");

  let avisos = JSON.parse(localStorage.getItem("avisos")) || [];

  avisos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  render();

  // =========================
  // 📊 STATS
  // =========================
  function actualizarStats() {
    document.getElementById("total").innerText = avisos.length;

    const urgentes = avisos.filter(a => a.urgente).length;
    document.getElementById("urgentes").innerText = urgentes;

    const categorias = new Set(avisos.map(a => a.categoria)).size;
    document.getElementById("categorias").innerText = categorias;
  }

  // =========================
  // GUARDAR AVISO
  // =========================
  form.addEventListener("submit", e => {
    e.preventDefault();

    const nuevo = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      categoria: document.getElementById("categoria").value,
      fecha: document.getElementById("fecha").value,
      imagen: document.getElementById("imagen").value,
      destacado: document.getElementById("destacado").checked,
      urgente: document.getElementById("urgente").checked
    };

    avisos.push(nuevo);

    localStorage.setItem("avisos", JSON.stringify(avisos));

    form.reset();
    render();
  });

  // =========================
  // MOSTRAR AVISOS
  // =========================
  function render() {
    lista.innerHTML = "";

    avisos.forEach((aviso, index) => {
      const div = document.createElement("div");

      div.classList.add("aviso-card");

      div.innerHTML = `
        <div class="aviso-header">
          <h3>${aviso.titulo}</h3>
          ${aviso.urgente ? '<span class="badge urgente">URGENTE</span>' : ''}
        </div>

        <p class="descripcion">${aviso.descripcion}</p>

        <div class="aviso-footer">
          <span class="categoria">${aviso.categoria}</span>
          <span class="fecha">${aviso.fecha}</span>
        </div>

        <button onclick="editar(${index})">✏️ Editar</button>
        <button onclick="eliminar(${index})">❌ Eliminar</button>
      `;

      lista.appendChild(div);
    });

    actualizarStats();
  }
  setTimeout(() => {
  document.querySelectorAll(".card-aviso").forEach(card => {
    card.classList.add("visible");
  });
  }, 100);

  // =========================
  // ELIMINAR
  // =========================
  window.eliminar = function(index) {
    avisos.splice(index, 1);
    localStorage.setItem("avisos", JSON.stringify(avisos));
    render();
  };

  // =========================
  // EDITAR
  // =========================
  window.editar = function(index) {
    const aviso = avisos[index];

    document.getElementById("titulo").value = aviso.titulo;
    document.getElementById("descripcion").value = aviso.descripcion;
    document.getElementById("categoria").value = aviso.categoria;
    document.getElementById("fecha").value = aviso.fecha;
    document.getElementById("imagen").value = aviso.imagen || "";
    document.getElementById("destacado").checked = aviso.destacado || false;
    document.getElementById("urgente").checked = aviso.urgente;

    avisos.splice(index, 1);

    localStorage.setItem("avisos", JSON.stringify(avisos));
    render();
  };

  // =========================
  // 🔐 LOGIN SIMPLE
  // =========================
  const password = prompt("Acceso restringido");

  if (password !== "morras123") {
    document.body.innerHTML = "<h1>⛔ Acceso denegado</h1>";
  }

});