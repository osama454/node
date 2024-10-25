const { JSDOM } = require("jsdom");

const options = {
  resources: "usable",
  runScripts: "dangerously",
};

let window, document;
let startGame, checkWord, switchPlayer, determineWinner;
let player1Score, player2Score, player1TurnsLeft, player2TurnsLeft;

beforeAll((done) => {
  JSDOM.fromFile("index.html", options).then((dom) => {
    window = dom.window;
    document = window.document;

    if (document.readyState !== "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });

    // Import functions from the script
    startGame = window.startGame;
    checkWord = window.checkWord;
    switchPlayer = window.switchPlayer;
    determineWinner = window.determineWinner;

    // Initialize variables
    player1Score = window.player1Score;
    player2Score = window.player2Score;
    player1TurnsLeft = window.player1TurnsLeft;
    player2TurnsLeft = window.player2TurnsLeft;
  });
});

describe("Word Game", () => {
  beforeEach(() => {
    // Reset scores and turns
    window.player1Score = 0;
    window.player2Score = 0;
    window.player1TurnsLeft = 3;
    window.player2TurnsLeft = 3;
  });

  test("should generate a number and start a 10-second timer when startGame is called", () => {
    startGame(1);
    const playerNumber = document.getElementById("player1Number").innerText;
    const timer = parseInt(document.getElementById("timer").innerText);

    expect(playerNumber).toBeTruthy();
    expect(timer).toBe(10);
  });

  test("should reduce turns left and switch player after each valid attempt", () => {
    startGame(1);
    const initialTurns = player1TurnsLeft;
    checkWord(1);
    expect(window.player1TurnsLeft).toBe(initialTurns - 2);

    switchPlayer();
    expect(document.getElementById("currentPlayer").innerText).toBe("Player 2's Turn");
  });

  test("should correctly update score and used letters for even-numbered input with valid word", () => {
    startGame(1);
    document.getElementById("player1Number").innerText = "2";
    document.getElementById("player1Word").value = "elephant"; // > 7 characters

    checkWord(1);

    expect(window.player1Score).toBe(1);
    expect(document.getElementById("player1Score").innerText).toBe("Score: 1");
    expect(document.getElementById("player1UsedLetters").innerText).toContain("e, t");
  });

  test("should restrict words with letters used in previous rounds", () => {
    startGame(1);
    document.getElementById("player1Number").innerText = "2";
    document.getElementById("player1Word").value = "elephant";
    checkWord(1); // Adds "e" and "t" to used letters

    document.getElementById("player1Word").value = "emulate"; // Starts with "e", which was used
    checkWord(1);
    expect(document.getElementById("player1Result").innerText).toBe("Incorrect!");
  });

  test("should prevent words with odd-numbered input if word length is not less than 7", () => {
    startGame(1);
    document.getElementById("player1Number").innerText = "3";
    document.getElementById("player1Word").value = "hello";

    checkWord(1);

    expect(document.getElementById("player1Result").innerText).toBe("Correct!");
  });

  test("should alert the winner or if it's a tie after all turns are taken", () => {
    window.player1Score = 3;
    window.player2Score = 2;
    player1TurnsLeft = 0;
    player2TurnsLeft = 0;

    determineWinner();

    expect(window.alert).toHaveBeenCalledWith("Player 1 wins with a score of 3!");
  });

  test("should end the game and announce a tie if both players have the same score", () => {
    window.player1Score = 2;
    window.player2Score = 2;
    player1TurnsLeft = 0;
    player2TurnsLeft = 0;

    determineWinner();

    expect(window.alert).toHaveBeenCalledWith("It's a tie with both players scoring 2!");
  });

  test("should reduce time and alert 'Time's up!' if timer reaches zero", () => {
    jest.useFakeTimers();
    startGame(1);
    jest.advanceTimersByTime(10000);

    expect(document.getElementById("timer").innerText).toBe("0");
    expect(window.alert).toHaveBeenCalledWith("Time's up! Player 1 loses this turn.");
    jest.useRealTimers();
  });
});
