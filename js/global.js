document.addEventListener("DOMContentLoaded", () => {
    // === CURSOR NEÓN ===
    const cursor = document.querySelector(".cursor-luz");
    if (cursor) {
        document.addEventListener("mousemove", (e) => {
            cursor.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const hoverScale = (size, opacity) => {
            cursor.style.width = size;
            cursor.style.height = size;
            cursor.style.background = `radial-gradient(circle, #ff00ff${opacity}, transparent 70%)`;
        };

        document.querySelectorAll("a, button, .card-noticia").forEach(el => {
            el.addEventListener("mouseenter", () => hoverScale("250px", "80"));
            el.addEventListener("mouseleave", () => hoverScale("200px", "40"));
        });
    }

    // === CANVAS CIRCUITOS ===
    const canvas = document.getElementById('circuitos');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let nodes = [];
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < 80; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach((n, i) => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

                ctx.fillStyle = "#00ffff";
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(n.x - nodes[j].x, n.y - nodes[j].y);
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist/120})`;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
document.addEventListener("DOMContentLoaded", () => {
  const tarjetas = document.querySelectorAll(".rol-card");

  tarjetas.forEach(card => {
    card.addEventListener("click", () => {
      tarjetas.forEach(c => {
        if (c !== card) {
          c.classList.remove("activo");
        }
      });

      card.classList.toggle("activo");
    });
  });
});