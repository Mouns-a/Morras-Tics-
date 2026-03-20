const canvas = document.getElementById('circuitos');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const nodes = [];
const nodeCount = 80;

// Crear nodos
for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    radius: 2 + Math.random() * 2
  });
}

function drawConnections() {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[i].x - nodes[j].x;
      let dy = nodes[i].y - nodes[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        let opacity = 1 - dist / 120;

        ctx.strokeStyle = `rgba(0,255,255,${opacity})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawConnections();

  nodes.forEach(n => {
    // Dibujar nodo
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();

    // Movimiento
    n.x += n.vx;
    n.y += n.vy;

    // Rebote
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });

  requestAnimationFrame(animate);
}

animate();
// PARALLAX IMAGEN ÉPICA
window.addEventListener("scroll", () => {
  const img = document.querySelector(".imagen-epica img");
  if (!img) return;

  let scroll = window.scrollY;
  img.style.transform = `translateY(${scroll * 0.2}px) scale(1.05)`;
});

// CURSOR LUZ
const cursor = document.querySelector(".cursor-luz");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
/* Final Index*/

const botones = document.querySelectorAll(".titulo-item");

botones.forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const contenido = btn.nextElementSibling;

    // Alternar visualmente el acordeón
    if (contenido.style.display === "block") {
      contenido.style.display = "none";
      item.classList.remove("active");
    } else {
      contenido.style.display = "block";
      item.classList.add("active");
    }
  });
});