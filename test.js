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
    //accept alert
    await dialog.accept();
  });
}

describe("Word Game Tests", () => {
  beforeAll(async () => {
    await reset();
  });

  describe("Initial State Tests", () => {
    it("Player 1's score should start at 0", async () => {
      const player1Score = await ev(
        () => document.getElementById("player1Score").innerText
      );
      expect(player1Score).toBe("Score: 0");
    });

    it("Player 2's score should start at 0", async () => {
      const player2Score = await ev(
        () => document.getElementById("player2Score").innerText
      );
      expect(player2Score).toBe("Score: 0");
    });

    it("Timer should start at 10 seconds", async () => {
      const timer = await ev(() => document.getElementById("timer").innerText);
      expect(timer).toBe("10");
    });

    it("Player 1's turns should start at 3", async () => {
      const player1Turns = await ev(
        () => document.getElementById("player1Turns").innerText
      );
      expect(player1Turns).toBe("Turns Left: 3");
    });

    it("Player 2's turns should start at 3", async () => {
      const player2Turns = await ev(
        () => document.getElementById("player2Turns").innerText
      );
      expect(player2Turns).toBe("Turns Left: 3");
    });
  });

  describe("Game Mechanic Tests", () => {
    beforeAll(async () => {
      await reset();
    });

    const testCases = [
      { player: 1, number: 4, word: "characters", expected: "Correct!" },
      { player: 1, number: 3, word: "short", expected: "Correct!" },
      { player: 1, number: 3, word: "same", expected: "Incorrect!" },
      { player: 2, number: 8, word: "longword", expected: "Correct!" },
    ];

    testCases.forEach(({ player, number, word, expected }, index) => {
      it(`Test case ${
        index + 1
      } for player ${player} with number ${number} and word "${word}"`, async () => {
        await ev(
          (p, num) => {
            document.getElementById(`player${p}Number`).innerText = num;
          },
          player,
          number
        );

        await ev(
          (p, w) => {
            document.getElementById(`player${p}Word`).value = w;
          },
          player,
          word
        );

        await ev((p) => {
          window[`checkWord`](p);
        }, player);

        const resultText = await ev(
          (p) => document.getElementById(`player${p}Result`).innerText,
          player
        );
        expect(resultText).toBe(expected);
      });
    });
  });

  describe("End of Game Conditions", () => {
    beforeAll(async () => {
      await reset();
    });

    it("Player 1 should have no turns left after 3 plays", async () => {
      for (let i = 0; i < 3; i++) {
        await ev(() => {
          document.querySelector(`#player1 button`).click(); // Clicks the "Generate Number" button for Player 1
        });
      }

      const player1Turns = await ev(
        () => document.getElementById("player1Turns").innerText
      );
      expect(player1Turns).toBe("Turns Left: 0");
    });

    it("Player 2 should win if they have a higher score after all turns", async () => {
      await ev(() => {
        document.getElementById("player1Score").innerText = "Score: 2";
        document.getElementById("player2Score").innerText = "Score: 3";
      });

      await ev(() => {
        window.determineWinner();
      });

      expect(dialogMessage).toBe("It's a tie with both players scoring 0!");
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
