let data = [];
let index = 0;
let score = 0;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const paintingImg = document.getElementById("paintingImg");
const photoImg = document.getElementById("photoImg");
const pairLabel = document.getElementById("pairLabel");

const btnEqual = document.getElementById("btnEqual");
const btnNotEqual = document.getElementById("btnNotEqual");
const nextBtn = document.getElementById("nextBtn");

const feedback = document.getElementById("feedback");
const historyInfo = document.getElementById("historyInfo");
const sourceInfo = document.getElementById("sourceInfo");

const scoreSpan = document.getElementById("score");
const roundSpan = document.getElementById("round");

const resultImg = document.getElementById("resultImg");
const resultMessage = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

document.getElementById("startBtn").onclick = () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
};

fetch("data.json")
  .then(res => res.json())
  .then(j => {
    data = j.pairs;
    loadRound();
  });

function loadRound() {
  const item = data[index];
  paintingImg.src = item.painting;
  photoImg.src = item.photo;
  pairLabel.textContent = item.label;
  feedback.textContent = "";
  historyInfo.textContent = "";
  sourceInfo.textContent = "";
  nextBtn.disabled = true;
  btnEqual.disabled = false;
  btnNotEqual.disabled = false;
}

function answer(choice) {
  const item = data[index];
  if (choice === item.correct) {
    feedback.textContent = "✔️ Richtig!";
    score++;
  } else {
    feedback.textContent = "❌ Falsch!";
  }

  historyInfo.textContent = item.info;
  sourceInfo.innerHTML = `<a href="${item.source}" target="_blank">Quelle</a>`;

  btnEqual.disabled = true;
  btnNotEqual.disabled = true;
  nextBtn.disabled = false;

  scoreSpan.textContent = score;
  roundSpan.textContent = index + 1;
}

btnEqual.onclick = () => answer("gleich");
btnNotEqual.onclick = () => answer("nicht");

nextBtn.onclick = () => {
  index++;
  if (index >= data.length) {
    endGame();
  } else loadRound();
};

function endGame() {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  resultMessage.textContent = `Du hast ${score} von ${data.length} richtig!`;

  // Ergebnisbild
  resultImg.src = score >= data.length / 2
    ? "https://upload.wikimedia.org/wikipedia/commons/2/22/Royal_Crowns.jpg"
    : "https://upload.wikimedia.org/wikipedia/commons/f/f1/Broken_mirror.jpg";
}

restartBtn.onclick = () => {
  location.reload();
};
