const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const massSlider = document.getElementById('mass');
const velocitySlider = document.getElementById('velocity');
const forceConstantSlider = document.getElementById('forceConstant'); // Slider for force constant
const startStopButton = document.getElementById('startStop'); // Button for start/stop
const massValue = document.getElementById('massValue');
const velocityValue = document.getElementById('velocityValue');

running = false; // Variable to control animation start/stop
particleMass = parseFloat(massSlider.value);
let initialVelocity = parseFloat(velocitySlider.value);
let forceConstant = parseFloat(forceConstantSlider.value); // Initial force constant set from slider
const center = { x: canvas.width / 2, y: canvas.height / 2 }; // Center coordinate for particle orbit

particle = {
    x: center.x + 200, // Starting x-coordinate to offset by 200
    y: center.y,
    vx: 0,
    vy: -initialVelocity, // Initial vertical velocity opposite to y-axis
    ax: 0,
    ay: 0
};

const dt = 0.01; // Time step
let trail = [];

function initializeSimulation() {
    particleMass = parseFloat(massSlider.value);
    initialVelocity = parseFloat(velocitySlider.value);
    forceConstant = parseFloat(forceConstantSlider.value);

    particle = {
        x: center.x + 200,
        y: center.y,
        vx: 0,
        vy: -initialVelocity,
        ax: 0,
        ay: 0
    };

    trail = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawVectorField();
}

function calculateForce(x, y) {
    const dx = x - center.x;
    const dy = y - center.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const forceMagnitude = forceConstant * particleMass / (r * r); // Uses forceConstant for central force calculation
    return {
        fx: -forceMagnitude * dx / r,
        fy: -forceMagnitude * dy / r
    };
}

function update() {
    const force = calculateForce(particle.x, particle.y);
    particle.ax = force.fx / particleMass;
    particle.ay = force.fy / particleMass;

    particle.vx += particle.ax * dt;
    particle.vy += particle.ay * dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;

    trail.push({ x: particle.x, y: particle.y });
    if (trail.length > 500) {
        trail.shift(); // Maintains trail of max 500 points
    }
}

function drawVectorField() {
    const step = 40;
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
    for (let x = 0; x < canvas.width; x += step) {
        for (let y = 0; y < canvas.height; y += step) {
            const force = calculateForce(x, y);
            const magnitude = Math.sqrt(force.fx * force.fx + force.fy * force.fy);
            const scale = 15 / magnitude;

            drawArrow(x, y, x + force.fx * scale, y + force.fy * scale);
        }
    }
}

function drawArrow(fromx, fromy, tox, toy) {
    const headlen = 10;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function draw() {
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    trail.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function animate() {
    if (!running) return; // Animation runs only if running is true

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawVectorField();
    update();
    draw();

    requestAnimationFrame(animate);
}

massSlider.addEventListener('input', () => {
    particleMass = parseFloat(massSlider.value);
    massValue.textContent = particleMass;
    initializeSimulation();
});

velocitySlider.addEventListener('input', () => {
    initialVelocity = parseFloat(velocitySlider.value);
    particle.vx = 0;
    particle.vy = -initialVelocity;
    velocityValue.textContent = initialVelocity;
    initializeSimulation();
});

forceConstantSlider.addEventListener('input', () => { // Force constant input event listener
    forceConstant = parseFloat(forceConstantSlider.value);
    initializeSimulation();
});

startStopButton.addEventListener('click', () => { // Event listener for start/stop button
    running = !running;
    if (running) {
        initializeSimulation();
        requestAnimationFrame(animate);
    }
});

initializeSimulation();
MathJax.typeset(); // MathJax syntax for immediate typesetting
