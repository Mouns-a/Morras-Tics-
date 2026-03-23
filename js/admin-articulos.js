document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-articulo");
  const lista = document.getElementById("lista-articulos");
  const previewBox = document.getElementById("preview");

  let articulos = JSON.parse(localStorage.getItem("articulos")) || [];

  let editIndex = null;

  render();

  // =========================
  // GUARDAR / EDITAR
  // =========================
  form.addEventListener("submit", e => {
    e.preventDefault();

    const file = document.getElementById("imagen").files[0];

    const guardar = (img = "") => {

      const nuevo = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        contenido: document.getElementById("contenido").value,
        fecha: new Date().toISOString().split("T")[0],
        imagen: img,
        destacado: document.getElementById("destacado").checked,
        likes: 0,
        comentarios: [],
        vistas: 0
      };

      if (editIndex !== null) {
        articulos[editIndex] = nuevo;
        editIndex = null;
      } else {
        articulos.push(nuevo);
      }

      localStorage.setItem("articulos", JSON.stringify(articulos));

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
  // PREVIEW
  // =========================
  document.getElementById("preview-btn").addEventListener("click", () => {

    const titulo = document.getElementById("titulo").value;
    const contenido = document.getElementById("contenido").value;

    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <h3>${titulo}</h3>
      <p>${contenido}</p>
    `;
  });

  // =========================
  // RENDER
  // =========================
  function render() {
    lista.innerHTML = "";

    [...articulos].reverse().forEach((a, i) => {

      const realIndex = articulos.length - 1 - i;

      const div = document.createElement("div");
      div.className = "card-articulo";

      if (a.destacado) div.classList.add("destacado");

      div.innerHTML = `
        ${a.imagen ? `<img src="${a.imagen}" class="img-admin">` : ""}

        <h3>${a.titulo}</h3>
        <small>✍️ ${a.autor} | 📅 ${a.fecha}</small>

        <p>${a.contenido.substring(0, 100)}...</p>

        <p class="like-btn">❤️ ${a.likes}</p>

        <div class="acciones">
          <button onclick="editar(${realIndex})">✏️</button>
          <button onclick="eliminar(${realIndex})">❌</button>
        </div>
      `;

      lista.appendChild(div);
    });
  }

  // =========================
  // EDITAR
  // =========================
  window.editar = (i) => {
    const a = articulos[i];

    document.getElementById("titulo").value = a.titulo;
    document.getElementById("autor").value = a.autor;
    document.getElementById("contenido").value = a.contenido;
    document.getElementById("destacado").checked = a.destacado;

    editIndex = i;
  };

  // =========================
  // ELIMINAR
  // =========================
  window.eliminar = (i) => {
    if (confirm("¿Eliminar artículo?")) {
      articulos.splice(i, 1);
      localStorage.setItem("articulos", JSON.stringify(articulos));
      render();
    }
  };

});