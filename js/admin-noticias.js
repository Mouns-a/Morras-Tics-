document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-noticia");
  const lista = document.getElementById("lista-noticias");

  let noticias = JSON.parse(localStorage.getItem("noticias")) || [];

  render();

  form.addEventListener("submit", e => {
    e.preventDefault();
    const file = document.getElementById("imagen").files[0];

    const guardar = (imagenBase64 = "") => {
      const nueva = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        fecha: document.getElementById("fecha").value,
        imagen: imagenBase64
      };

      noticias.push(nueva);
      localStorage.setItem("noticias", JSON.stringify(noticias));
      form.reset();
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

  function render() {
    lista.innerHTML = "";
    // Usamos reverse para ver la más nueva primero
    [...noticias].reverse().forEach((n, i) => {
      const realIndex = noticias.length - 1 - i;
      const div = document.createElement("div");
      div.className = "card-noticia";
      div.innerHTML = `
        <button class="btn-eliminar" onclick="eliminar(${realIndex})">✕ Eliminar</button>
        ${n.imagen ? `<img src="${n.imagen}">` : ''}
        <div class="card-body">
          <span class="fecha">📅 ${n.fecha}</span>
          <h3>${n.titulo}</h3>
          <p class="desc">${n.descripcion}</p>
        </div>
      `;
      lista.appendChild(div);
    });
  }

  window.eliminar = (i) => {
    if(confirm("¿Seguro que quieres borrar esta noticia?")) {
        noticias.splice(i, 1);
        localStorage.setItem("noticias", JSON.stringify(noticias));
        render();
    }
  };
});