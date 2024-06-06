const cards = document.querySelectorAll(".card");
const timerDisplay = document.getElementById("timer");
const flipSound = document.getElementById("flipSound");
const winSound = document.getElementById("winSound");
const gameOverSound = document.getElementById("gameOverSound");
const hello = document.getElementById("hello");
const start = document.getElementById("start");
const wrong = document.getElementById("wrong");

let matchCard = 0;
let cardOne, cardTwo;
let disableDeck = false;
let timeLeft = 30;
let timer;
let gameStarted = false;


function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  resetTimer();
  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    } else {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;
}

function endGame() {
  disableDeck = true;
  gameOverSound.play();
  setTimeout(() => {
    alert("Time's up! Game over.");
    resetGame();
  }, 500);
}

function resetGame() {
  matchCard = 0;
  cardOne = cardTwo = null;
  disableDeck = false;
  gameStarted = false;
  resetTimer();
  shuffleCards();
}

function flipCard(e) {
  if (!gameStarted) {
    startGame();
  }

  let clickedCard = e.target.closest(".card");
  if (
    !clickedCard ||
    clickedCard === cardOne ||
    disableDeck ||
    clickedCard.classList.contains("flip")
  )
    return;

  clickedCard.classList.add("flip");

  if (!cardOne) {
    cardOne = clickedCard;
    return;
  }

  cardTwo = clickedCard;
  disableDeck = true;
  let cardOneImg = cardOne.querySelector(".backImg").src,
    cardTwoImg = cardTwo.querySelector(".backImg").src;

  matchCards(cardOneImg, cardTwoImg);
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchCard++;
    setTimeout(() => {
      flipSound.play();
    }, 400);

    if (matchCard === 6) {
      clearInterval(timer);
      setTimeout(() => {
        winSound.play();
        alert("Congratulations! You've matched all cards!");
        resetGame();
      }, 500);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    resetCards();
    disableDeck = false;
  } else {
    setTimeout(() => {
      wrong.play();
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      resetCards();
      disableDeck = false;
    }, 1200);
  }
}

function resetCards() {
  cardOne = cardTwo = null;
}

function shuffleCards() {
  matchCard = 0;
  resetCards();
  disableDeck = false;

  let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".backImg");
    imgTag.src = `img/m${arr[index]}.png`;
    card.addEventListener("click", flipCard);
  });
}

cards.forEach((card) => card.addEventListener("click", flipCard));
shuffleCards();
