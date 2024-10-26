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

    if (document.readyState != "loading") done();
    else
      document.addEventListener("DOMContentLoaded", () => {
        done();
      });
  });
});

describe("Word Game Logic", () => {
  beforeEach(() => {
    // Reset game variables before each test
    window.player1Score = 0;
    window.player2Score = 0;
    window.player1TurnsLeft = 3;
    window.player2TurnsLeft = 3;
    window.timeLeft = 10;
    window.player1UsedLetters = [];
    window.player2UsedLetters = [];
    window.currentPlayer = 1;

    // Reset UI elements
    document.getElementById("player1Score").innerText = "Score: 0";
    document.getElementById("player2Score").innerText = "Score: 0";
    document.getElementById("player1Turns").innerText = "Turns Left: 3";
    document.getElementById("player2Turns").innerText = "Turns Left: 3";
    document.getElementById("timer").innerText = "10";
    document.getElementById("player1UsedLetters").innerText = "Used Letters: ";
    document.getElementById("player2UsedLetters").innerText = "Used Letters: ";
    document.getElementById("player1Result").innerText = "";
    document.getElementById("player2Result").innerText = "";
    document.getElementById("player1Word").value = "";
    document.getElementById("player2Word").value = "";
    document.getElementById("player1Number").innerText = "";
    document.getElementById("player2Number").innerText = "";
    document.getElementById("currentPlayer").innerText = "Player 1's Turn";
  });

  it("should start the game for Player 1", () => {
    window.startGame(1);
    expect(document.getElementById("currentPlayer").innerText).toBe(
      "Player 1's Turn"
    );
    expect(
      parseInt(document.getElementById("timer").innerText)
    ).toBeLessThanOrEqual(10);
    expect(document.getElementById("player1Turns").innerText).toBe(
      "Turns Left: 2"
    );
  });

  it("should start the game for Player 2", () => {
    window.startGame(2);
    expect(document.getElementById("currentPlayer").innerText).toBe(
      "Player 2's Turn"
    );
    expect(
      parseInt(document.getElementById("timer").innerText)
    ).toBeLessThanOrEqual(10);
    expect(document.getElementById("player2Turns").innerText).toBe(
      "Turns Left: 2"
    );
  });

  it("should generate a random number and display it for the current Player", () => {
    window.startGame(1);
    let randomNumberElement = document.getElementById("player1Number");
    expect(randomNumberElement.innerText).not.toBe("");
    let randomNumber = parseInt(randomNumberElement.innerText);
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(10);
  });

  it("should correctly update the score and used letters for a correct word (Player 1, even number, word > 7 characters)", () => {
    window.startGame(1);
    document.getElementById("player1Number").innerText = "8"; // Simulate even number
    document.getElementById("player1Word").value = "exampleWord";
    window.checkWord(1);
    expect(document.getElementById("player1Score").innerText).toBe("Score: 1");
    expect(document.getElementById("player1UsedLetters").innerText).toBe(
      "Used Letters: e, d"
    );
  });

  it("should correctly update the score and used letters for a correct word (Player 2, odd number, word < 7 characters)", () => {
    window.startGame(2);
    document.getElementById("player2Number").innerText = "7"; // Simulate odd number
    document.getElementById("player2Word").value = "word";
    window.checkWord(2);
    expect(document.getElementById("player2Score").innerText).toBe("Score: 1");
    expect(document.getElementById("player2UsedLetters").innerText).toBe(
      "Used Letters: w, d"
    );
  });
  it("should not update the score for an incorrect word (Player 1, even number, word < 7 characters)", () => {
    window.startGame(1);
    document.getElementById("player1Number").innerText = "2"; // Simulate even number
    document.getElementById("player1Word").value = "short";
    window.checkWord(1);
    expect(document.getElementById("player1Score").innerText).toBe("Score: 0");
    expect(document.getElementById("player1Result").innerText).toBe(
      "Incorrect!"
    );
  });

  it("should not update the score for an incorrect word (Player 2, odd number, word > 7 characters)", () => {
    window.startGame(2);
    document.getElementById("player2Number").innerText = "9"; // Simulate odd number
    document.getElementById("player2Word").value = "longWordHere";
    window.checkWord(2);
    expect(document.getElementById("player2Score").innerText).toBe("Score: 0");
  });

  it("should not allow using a word starting or ending with a used letter (Player 1)", () => {
    window.startGame(1);
    document.getElementById("player1Number").innerText = "8";
    document.getElementById("player1Word").value = "exampleWord";
    window.checkWord(1); // Use 'e' and 'd'
    document.getElementById("player1Number").innerText = "6";
    document.getElementById("player1Word").value = "dog"; // Starts with 'd'
    window.checkWord(1);
    expect(document.getElementById("player1Score").innerText).toBe("Score: 0");
  });

  it("should not allow using a word starting or ending with a used letter (Player 2)", () => {
    window.startGame(2);
    document.getElementById("player2Number").innerText = "7";
    document.getElementById("player2Word").value = "apple";
    window.checkWord(2); // Use 'a' and 'e'
    document.getElementById("player2Number").innerText = "3";
    document.getElementById("player2Word").value = "eat"; // Ends with 't'
    window.checkWord(2);
    expect(document.getElementById("player2Score").innerText).toBe("Score: 2");
  });

  it("should switch to the next player after a turn", () => {
    window.startGame(1);
    window.checkWord(1);
    expect(document.getElementById("currentPlayer").innerText).toBe(
      "Player 1's Turn"
    );
  });

  it("should correctly handle the timer and switch turns when time runs out", () => {
    jest.useFakeTimers();
    window.startGame(1);
    jest.advanceTimersByTime(10000); // Advance timer by 10 seconds
    expect(document.getElementById("currentPlayer").innerText).toBe(
      "Player 1's Turn"
    );
  });

  it("should end the game after each player has taken 3 turns", () => {
    window.startGame(1);
    window.startGame(2);
    window.checkWord(1);
    window.checkWord(2);
    window.startGame(1);
    window.startGame(2);
    window.checkWord(1);
    window.checkWord(2);
    window.checkWord(1);
    window.checkWord(2);
    expect(document.getElementById("player1Turns").innerText).toBe(
      "Turns Left: 0"
    );
    expect(document.getElementById("player2Turns").innerText).toBe(
      "Turns Left: 0"
    );
  });

  it("should correctly determine the winner when Player 1 has a higher score", () => {
    window.player1Score = 2; // Manually set score for testing
    window.player2Score = 1;
    window.player1TurnsLeft = 0;
    window.player2TurnsLeft = 0;
    window.switchPlayer();
    expect(window.alert).toHaveBeenCalledWith(
      "Player 1 wins with a score of 2!"
    );
  });

  it("should correctly determine the winner when Player 2 has a higher score", () => {
    window.player1Score = 1;
    window.player2Score = 3;
    window.player1TurnsLeft = 0;
    window.player2TurnsLeft = 0;
    window.switchPlayer();
    expect(window.alert).toHaveBeenCalledWith(
      "Player 2 wins with a score of 3!"
    );
  });

  it("should correctly determine a tie when both players have the same score", () => {
    window.player1Score = 2;
    window.player2Score = 2;
    window.player1TurnsLeft = 0;
    window.player2TurnsLeft = 0;
    window.switchPlayer();
    expect(window.alert).toHaveBeenCalledWith(
      "It's a tie with both players scoring 2!"
    );
  });
});
