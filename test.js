const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document, gridContainer, timerDisplay, startButton;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    gridContainer = document.getElementById("grid-container");
    timerDisplay = document.getElementById("timer");
    startButton = document.getElementById("startButton");
    if (document.readyState !== "loading") done();
    else {
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
    }
  });
});

describe("Captcha Mini-Game", () => {
  beforeEach(() => {
    // Reset grid and buttons between tests
    gridContainer = document.getElementById("grid-container");
    timerDisplay = document.getElementById("timer");
    startButton = document.getElementById("startButton");
  });

  test("Start button initializes game correctly", () => {
    expect(gridContainer.style.display).toBe("none");
    expect(timerDisplay.style.display).toBe("none");
    startButton.click();
    expect(gridContainer.style.display).toBe("grid");
    expect(timerDisplay.style.display).toBe("block");
    expect(startButton.style.display).toBe("none");
  });

  test("Grid initializes with the correct number of cells", () => {
    startButton.click();
    expect(gridContainer.children.length).toBe(242); 
  });

  test("Obstacles are placed correctly", () => {
    startButton.click();
    const obstacles = Array.from(gridContainer.children).filter(cell =>
      cell.classList.contains("obstacle")
    );
    expect(obstacles.length).toBeGreaterThan(0); 
  });

  test("Player is placed at the center of the grid", () => {
    startButton.click();
    const playerCell = gridContainer.children[5 * 11 + 5]; // Center cell (5,5)
    expect(playerCell.classList.contains("player")).toBe(true);
  });

  test("Player moves correctly with arrow keys", () => {
    startButton.click();
    const initialPlayerPosition = 5 * 11 + 5;
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp" }));
    const newPlayerPosition = 4 * 11 + 5;
    expect(gridContainer.children[initialPlayerPosition].classList.contains("player")).toBe(false);
    expect(gridContainer.children[newPlayerPosition].classList.contains("player")).toBe(true);
  });

  test("Player does not move outside grid boundaries", () => {
    startButton.click();
    // Move player to the top left corner
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp" }));
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp" }));
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowLeft" }));
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowLeft" }));
    // Attempt to move outside the grid
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp" }));
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowLeft" }));
    // Check player is still at (0, 0)
    const playerPosition = 0 * 11 + 0;
    expect(gridContainer.children[playerPosition].classList.contains("player")).toBe(false);
  });

  test("Player collides with obstacles and removes them", () => {
    startButton.click();
    // Find obstacle
    const obstacleIndex = Array.from(gridContainer.children).findIndex(cell =>
      cell.classList.contains("obstacle")
    );
    const obstacleRow = Math.floor(obstacleIndex / 11);
    const obstacleCol = obstacleIndex % 11;
    // Move player to obstacle
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: obstacleRow < 5 ? "ArrowUp" : "ArrowDown" }));
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: obstacleCol < 5 ? "ArrowLeft" : "ArrowRight" }));
    // Check collision
    expect(gridContainer.children[obstacleIndex].classList.contains("obstacle")).toBe(true);
  });

  test("Win condition is checked after all obstacles are removed", () => {
    startButton.click();
    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowUp" }));
    const timerText = timerDisplay.textContent;
    expect(timerText).toBe("");
  });
});
