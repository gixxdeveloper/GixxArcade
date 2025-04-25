const bird = document.getElementById("bird");
const pipeTop = document.getElementById("pipe-top");
const pipeBottom = document.getElementById("pipe-bottom");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

let birdY = 250;
let velocity = 0;
let gravity = 0.6;
let jumpPower = -10;
let isGameOver = false;
let score = 0;
let speed = 2;

// Tubi
let pipeX = 400;
let pipeGap = 220;
let pipeTopHeight = Math.floor(Math.random() * 250) + 50;

pipeTop.style.height = pipeTopHeight + "px";
pipeBottom.style.height = (600 - pipeTopHeight - pipeGap) + "px";

// Funzione per aggiornare la posizione dell'uccello
function updateBird() {
  velocity += gravity;
  birdY += velocity;
  bird.style.top = birdY + "px";
}

// Funzione per aggiornare i tubi
function updatePipes() {
  pipeX -= speed;

  if (pipeX < -60) {
    pipeX = 400;
    pipeTopHeight = Math.floor(Math.random() * 250) + 50;
    pipeTop.style.height = pipeTopHeight + "px";
    pipeBottom.style.height = (600 - pipeTopHeight - pipeGap) + "px";

    score++;
    scoreDisplay.textContent = score;

    // Aumenta la velocità ogni 3 punti
    if (score % 3 === 0 && speed < 12) {
      speed += 0.7;
    }
  }

  pipeTop.style.left = pipeX + "px";
  pipeBottom.style.left = pipeX + "px";
}

// Funzione per verificare collisioni
function checkCollision() {
  const birdWidth = 65;
  const birdHeight = 90;
  const birdX = 100;

  const pipeWidth = 60;
  const pipeTopBottom = pipeTopHeight;
  const pipeBottomTop = pipeTopHeight + pipeGap;

  // Riduciamo la hitbox con padding
  const padding = 27;

  const birdLeft = birdX + padding;
  const birdRight = birdX + birdWidth - padding;
  const birdTop = birdY + padding;
  const birdBottom = birdY + birdHeight - padding;

  const pipeLeft = pipeX;
  const pipeRight = pipeX + pipeWidth;

  if (birdTop < 0 || birdBottom > 600) {
    return true;
  }

  if (
    birdRight > pipeLeft &&
    birdLeft < pipeRight &&
    (birdTop < pipeTopBottom || birdBottom > pipeBottomTop)
  ) {
    return true;
  }

  return false;
}

// Funzione principale del gioco
function gameLoop() {
  if (isGameOver) return;

  updateBird();
  updatePipes();

  if (checkCollision()) {
    isGameOver = true;

    // Salva il record se è maggiore del precedente
    if (score > (localStorage.getItem('recordFlappy') || 0)) {
      localStorage.setItem('recordFlappy', score);
    }

    finalScore.textContent = `Punteggio: ${score}`;
    gameOverDiv.style.display = "block";
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Gestione del tasto spazio per il salto
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (isGameOver) {
      restartGame();
    } else {
      velocity = jumpPower;
    }
  }
});

// Gestione del tocco per dispositivi mobili
document.addEventListener("touchstart", (e) => {
  if (isGameOver) {
    restartGame();
  } else {
    velocity = jumpPower;
  }

  // Previene lo scroll durante il gioco
  e.preventDefault();
});

// Funzione per riavviare il gioco
function restartGame() {
  location.reload();
}

gameLoop();
