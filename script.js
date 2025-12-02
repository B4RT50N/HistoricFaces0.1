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
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
});

// Daten laden
fetch("data.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("data.json konnte nicht geladen werden: " + res.status);
    }
    return res.json();
  })
  .then((json) => {
    if (!json || !Array.isArray(json.pairs)) {
      throw new Error("Ungültiges Format in data.json");
    }
    data = json.pairs;
    index = 0;
    score = 0;
    loadRound();
  })
  .catch((err) => {
    console.error(err);
    feedback.textContent = "Fehler beim Laden der Daten. Prüfe data.json.";
  });

function loadRound() {
  if (!data || data.length === 0) {
    feedback.textContent = "Keine Daten gefunden.";
    return;
  }
  if (index >= data.length) {
    endGame();
    return;
  }

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
  const correct = item.correct;

  if (choice === correct) {
    feedback.textContent = "✔️ Richtig!";
    feedback.style.color = "#22c55e";
    score++;
  } else {
    feedback.textContent = "❌ Falsch!";
    feedback.style.color = "#ef4444";
  }

  historyInfo.textContent = item.info || "";
  if (item.source) {
    sourceInfo.innerHTML = `<a href="${item.source}" target="_blank" rel="noreferrer">Quelle öffnen</a>`;
  } else {
    sourceInfo.textContent = "";
  }

  btnEqual.disabled = true;
  btnNotEqual.disabled = true;
  nextBtn.disabled = false;

  scoreSpan.textContent = String(score);
  roundSpan.textContent = String(index + 1);
}

btnEqual.addEventListener("click", () => answer("gleich"));
btnNotEqual.addEventListener("click", () => answer("nicht"));

nextBtn.addEventListener("click", () => {
  index++;
  if (index >= data.length) {
    endGame();
  } else {
    loadRound();
  }
});

function endGame() {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  resultMessage.textContent = `Du hast ${score} von ${data.length} richtig!`;

  resultImg.src =
    score >= data.length / 2
      ? "https://upload.wikimedia.org/wikipedia/commons/2/22/Royal_Crowns.jpg"
      : "https://upload.wikimedia.org/wikipedia/commons/f/f1/Broken_mirror.jpg";
  resultImg.alt = "Ergebnisbild";
}

restartBtn.addEventListener("click", () => {
  // komplettes Spiel neu laden
  location.reload();
});

