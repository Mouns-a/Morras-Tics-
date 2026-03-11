const canvas = document.getElementById('circuitos');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nodes = [];

for(let i=0;i<70;i++){

nodes.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
vx:(Math.random()-0.5)*1.5,
vy:(Math.random()-0.5)*1.5
});

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

for(let i=0;i<nodes.length;i++){

let n = nodes[i];

ctx.fillStyle="#00ffff";

ctx.beginPath();
ctx.arc(n.x,n.y,2,0,Math.PI*2);
ctx.fill();

n.x += n.vx;
n.y += n.vy;

if(n.x<0||n.x>canvas.width) n.vx*=-1;
if(n.y<0||n.y>canvas.height) n.vy*=-1;

for(let j=i+1;j<nodes.length;j++){

let dx = n.x-nodes[j].x;
let dy = n.y-nodes[j].y;

let dist = Math.sqrt(dx*dx+dy*dy);

if(dist<120){

ctx.strokeStyle="rgba(0,255,255,0.2)";

ctx.beginPath();
ctx.moveTo(n.x,n.y);
ctx.lineTo(nodes[j].x,nodes[j].y);
ctx.stroke();

}

}

}

requestAnimationFrame(animate);

}

animate();