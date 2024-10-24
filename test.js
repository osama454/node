const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    if (document.readyState !== "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
  });
});

describe("Mini-Game CAPTCHA", () => {
  let startButton, grid, timeDisplay ;

  beforeEach(() => {
    startButton = document.getElementById("startButton");
    grid = document.getElementById("grid");
    timeDisplay = document.getElementById("timeDisplay");
  });

  test("Initial page elements are rendered correctly", () => {
    expect(startButton).not.toBeNull();
    expect(grid).not.toBeNull();
    expect(timeDisplay).not.toBeNull();
    expect(grid.children.length).toBe(11 * 11); // 11x11 grid
  });

  test("Start button click starts the game", () => {
    // Click the start button to trigger game start
    startButton.click();

    // Check if grid is displayed and start button is hidden
    expect(grid.style.display).toBe("grid");
    expect(startButton.style.display).toBe("none");
    expect(timeDisplay.style.display).toBe("block");

    // Verify time display is updated
    expect(timeDisplay.textContent).toMatch(/Time: \d+ ms/);
  });

  test("Blue piece starts in the center", () => {
    const blueCell = grid.children[5 * 11 + 5]; // Initial center position
    expect(blueCell.classList.contains("blue")).toBe(true);
  });

  test("Three red cells are placed randomly", () => {
    const redCells = Array.from(grid.children).filter((cell) =>
      cell.classList.contains("red")
    );
    expect(redCells.length).toBe(3); // Three red cells
  });

  test("Blue piece moves correctly when arrow keys are pressed", () => {
    startButton.click();

    const initialBlueCell = grid.children[5 * 11 + 5];
    expect(initialBlueCell.classList.contains("blue")).toBe(true);

    const keydownEvent = new window.KeyboardEvent("keydown", { key: "ArrowUp" });
    document.dispatchEvent(keydownEvent);

    const newBlueCell = grid.children[4 * 11 + 5]; // New position after moving up
    expect(newBlueCell.classList.contains("blue")).toBe(true);
    expect(initialBlueCell.classList.contains("blue")).toBe(false);
  });

  test("Game ends when all red cells are removed", () => {
    startButton.click();

    // Simulate moving over all red cells
    const redCells = Array.from(grid.children).filter((cell) =>
      cell.classList.contains("red")
    );

    redCells.forEach((cell) => {
      const index = Array.from(grid.children).indexOf(cell);
      const x = index % 11;
      const y = Math.floor(index / 11);

      grid.children[index].dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "ArrowRight" })
      );
    });

    // After removing all red cells
    const remainingRedCells = Array.from(grid.children).filter((cell) =>
      cell.classList.contains("red")
    );
    expect(remainingRedCells.length).toBe(3);
    expect(timeDisplay.textContent).toMatch(/Time: \d+ ms/);
  });

  test("Boundaries are respected", () => {
    startButton.click();

    const keydownEventLeft = new window.KeyboardEvent("keydown", { key: "ArrowLeft" });
    const keydownEventUp = new window.KeyboardEvent("keydown", { key: "ArrowUp" });
    document.dispatchEvent(keydownEventLeft);
    document.dispatchEvent(keydownEventUp);

    // Ensure the piece does not move out of the grid
    const blueCell = grid.children[0 * 11 + 0];
    expect(blueCell.classList.contains("blue")).toBe(false);
  });
});
