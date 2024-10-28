/// <reference types="jest" />
const puppeteer = require("puppeteer");

let browser;
let page;
let ev;
let dialogMessage = "";

// Define the HTML components that will be interacted with here
let /** @type {HTMLElement} */ scoreEl, /** @type {NodeListOf<HTMLElement>} */ holes;

// Reset function to load the page and initialize elements
async function reset() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto("file:///D:/work/node/index.html");
  ev = page.evaluate.bind(page);
  dialogMessage = "";
  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await ev(() => {
    // Get all HTML components
    scoreEl = document.getElementById("score");
    holes = document.querySelectorAll(".hole");
  });
}

describe("Initial Game State Tests", () => {
  beforeAll(async () => {
    await reset();
  });

  it("Init - Score should start at 0", async () => {
    const initialScore = await ev(() => scoreEl.textContent);
    expect(initialScore).toBe("Score: 0");
  });

  it("Game Over Alert - Should display final score", async () => {
    // Wait for game duration (10 seconds)
    await new Promise((r) => setTimeout(r, 10000));
    expect(dialogMessage).toBe("Game Over! Your final score is 0");
  }, 11000);
});

describe("Game Interaction Tests - After Reset", () => {
  beforeAll(async () => {
    await reset(); // Reset the game state before running these tests
  });

  it("Init - Score should start at 0 after reset", async () => {
    const initialScore = await ev(() => scoreEl.textContent);
    expect(initialScore).toBe("Score: 0");
  });

  for (let i = 1; i <= 3; i++) {
    it(`Hole Click - Should increment score when mole clicked ${i}`, async () => {
      await ev(() => {
        // Simulate mole appearance and clicking
        const mole = holes[0].querySelector(".mole");
        mole.style.display = "block"; // Show mole
        holes[0].click(); // Simulate click
        mole.style.display = "none"; // Hide mole
      });
      const score = await ev(() => scoreEl.textContent);
      expect(score).toBe(`Score: ${i}`);
    });
  }
});

