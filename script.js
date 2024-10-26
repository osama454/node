// Initialize variables
let currentPlayer = 1;
let turnsLeft = 3;
let usedLetters = [];
let player1Score = 0;
let player2Score = 0;
let timer;
let currentNumber = 0; // Added variable to store current number

// Function to generate random number
function generateNumber() {
  return Math.floor(Math.random() * 10) + 1; // Generates number between 1 and 10
}

// Function to start the timer
function startTimer() {
  let timeLeft = 10;
  timer = setInterval(() => {
    document.getElementById('timer').textContent = "Time left: " + timeLeft;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timer);
      document.getElementById('message').textContent = "Time's up!";
      switchPlayer();
    }
  }, 1000);
}

// Function to switch players
function switchPlayer() {
  currentPlayer = (currentPlayer === 1) ? 2 : 1;
  document.getElementById('current-player').textContent = currentPlayer;
  turnsLeft = 3;
  document.getElementById('turns-left').textContent = turnsLeft;
  clearInterval(timer);
  document.getElementById('number-display').textContent = "";
  document.getElementById('word-input').value = "";
  document.getElementById('message').textContent = "";
  usedLetters = [];
  document.getElementById('used-letters').textContent = "Used letters: "; // Added line to reset used letters display
}

// Function to update score
function updateScore() {
  if (currentPlayer === 1) {
    player1Score++;
    document.getElementById('player1-score').textContent = "Player 1 score: " + player1Score;
  } else {
    player2Score++;
    document.getElementById('player2-score').textContent = "Player 2 score: " + player2Score;
  }
}

// Function to validate the word based on the number
function validateWord(word) { // Added function to validate word
  if (currentNumber % 2 === 0) { // Even number
    if (word.length > 7 && !usedLetters.includes(word[0]) && !usedLetters.includes(word[word.length-1])) {
      return true;
    } else {
      return false;
    }
  } else { // Odd number
    if (word.length < 7 && !usedLetters.includes(word[0]) && !usedLetters.includes(word[word.length-1])) {
      return true;
    } else {
      return false;
    }
  }
}

// Event listeners
document.getElementById('generate-number').addEventListener('click', () => {
  clearInterval(timer);
  startTimer();
  currentNumber = generateNumber(); // Assign generated number to currentNumber
  document.getElementById('number-display').textContent = "Number: " + currentNumber; 
});

document.getElementById('submit-word').addEventListener('click', () => {
  let word = document.getElementById('word-input').value;

  if (validateWord(word)) { // Check if word is valid
    usedLetters.push(word[0]); 
    usedLetters.push(word[word.length-1]);
    document.getElementById('used-letters').textContent = "Used letters: " + usedLetters.join(", ");

    document.getElementById('message').textContent = "Correct!";
    updateScore();

    turnsLeft--;
    document.getElementById('turns-left').textContent = turnsLeft;

    if (turnsLeft === 0) {
      switchPlayer();
    } else {
      document.getElementById('word-input').value = "";
    }

  } else {
    document.getElementById('message').textContent = "Invalid word. Please try again.";
  }
});