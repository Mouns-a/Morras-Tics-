document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-articulo");

  let articulos = JSON.parse(localStorage.getItem("articulos")) || [];

  form.addEventListener("submit", e => {
    e.preventDefault();

    const file = document.getElementById("imagen").files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        guardarArticulo(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      guardarArticulo("");
    }
  });

  function guardarArticulo(imagenBase64) {

    const nuevo = {
      titulo: document.getElementById("titulo").value,
      autor: document.getElementById("autor").value,
      categoria: document.getElementById("categoria").value,
      contenido: document.getElementById("contenido").value,
      imagen: imagenBase64,
      destacado: document.getElementById("destacado").checked,
      fecha: new Date().toISOString()
    };

    articulos.push(nuevo);

    localStorage.setItem("articulos", JSON.stringify(articulos));

    form.reset();
    alert("Artículo publicado 🚀");
  }

});