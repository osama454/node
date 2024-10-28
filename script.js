let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1TurnsLeft = 3;
let player2TurnsLeft = 3;
let timerInterval;
let timeLeft = 10;
let player1UsedLetters = [];
let player2UsedLetters = [];

function startGame(player) {
  if (
    (player === 1 && player1TurnsLeft <= 0) ||
    (player === 2 && player2TurnsLeft <= 0)
  ) {
    alert(`Player ${player} has no turns left.`); // Alert when no turns left for the player
    return;
  }

  currentPlayer = player; // Set current player
  timeLeft = 10;
  document.getElementById("timer").innerText = timeLeft;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000); // Starts the countdown timer

  let randomNumber = Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
  document.getElementById(`player${player}Number`).innerText = randomNumber; // Display the generated number

  if (player === 1) {
    player1TurnsLeft--; // Decrement Player 1's turns left
    document.getElementById(
      "player1Turns"
    ).innerText = `Turns Left: ${player1TurnsLeft}`;
  } else {
    player2TurnsLeft--; // Decrement Player 2's turns left
    document.getElementById(
      "player2Turns"
    ).innerText = `Turns Left: ${player2TurnsLeft}`;
  }

  document.getElementById(
    "currentPlayer"
  ).innerText = `Player ${player}'s Turn`; // Display current player's turn
}

function updateTimer() {
  timeLeft--; // Decrease time by one second
  document.getElementById("timer").innerText = timeLeft; // Update timer display
  if (timeLeft <= 0) {
    clearInterval(timerInterval); // Stop timer when time runs out
    alert(`Time's up! Player ${currentPlayer} loses this turn.`); // Alert when time is up
    switchPlayer(); // Switch to the other player
  }
}

function checkWord(player) {
  let word = document.getElementById(`player${player}Word`).value.toLowerCase(); // Get and lowercase the word
  let randomNumber = parseInt(
    document.getElementById(`player${player}Number`).innerText
  ); // Retrieve generated number
  let usedLetters = player === 1 ? player1UsedLetters : player2UsedLetters; // Get used letters for the player

  if (
    usedLetters.includes(word[0]) ||
    usedLetters.includes(word[word.length - 1])
  ) {
    alert("You cannot use a letter that has been used before."); // Alert when word has used letters
    return;
  }

  if (
    (randomNumber % 2 === 0 && word.length > 7) ||
    (randomNumber % 2 !== 0 && word.length < 7)
  ) {
    if (
      !usedLetters.includes(word[0]) &&
      !usedLetters.includes(word[word.length - 1])
    ) {
      document.getElementById(`player${player}Result`).innerText = "Correct!"; // Correct word feedback
      if (player === 1) {
        player1Score++; // Increment Player 1's score
        document.getElementById(
          "player1Score"
        ).innerText = `Score: ${player1Score}`;
      } else {
        player2Score++; // Increment Player 2's score
        document.getElementById(
          "player2Score"
        ).innerText = `Score: ${player2Score}`;
      }
      usedLetters.push(word[0], word[word.length - 1]); // Add letters to used list
      document.getElementById(
        `player${player}UsedLetters`
      ).innerText = `Used Letters: ${usedLetters.join(", ")}`;
    } else {
      document.getElementById(`player${player}Result`).innerText = "Incorrect!"; // Incorrect feedback
    }
  } else {
    document.getElementById(`player${player}Result`).innerText = "Incorrect!"; // Incorrect feedback
  }

  switchPlayer(); // Switch to the next player
}

function switchPlayer() {
  document.getElementById(`player${currentPlayer}Word`).value = ""; // Clear current player’s word input
  document.getElementById(`player${currentPlayer}Number`).innerText = ""; // Clear displayed number

  setTimeout(() => {
    document.getElementById(`player${currentPlayer}Result`).innerText = ""; // Clear result after delay
  }, 1500); 

  if (player1TurnsLeft <= 0 && player2TurnsLeft <= 0) {
    clearInterval(timerInterval); // Stop timer if no turns left
    determineWinner(); // Determine the winner
    return;
  }

  if (currentPlayer === 1 && player1TurnsLeft > 0) {
    if (player2TurnsLeft > 0) {
      startGame(1); // Start game for Player 1 if they have turns left
    } else {
      currentPlayer = 2; // Switch to Player 2
      startGame(2);
    }
  } else if (currentPlayer === 2 && player2TurnsLeft > 0) {
    startGame(2); // Start game for Player 2 if they have turns left
  } else {
    currentPlayer = 1; // Switch to Player 1
    startGame(1);
  }
}

function determineWinner() {
  if (player1Score > player2Score) {
    alert(`Player 1 wins with a score of ${player1Score}!`); // Alert Player 1 win message
  } else if (player2Score > player1Score) {
    alert(`Player 2 wins with a score of ${player2Score}!`); // Alert Player 2 win message
  } else {
    alert(`It's a tie with both players scoring ${player1Score}!`); // Alert tie message
  }
}
