const gameBoard = document.getElementById("gameBoard");
const movesElement = document.getElementById("moves");
const matchesElement = document.getElementById("matches");
const timeElement = document.getElementById("time");
const messageElement = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

const symbols = [
    "🚀",
    "💻",
    "🎯",
    "⭐",
    "🔥",
    "🧠",
    "📚",
    "🏆"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matches = 0;
let seconds = 0;
let timer = null;
let gameStarted = false;


// ===============================
// SHUFFLE
// ===============================

function shuffle(array) {

    return array.sort(() => Math.random() - 0.5);

}


// ===============================
// START GAME
// ===============================

function startGame() {

    clearInterval(timer);

    cards = shuffle([
        ...symbols,
        ...symbols
    ]);

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    moves = 0;
    matches = 0;
    seconds = 0;
    gameStarted = false;

    movesElement.textContent = "0";
    matchesElement.textContent = "0";
    timeElement.textContent = "00:00";
    messageElement.textContent = "";

    gameBoard.innerHTML = "";

    cards.forEach((symbol, index) => {

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.symbol = symbol;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front">
                    ?
                </div>

                <div class="card-back">
                    ${symbol}
                </div>

            </div>
        `;

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);

    });

}


// ===============================
// TIMER
// ===============================

function startTimer() {

    if (gameStarted) return;

    gameStarted = true;

    timer = setInterval(() => {

        seconds++;

        const minutes =
            Math.floor(seconds / 60);

        const secs =
            seconds % 60;

        timeElement.textContent =
            `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    }, 1000);

}


// ===============================
// FLIP CARD
// ===============================

function flipCard(card) {

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
    ) {
        return;
    }

    startTimer();

    card.classList.add("flipped");

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    moves++;

    movesElement.textContent = moves;

    checkMatch();

}


// ===============================
// CHECK MATCH
// ===============================

function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;

    if (isMatch) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matches++;

        matchesElement.textContent = matches;

        resetCards();

        if (matches === symbols.length) {
            gameWon();
        }

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            resetCards();

        }, 800);

    }

}


// ===============================
// RESET SELECTED CARDS
// ===============================

function resetCards() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;

}


// ===============================
// GAME WON
// ===============================

function gameWon() {

    clearInterval(timer);

    messageElement.textContent =
        `🎉 Congratulations! You completed the game in ${moves} moves and ${timeElement.textContent}.`;

    saveGameCompletion();

}


// ===============================
// SAVE COMPLETION
// ===============================

function saveGameCompletion() {

    try {

        const key = "skillup_memory_match_completed";

        localStorage.setItem(
            key,
            "true"
        );

    } catch (error) {

        console.log(
            "Could not save game progress.",
            error
        );

    }

}


// ===============================
// RESTART
// ===============================

restartBtn.addEventListener(
    "click",
    startGame
);


// ===============================
// INITIAL GAME
// ===============================

startGame();