document.addEventListener("DOMContentLoaded", () => {

  const contenedor = document.getElementById("contenedor-noticias");

  let noticias = JSON.parse(localStorage.getItem("noticias")) || [];

  if (noticias.length === 0) {
    contenedor.innerHTML = "<p>No hay noticias aún 🚀</p>";
    return;
  }

  noticias.forEach(n => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      ${n.imagen ? `<img src="${n.imagen}" class="img">` : ""}

      <h3>${n.titulo}</h3>
      <p>${n.descripcion}</p>
      <span>${n.fecha}</span>
    `;

    contenedor.appendChild(card);
  });

});