const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const massSlider = document.getElementById('mass');
const velocitySlider = document.getElementById('velocity');
const massValue = document.getElementById('massValue');
const velocityValue = document.getElementById('velocityValue');

let particleMass = parseFloat(massSlider.value);
let initialVelocity = parseFloat(velocitySlider.value);
const G = 1; // Gravitational constant (adjusted for simulation)
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let particleX = 50;
let particleY = centerY;
let particleVx = initialVelocity;
let particleVy = 0;

function drawForceField() {
  // (Simplified for visualization) Draw lines radiating from the center
  for (let i = 0; i < 360; i += 15) {
    const angle = i * Math.PI / 180;
    const x = centerX + Math.cos(angle) * 50;
    const y = centerY + Math.sin(angle) * 50;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function updateParticle() {
  const dx = centerX - particleX;
  const dy = centerY - particleY;
  const distSq = dx * dx + dy * dy;
  const dist = Math.sqrt(distSq);
  const force = G / distSq; // Assuming central mass = 1

  const ax = force * dx / dist;
  const ay = force * dy / dist;

  particleVx += ax;
  particleVy += ay;

  particleX += particleVx;
  particleY += particleVy;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawForceField();

  ctx.beginPath();
  ctx.arc(particleX, particleY, 5, 0, 2 * Math.PI);
  ctx.fill();

  updateParticle();

  requestAnimationFrame(draw);
}

massSlider.addEventListener('input', () => {
  particleMass = parseFloat(massSlider.value);
  massValue.textContent = particleMass;
});

velocitySlider.addEventListener('input', () => {
  initialVelocity = parseFloat(velocitySlider.value);
  velocityValue.textContent = initialVelocity;
  particleVx = initialVelocity; // Reset simulation with new velocity
  particleVy = 0;
  particleX = 50;
  particleY = centerY;
});

draw();