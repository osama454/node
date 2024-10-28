/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;
let /** @type {HTMLElement} */ scoreEl, /** @type {NodeListOf<HTMLElement>} */ holes;

beforeAll(() => {
  jest.useFakeTimers(); // Use fake timers for time manipulation

});

function set() {
  scoreEl = document.getElementById("score");
  holes = document.querySelectorAll(".hole");
  window.alert = jest.fn(); // Mock window.alert
}

function reset(done) {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;

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

describe("Initial Game State Tests", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("Init - Score should start at 0", () => {
    expect(scoreEl.textContent).toBe("Score: 0");
  });

  it("Game Over Alert - Should display final score", () => {
    jest.advanceTimersByTime(10000); // Fast-forward 10 seconds
    expect(window.alert).toHaveBeenCalledWith("Game Over! Your final score is 0");
  });
});

describe("Game Interaction Tests - After Reset", () => {
  beforeAll((done) => {
    reset(done); // Reset the game state before running these tests
  });

  it("Init - Score should start at 0 after reset", () => {
    expect(scoreEl.textContent).toBe("Score: 0");
  });

  for (let i = 1; i <= 3; i++) {
    it(`Hole Click - Should increment score when mole clicked ${i}`, () => {
      // Simulate mole appearance and clicking
      const mole = holes[0].querySelector(".mole");
      mole.style.display = "block"; // Show mole
      holes[0].click(); // Simulate click
      mole.style.display = "none"; // Hide mole

      expect(scoreEl.textContent).toBe(`Score: ${i}`);
    });
  }
});