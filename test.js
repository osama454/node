const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window,
  document,
  generateNumberButton,
  numberDisplay,
  wordInput,
  submitWordButton,
  message,
  usedLetters,
  player1Score,
  player2Score,
  currentPlayerSpan,
  turnsLeftSpan,
  timer;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;

    // Get references to DOM elements after the document is ready
    generateNumberButton = document.getElementById("generate-number");
    numberDisplay = document.getElementById("number-display");
    wordInput = document.getElementById("word-input");
    submitWordButton = document.getElementById("submit-word");
    message = document.getElementById("message");
    usedLetters = document.getElementById("used-letters");
    player1Score = document.getElementById("player1-score");
    player2Score = document.getElementById("player2-score");
    currentPlayerSpan = document.getElementById("current-player");
    turnsLeftSpan = document.getElementById("turns-left");
    timer = document.getElementById("timer");

    if (document.readyState != "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
  });
});

describe("Number and Word Game Logic", () => {
  beforeEach(() => {
    // Reset game variables before each test
    currentPlayerSpan.textContent = "1";
    turnsLeftSpan.textContent = "3";
    usedLetters.textContent = "Used letters: ";
    player1Score.textContent = "Player 1 score: 0";
    player2Score.textContent = "Player 2 score: 0";
    numberDisplay.textContent = "";
    wordInput.value = "";
    message.textContent = "";
  });

  it("should generate a random number between 1 and 10", () => {
    generateNumberButton.click();
    let number = parseInt(numberDisplay.textContent.split(": ")[1]);
    expect(number).toBeGreaterThanOrEqual(1);
    expect(number).toBeLessThanOrEqual(10);
  });

  it("should switch players correctly", () => {
    expect(currentPlayerSpan.textContent).toBe("1");
    window.switchPlayer();
    expect(currentPlayerSpan.textContent).toBe("2");
    window.switchPlayer();
    expect(currentPlayerSpan.textContent).toBe("1");
  });

  it("should decrement turns after each valid word", () => {
    numberDisplay.textContent = "Number: 2"; // Even number
    wordInput.value = "testing"; // Valid word
    submitWordButton.click();
    expect(turnsLeftSpan.textContent).toBe("3");
  });

  it("should switch players when turns reach 0", () => {
    numberDisplay.textContent = "Number: 2";
    wordInput.value = "testing";

    for (let i = 0; i < 3; i++) {
      submitWordButton.click();
    }

    expect(currentPlayerSpan.textContent).toBe("1");
    expect(turnsLeftSpan.textContent).toBe("3");
  });
});

// Mock the setInterval and clearInterval functions used by the timer
jest.useFakeTimers();
describe("Timer Functionality", () => {
  beforeEach(() => {
    jest.clearAllTimers(); // Clear any running timers before each test
  });

  it("should start the timer when a number is generated", () => {
    const setIntervalSpy = jest.spyOn(window, "setInterval");
    generateNumberButton.click();
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });

  it("should display the correct time left", () => {
    generateNumberButton.click();
    jest.advanceTimersByTime(5000);
    expect(timer.textContent).toBe("Time left: 6");
  });
});
