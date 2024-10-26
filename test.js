/// <reference types="jest" />

const puppeteer = require("puppeteer");

let browser;
let page;
let ev;
let dialogMessage;

async function reset() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto("file:///D:/work/node/index.html");
  ev = page.evaluate.bind(page);
  page.on("dialog", async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
}

describe("Number and Word Game Tests", () => {
  beforeAll(async () => {
    await reset();
  });

  describe("Initial State Tests", () => {
    it("Player 1's score should start at 0", async () => {
      const player1Score = await ev(
        () => document.getElementById("player1-score").innerText
      );
      expect(player1Score).toBe("Player 1 score: 0");
    });

    it("Player 2's score should start at 0", async () => {
      const player2Score = await ev(
        () => document.getElementById("player2-score").innerText
      );
      expect(player2Score).toBe("Player 2 score: 0");
    });

    it("Timer should start at 10 seconds", async () => {
      const timer = await ev(() => document.getElementById("timer").innerText);
      expect(timer).toBe("Time left: 10");
    });

    it("Turns should start at 3", async () => {
      const turnsLeft = await ev(
        () => document.getElementById("turns-left").innerText
      );
      expect(turnsLeft).toBe("3");
    });
  });

  describe("Game Mechanic Tests", () => {
    beforeEach(async () => {
      await reset();
    });

    const testCases = [
      { number: 4, word: "characters", expected: "Correct!" },
      { number: 3, word: "short", expected: "Invalid word. Please try again." },
      { number: 3, word: "same", expected: "Invalid word. Please try again." },
      { number: 8, word: "longword", expected: "Correct!" },
    ];

    testCases.forEach(({ number, word, expected }, index) => {
      it(`Test case ${
        index + 1
      } with number ${number} and word "${word}"`, async () => {
        await ev((num) => {
          document.getElementById("number-display").innerText =
            "Number: " + num;
          document.getElementById("word-input").value = "";
        }, number);

        await ev((w) => {
          document.getElementById("word-input").value = w;
        }, word);

        await page.click("#submit-word");

        const resultText = await ev(
          () => document.getElementById("message").innerText
        );
        expect(resultText).toBe(expected);
      });
    });
  });

  describe("End of Game Conditions", () => {
    beforeEach(async () => {
      await reset();
    });

    it("Player 1 should have 1 turns left after 2 plays", async () => {
      let currentNumber = await ev(() => {
        document.getElementById("generate-number").click();
        return window.currentNumber;
      });
      let word = currentNumber % 2 == 0 ? `aaaaaaaaaaa` : `a`;
      for (let i = 0; i < 2; i++) {
        await ev(
          (i, word) => {
            document.getElementById("word-input").value = `${i}${word}${i}`;
            document.getElementById("submit-word").click();
          },
          i,
          word
        );
      }

      const turnsLeft = await ev(
        () => document.getElementById("turns-left").innerText
      );
      expect(turnsLeft).toBe("1");
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
