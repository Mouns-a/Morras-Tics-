document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-noticia");
  const lista = document.getElementById("lista-noticias");
  const previewBox = document.getElementById("preview");

  let noticias = JSON.parse(localStorage.getItem("noticias")) || [];

  let editIndex = null;

  render();

  // =========================
  // 🚀 GUARDAR / EDITAR
  // =========================
  form.addEventListener("submit", e => {
    e.preventDefault();

    const file = document.getElementById("imagen").files[0];

    const guardar = (imagenBase64 = "") => {

      const nueva = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        fecha: document.getElementById("fecha").value,
        imagen: imagenBase64,
        destacado: document.getElementById("destacado").checked,
        vistas: 0
      };

      if (editIndex !== null) {
        noticias[editIndex] = nueva;
        editIndex = null;
      } else {
        noticias.push(nueva);
      }

      localStorage.setItem("noticias", JSON.stringify(noticias));
      form.reset();
      previewBox.style.display = "none";

      render();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = e => guardar(e.target.result);
      reader.readAsDataURL(file);
    } else {
      guardar();
    }
  });

  // =========================
  // 👁️ PREVIEW
  // =========================
  document.getElementById("preview-btn").addEventListener("click", () => {

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const file = document.getElementById("imagen").files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = e => mostrarPreview(titulo, descripcion, fecha, e.target.result);
      reader.readAsDataURL(file);
    } else {
      mostrarPreview(titulo, descripcion, fecha, "");
    }
  });

  function mostrarPreview(titulo, descripcion, fecha, img) {
    previewBox.style.display = "block";

    previewBox.innerHTML = `
      ${img ? `<img src="${img}">` : ""}
      <h3>${titulo}</h3>
      <p>${descripcion}</p>
      <small>📅 ${fecha}</small>
    `;
  }

  // =========================
  // 🎨 RENDER
  // =========================
  function render() {
    lista.innerHTML = "";

    [...noticias].reverse().forEach((n, i) => {

      const realIndex = noticias.length - 1 - i;

      const div = document.createElement("div");
      div.className = "aviso-admin";

      if (n.destacado) div.classList.add("destacado");

      div.innerHTML = `
        ${n.imagen ? `<img src="${n.imagen}" class="img-admin">` : ""}

        <h3>${n.titulo}</h3>
        <p>${n.descripcion}</p>

        <small>📅 ${n.fecha} | 👁️ ${n.vistas} vistas</small>

        <div class="acciones">
          <button onclick="editar(${realIndex})">✏️</button>
          <button onclick="eliminar(${realIndex})">❌</button>
          <button onclick="ver(${realIndex})">👁️ Ver</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  // =========================
  // ✏️ EDITAR
  // =========================
  window.editar = (i) => {
    const n = noticias[i];

    document.getElementById("titulo").value = n.titulo;
    document.getElementById("descripcion").value = n.descripcion;
    document.getElementById("fecha").value = n.fecha;
    document.getElementById("destacado").checked = n.destacado;

    editIndex = i;
  };

  // =========================
  // ❌ ELIMINAR
  // =========================
  window.eliminar = (i) => {
    if (confirm("¿Eliminar noticia?")) {
      noticias.splice(i, 1);
      localStorage.setItem("noticias", JSON.stringify(noticias));
      render();
    }
  };

  // =========================
  // 👁️ CONTAR VISTAS
  // =========================
  window.ver = (i) => {
    noticias[i].vistas++;
    localStorage.setItem("noticias", JSON.stringify(noticias));
    render();
  };

});