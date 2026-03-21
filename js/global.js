document.addEventListener("DOMContentLoaded", () => {
  // CURSOR LUZ
  const cursor = document.createElement("div");
  cursor.classList.add("cursor-luz");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "250px";
      cursor.style.height = "250px";
      cursor.style.background = "radial-gradient(circle, #ff00ff80, transparent 70%)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "200px";
      cursor.style.height = "200px";
      cursor.style.background = "radial-gradient(circle, #ff00ff40, transparent 70%)";
    });
  });
  // CURSOR LUZ FLUIDO
const cursor = document.querySelector(".cursor-luz");

let mouseX = 0, mouseY = 0;   // posición real del mouse
let posX = 0, posY = 0;       // posición del cursor "suave"

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Función de animación
function animateCursor() {
  // Interpolación lineal (lerp)
  posX += (mouseX - posX) * 0.15; // 0.15 = velocidad, ajusta para más rápido/lento
  posY += (mouseY - posY) * 0.15;

  cursor.style.left = posX + "px";
  cursor.style.top = posY + "px";

  requestAnimationFrame(animateCursor);
}

animateCursor(); // iniciar animación

// Efecto al pasar sobre botones y links
document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "250px";
    cursor.style.height = "250px";
    cursor.style.background = "radial-gradient(circle, #ff00ff80, transparent 70%)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "200px";
    cursor.style.height = "200px";
    cursor.style.background = "radial-gradient(circle, #ff00ff40, transparent 70%)";
  });
});

  // ACORDEÓN
  const botones = document.querySelectorAll(".titulo-item");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const contenido = btn.nextElementSibling;

      if (contenido.style.display === "block") {
        contenido.style.display = "none";
        item.classList.remove("active");
      } else {
        contenido.style.display = "block";
        item.classList.add("active");
      }
    });
  });
});