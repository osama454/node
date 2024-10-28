/// <reference types="jest" />

const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;

// Define the HTML components that will be interacted with
let player1GenerateButton, player1SubmitButton, player1Result, player1WordInput;
let player2GenerateButton, player2SubmitButton, player2Result, player2WordInput;
let player1Score, player1Turns, player2Score, player2Turns, timer, player1Number, player2Number;

beforeAll(() => {
  jest.useFakeTimers(); // Use fake timers for time manipulation
});

function set() {
  // Set all the HTML components that will be interacted with here
  player1GenerateButton = document.querySelector(
    "#player1 button[onclick='startGame(1)']"
  );
  player1SubmitButton = document.querySelector(
    "#player1 button[onclick='checkWord(1)']"
  );
  player1Result = document.getElementById("player1Result");
  player1WordInput = document.getElementById("player1Word");
  player1Score = document.getElementById("player1Score");
  player1Turns = document.getElementById("player1Turns");
  player1Number = document.getElementById("player1Number");

  player2GenerateButton = document.querySelector(
    "#player2 button[onclick='startGame(2)']"
  );
  player2SubmitButton = document.querySelector(
    "#player2 button[onclick='checkWord(2)']"
  );
  player2Result = document.getElementById("player2Result");
  player2WordInput = document.getElementById("player2Word");
  player2Score = document.getElementById("player2Score");
  player2Turns = document.getElementById("player2Turns");
  player2Number = document.getElementById("player2Number");

  timer = document.getElementById("timer");

  // Mock alert for testing
  window.alert = jest.fn();
}

function reset(done) {
  JSDOM.fromFile("ideal.html", options).then((dom) => {
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
    if (document.readyState != "loading") {
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

describe("Scenario: Player 1 plays based on generated numbers", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("Player 1 initial state", () => {
    expect(player1Score.textContent).toBe("Score: 0");
    expect(player1Turns.textContent).toBe("Turns Left: 3");
  });

  it("Player 1 generates a number and checks word length requirement", () => {
    player1GenerateButton.click();
    const generatedNumber = parseInt(player1Number.textContent, 10);

    if (generatedNumber % 2 === 0) {
      // Even number; word should be > 7 characters
      player1WordInput.value = "elephant";
      player1SubmitButton.click();
      expect(player1Result.textContent).toBe("Correct!");
    } else {
      // Odd number; word should be < 7 characters
      player1WordInput.value = "short";
      player1SubmitButton.click();
      expect(player1Result.textContent).toBe("Correct!");
    }
  });

  it("Player 1 score updates after correct word entry", () => {
    expect(player1Score.textContent).toBe("Score: 1");
  });

  it("Player 1 generates a new number and tests invalid word length", () => {
    player1GenerateButton.click();
    const generatedNumber = parseInt(player1Number.textContent, 10);

    if (generatedNumber % 2 === 0) {
      // Even number; word should be > 7 characters, but using < 7 characters to test
      player1WordInput.value = "small";
      player1SubmitButton.click();
      expect(player1Result.textContent).toBe("Incorrect!");
    } else {
      // Odd number; word should be < 7 characters, but using > 7 characters to test
      player1WordInput.value = "incorrect2";
      player1SubmitButton.click();
      expect(player1Result.textContent).toBe("Incorrect!");
    }
  });

  it("Player 1 completes all turns", () => {
    for (let i = 0; i < 2; i++) {
      player1GenerateButton.click();
      const generatedNumber = parseInt(player1Number.textContent, 10);

      if (generatedNumber % 2 === 0) {
        player1WordInput.value = "software";
      } else {
        player1WordInput.value = "tiny";
      }

      player1SubmitButton.click();
    }
    expect(player1Turns.textContent).toBe("Turns Left: 0");
  });
});

describe("Scenario: Player 2 follows word length rules", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("Player 2 initial state", () => {
    expect(player2Score.textContent).toBe("Score: 0");
    expect(player2Turns.textContent).toBe("Turns Left: 3");
  });

  it("Player 2 generates a number and follows word length rule", () => {
    player2GenerateButton.click();
    const generatedNumber = parseInt(player2Number.textContent, 10);

    if (generatedNumber % 2 === 0) {
      player2WordInput.value = "computer";
      player2SubmitButton.click();
      expect(player2Result.textContent).toBe("Correct!");
    } else {
      player2WordInput.value = "short";
      player2SubmitButton.click();
      expect(player2Result.textContent).toBe("Correct!");
    }
  });

  it("Player 2 generates a new number and tests invalid word length", () => {
    player2GenerateButton.click();
    const generatedNumber = parseInt(player2Number.textContent, 10);

    if (generatedNumber % 2 === 0) {
      player2WordInput.value = "small"; // Too short for even number
      player2SubmitButton.click();
      expect(player2Result.textContent).toBe("Incorrect!");
    } else {
      player2WordInput.value = "lengthy"; // Too long for odd number
      player2SubmitButton.click();
      expect(player2Result.textContent).toBe("Incorrect!");
    }
  });

  it("Player 2 completes remaining turns", () => {
    for (let i = 0; i < 2; i++) {
      player2GenerateButton.click();
      const generatedNumber = parseInt(player2Number.textContent, 10);

      if (generatedNumber % 2 === 0) {
        player2WordInput.value = "software";
      } else {
        player2WordInput.value = "tiny";
      }

      player2SubmitButton.click();
    }
    expect(player2Turns.textContent).toBe("Turns Left: 0");
  });
});

describe("Scenario: Game ends and winner is determined", () => {
  beforeAll((done) => {
    reset(done);
  });

  it("Game end and winner announcement", () => {
    player1GenerateButton.click();
    player1SubmitButton.click();
    player2GenerateButton.click();
    player2SubmitButton.click();

    jest.advanceTimersByTime(30000); // Fast forward to simulate end of game

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringMatching(/wins with a score of|It's a tie with both players scoring/)
    );
  });
});
