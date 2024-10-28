const container = document.getElementById("game-container");

for (let i = 0; i < 9; i++) {
  const createDiv = document.createElement("div");
  createDiv.className = "hole";
  container.appendChild(createDiv);
  const createMole = document.createElement("div");
  createMole.className = "mole";
  createDiv.appendChild(createMole);
}

const holes = document.querySelectorAll(".hole");
const scoreEl = document.getElementById("score");
let score = 0;

function randomHole() {
  const idx = Math.floor(Math.random() * holes.length);
  return holes[idx];
}

function peep() {
  const hole = randomHole();
  const mole = hole.querySelector(".mole");
  mole.style.display = "block";
  setTimeout(() => (mole.style.display = "none"), 1000); // Hide after 1 second
}

function startGame() {
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  peep();
  setInterval(peep, 1500); // New mole every 1.5 seconds
  setTimeout(() => {
    timeUp = true;
    alert(`Game Over! Your final score is ${score}`);
}, 10000); // Game duration: 10 seconds
}

holes.forEach((hole) => {
  hole.addEventListener("click", () => {
    if (hole.querySelector(".mole").style.display === "block") {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      hole.querySelector(".mole").style.display = "none";
    }
  });
});

startGame(); // Start the game immediately
