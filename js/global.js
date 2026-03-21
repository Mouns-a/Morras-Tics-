document.addEventListener("DOMContentLoaded", () => {
  // CURSOR
  const cursor = document.createElement("div");
  cursor.classList.add("cursor-luz");
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;
  const speed = 0.15;

  // Partículas
  const stars = [];
  const maxStars = 40;

  // Canvas para rastro
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = "none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = 998;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Captura mouse
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover links/botones
  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "220px";
      cursor.style.height = "220px";
      cursor.style.background = "radial-gradient(circle, #ff00ff50, #00ffff50, transparent 70%)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "180px";
      cursor.style.height = "180px";
      cursor.style.background = "radial-gradient(circle, #ff00ff30, #00ffff30, transparent 70%)";
    });
  });

  // Crear estrella
  function createStar(x, y) {
    stars.push({
      x,
      y,
      radius: Math.random() * 1.5 + 0.5,
      alpha: 1,
      decay: Math.random() * 0.02 + 0.01,
      color: Math.random() > 0.5 ? "#ff00ff" : "#00ffff"
    });
    if (stars.length > maxStars) stars.shift();
  }

  // Animación
  function animate() {
    // Suavizar cursor
    posX += (mouseX - posX) * speed;
    posY += (mouseY - posY) * speed;
    cursor.style.left = posX + "px";
    cursor.style.top = posY + "px";

    // Crear estrella
    createStar(posX, posY);

    // Limpiar canvas parcialmente (rastro suave)
    ctx.fillStyle = "rgba(0,0,0,0.03)"; // muy sutil
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar estrellas
    stars.forEach((s, i) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${parseInt(s.color.slice(1,3),16)}, ${parseInt(s.color.slice(3,5),16)}, ${parseInt(s.color.slice(5,7),16)}, ${s.alpha})`;
      ctx.fill();
      s.alpha -= s.decay;
      if (s.alpha <= 0) stars.splice(i, 1);
    });

    requestAnimationFrame(animate);
  }

  animate();

  // ----------------------------
  // ACORDEÓN
  // ----------------------------
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