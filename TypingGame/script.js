const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const endgameElement = document.getElementById("end-game-container");
const settingsButton = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const upcomingWordsElement = document.getElementById("upcoming-words");
const languageSelect = document.getElementById("language");

// Improved word list with more variety
const words = [
  "code", "function", "algorithm", "variable", "array",
  "object", "string", "number", "boolean", "loop",
  "condition", "module", "interface", "class", "method",
  "parameter", "return", "async", "promise", "callback",
  "event", "listener", "component", "state", "props",
  "render", "virtual", "dom", "framework", "library"
];

// Add Norwegian words
const norwegianWords = [
  "kode", "funksjon", "algoritme", "variabel", "array",
  "objekt", "streng", "nummer", "boolsk", "løkke",
  "betingelse", "modul", "grensesnitt", "klasse", "metode",
  "parameter", "returner", "asynkron", "løfte", "tilbakekall",
  "hendelse", "lytter", "komponent", "tilstand", "props",
  "gjengi", "virtuell", "dom", "rammeverk", "bibliotek"
];

let randomWord;
let score = 0;
let time = 60; // Changed initial time to 60 seconds
// let difficulty = "medium";
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";

let timerStarted = false;
let timeInterval;
let startTime;
let wordCount = 0;
let isGameActive = false;

let wordQueue = [];

let currentLanguage = localStorage.getItem("language") || "english";

function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    timeInterval = setInterval(updateTime, 1000);
  }
}

function getRandomWord() {
  const wordList = currentLanguage === "norwegian" ? norwegianWords : words;
  return wordList[Math.floor(Math.random() * wordList.length)];
}

function initializeWordQueue() {
  wordQueue = Array.from({ length: 4 }, getRandomWord);
}

function addWordToDom() {
  randomWord = wordQueue.shift();
  word.innerText = randomWord;
  wordQueue.push(getRandomWord());
  updateUpcomingWords();
}

function updateUpcomingWords() {
  upcomingWordsElement.innerHTML = wordQueue.slice(0, 3).map(w => `<span>${w}</span>`).join(' ');
}

function updateScore() {
  score++;
  scoreElement.innerText = score;
}

function updateTime() {
  time--;
  timeElement.textContent = `${time}s`;
  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

function updateWPM() {
  const elapsedMinutes = (Date.now() - startTime) / 60000;
  const wpm = Math.round(wordCount / elapsedMinutes);
  scoreElement.innerText = `${wpm} WPM`;
}

function startGame() {
  isGameActive = true;
  startTime = Date.now();
  wordCount = 0;
  score = 0;
  time = 60;
  initializeWordQueue();
  addWordToDom();
  text.value = ''; // Clear the input field
  text.focus();
  timeInterval = setInterval(updateTime, 1000);
}

function gameOver() {
  isGameActive = false;
  clearInterval(timeInterval);
  const finalWPM = Math.round(wordCount / 1);
  endgameElement.innerHTML = `
    <h1>Time's up!</h1>
    <p>Your typing speed: ${finalWPM} WPM</p>
    <button onclick="location.reload()">Play Again</button>
  `;
  endgameElement.style.display = "flex";
}

text.addEventListener("input", (e) => {
  const insertedText = e.target.value.trim().toLowerCase();
  
  if (!isGameActive) {
    startGame();
  }
  
  if (insertedText === randomWord) {
    e.target.value = "";
    wordCount++;
    addWordToDom();
    updateWPM();
  }
});

settingsButton.addEventListener("click", () =>
  settings.classList.toggle("hide")
);
settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});

languageSelect.addEventListener("change", (e) => {
  currentLanguage = e.target.value;
  localStorage.setItem("language", currentLanguage);
  restartGame();
});

function restartGame() {
  clearInterval(timeInterval);
  isGameActive = false;
  startGame();
}

// Update init section
languageSelect.value = currentLanguage;
difficultySelect.value = difficulty;
initializeWordQueue();
addWordToDom();
text.focus();