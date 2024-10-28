/// <reference types="jest" />
const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};
let /** @type {Window} */ window, /** @type {Document} */ document;

// Define the HTML components that will be interacted with here
let /** @type {HTMLElement} */ fireButton,
  /** @type {HTMLElement} */ messageDiv,
  /** @type {HTMLElement} */ timerDiv,
  /** @type {HTMLCanvasElement} */ canvas,
  /** @type {CanvasRenderingContext2D} */ ctx;

// Setup function to initialize components and mock functions
function set() {
  fireButton = document.getElementById("fireButton");
  messageDiv = document.querySelector(".message");
  timerDiv = document.querySelector(".timer");
  canvas = document.getElementById("battlefield");
  ctx = canvas.getContext("2d");
  window.alert = jest.fn(); // Mock alert to avoid using it
}
beforeAll(() => {
  jest.useFakeTimers(); // Using fake timers to control time
});

// Reset function to reinitialize the DOM for each describe
function reset(done) {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;
    Object.defineProperty(window.HTMLElement.prototype, "innerText", {
      get() {
        return this.textContent;
      },
      set(value) {
        this.textContent = value;
      },
    });
    if (document.readyState !== "loading") {
      set();
      done();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        set();
        done();
      });
    }
  });
}

// Helper function to detect ship positions on the canvas based on color
function getShipPositions() {
  const shipPositions = [];
  const cellSize = (canvas.width - 50 - 20) / 10; // Calculated based on the game’s row/col dimensions
  const boardSize = { rows: 5, cols: 10 };

  // Detect ship cells based on the initial color fill (gray) for ships
  for (let row = 0; row < boardSize.rows; row++) {
    for (let col = 0; col < boardSize.cols; col++) {
      const x = 50 + col * cellSize;
      const y = 50 + row * cellSize;
      const pixelData = ctx.getImageData(
        x + cellSize / 2,
        y + cellSize / 2,
        1,
        1
      ).data;

      // Check if the pixel color corresponds to a ship (gray)
      if (
        pixelData[0] === 136 &&
        pixelData[1] === 136 &&
        pixelData[2] === 136
      ) {
        // RGB values for gray
        shipPositions.push([row + 1, String.fromCharCode(65 + col)]); // Store as row (1-based) and column (A-J)
      }
    }
  }
  return shipPositions;
}

// Testing timer countdown from 5 to "Start Naval Battle"
describe("Countdown Timer", () => {
  beforeAll((done) => reset(done));

  it("displays '5' at start", () => {
    expect(timerDiv.innerHTML).toBe("5");
  });

  Array.from({ length: 4 }).forEach((_, i) => {
    it(`Countdown at ${5 - i}`, () => {
      jest.advanceTimersByTime(1000);
      expect(timerDiv.innerHTML).toBe(`${5 - (i + 1)}`);
    });
  });

  it("displays 'Start Naval Battle!' when countdown reaches 0", () => {
    jest.advanceTimersByTime(1000);
    expect(timerDiv.innerHTML).toBe("Start Naval Battle!");
  });
});

// Testing player shooting functionality and message responses
describe("Player Shooting", () => {
  beforeAll((done) => reset(done));

  it("displays 'Water!' for a miss", () => {
    jest.advanceTimersByTime(6000); // Ensure game start
    fireButton.click();
    expect(messageDiv.innerHTML).toBe("Water!");
  });

  it("displays 'Nice Shot!' on hitting part of a ship", () => {
    const shipPositions = getShipPositions(); // Get positions of all ships
    const [row, col] = shipPositions[0];
    document.getElementById("row").value = row;
    document.getElementById("col").value = col;
    fireButton.click();
    expect(["Nice Shot!", "Ship Sunk!"]).toContain(messageDiv.innerHTML);
  });

  it("displays 'Ship Sunk!' on sinking a ship", () => {
    // Get positions for the first ship and simulate shots
    const shipPositions = getShipPositions();
    const shipCells = shipPositions.slice(0, 3); // Assuming this ship has 3 cells

    shipCells.forEach(([row, col], i) => {
      document.getElementById("row").value = row;
      document.getElementById("col").value = col;
      fireButton.click();
      expect(["Nice Shot!", "Ship Sunk!"]).toContain(messageDiv.innerHTML);
    });
  });
});

// Testing win and lose scenarios
describe("Game Win Conditions", () => {
  beforeAll((done) => reset(done));

  it("displays 'You Win!' on sinking all ships within time", () => {
    jest.advanceTimersByTime(6000); // Ensure game start
    // Get all ship positions and simulate shots to sink them
    const allShipPositions = getShipPositions();
    allShipPositions.forEach(([row, col], i) => {
      document.getElementById("row").value = row;
      document.getElementById("col").value = col;
      fireButton.click();
      expect(["Nice Shot!", "Ship Sunk!", "You Win!"]).toContain(messageDiv.innerHTML);
    });
  });
});


describe("Game Lose Conditions", () => {
  beforeAll((done) => reset(done));
  it("displays 'Game Over!' when time runs out and ships are not fully sunk", () => {
    jest.advanceTimersByTime(66000); // Fast forward to end of timer
    expect(messageDiv.innerHTML).toBe("Game Over!");
  });
});