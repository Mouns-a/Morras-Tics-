document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 🟣 CURSOR GLOBAL
  // =========================
  const cursor = document.querySelector(".cursor-luz");

  if (cursor) {
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    const speed = 1;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      posX += (mouseX - posX) * speed;
      posY += (mouseY - posY) * speed;

      cursor.style.left = posX + "px";
      cursor.style.top = posY + "px";

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover efectos
    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "250px";
        cursor.style.height = "250px";
        cursor.style.background =
          "radial-gradient(circle, #ff00ff80, transparent 70%)";
      });

      el.addEventListener("mouseleave", () => {
        cursor.style.width = "200px";
        cursor.style.height = "200px";
        cursor.style.background =
          "radial-gradient(circle, #ff00ff40, transparent 70%)";
      });
    });
  }

  // =========================
  // 🌌 CANVAS GLOBAL
  // =========================
  const canvas = document.getElementById("circuitos");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const nodes = [];
    const nodeCount = 80;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
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
            ctx.strokeStyle = "rgba(0,255,255,0.2)";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      requestAnimationFrame(animateCanvas);
    }

    canvas.addEventListener("mousemove", (e) => {
      nodes.forEach(n => {
        let dx = n.x - e.clientX;
        let dy = n.y - e.clientY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          n.vx += dx * 0.0005;
          n.vy += dy * 0.0005;
        }
      });
    });

    animateCanvas();
  }

  // =========================
  // 📦 ACORDEÓN GLOBAL
  // =========================
  const botones = document.querySelectorAll(".titulo-item");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const contenido = btn.nextElementSibling;

      contenido.style.display =
        contenido.style.display === "block" ? "none" : "block";
    });
  });

});