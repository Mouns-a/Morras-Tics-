/*Inicio Index*/
const canvas = document.getElementById('circuitos');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const nodes = [];
const nodeCount = 90;

for(let i=0;i<nodeCount;i++){
  nodes.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    vx: (Math.random()-0.5)*2,
    vy: (Math.random()-0.5)*2,
    radius: 2 + Math.random()*3,
    pulse: Math.random()*Math.PI*2
  });
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  nodes.forEach(n=>{
    ctx.beginPath();
    ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();

    n.x += n.vx;
    n.y += n.vy;

    if(n.x<0||n.x>canvas.width) n.vx*=-1;
    if(n.y<0||n.y>canvas.height) n.vy*=-1;
  });

  requestAnimationFrame(animate);
}

animate();
/* Final Index*/