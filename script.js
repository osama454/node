const container = document.getElementById("game-container");

for (let i = 0; i < 9; i++) { // Set to iterate 9 times for a 3x3 grid
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
  const idx = Math.floor(Math.random() * holes.length); // Ensured hole index is randomized
  return holes[idx];
}

function peep() {
  const hole = randomHole();
  const mole = hole.querySelector(".mole");
  mole.style.display = "block"; // Mole becomes visible
  setTimeout(() => (mole.style.display = "none"), 1000); // Mole hides after 1 second
}

function startGame() {
  score = 0; // Reset score at game start
  scoreEl.textContent = `Score: ${score}`;
  peep();
  setInterval(peep, 1500); // 1.5 seconds
  setTimeout(() => {
    timeUp = true;
    alert(`Game Over! Your final score is ${score}`); // Correctly alerts the final score
  }, 10000); // Game length is 10 seconds
}

holes.forEach((hole) => {
  hole.addEventListener("click", () => {
    if (hole.querySelector(".mole").style.display === "block") { // Checks if mole is visible
      score++;
      scoreEl.textContent = `Score: ${score}`; // Updates score immediately
      hole.querySelector(".mole").style.display = "none"; // Hides mole on click
    }
  });
});

startGame(); // Starts the game immediately on page load
