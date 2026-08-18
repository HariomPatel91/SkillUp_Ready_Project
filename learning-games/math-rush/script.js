const emojis = [
    "🍎", "🍎",
    "🚀", "🚀",
    "⭐", "⭐",
    "🎯", "🎯",
    "💻", "💻",
    "🔥", "🔥",
    "🎮", "🎮",
    "🏆", "🏆"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let locked = false;

let moves = 0;
let matches = 0;

const gameBoard = document.getElementById("gameBoard");
const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");


function shuffle(array) {

    return array.sort(() => Math.random() - 0.5);

}


function startGame() {

    cards = shuffle([...emojis]);

    firstCard = null;
    secondCard = null;
    locked = false;

    moves = 0;
    matches = 0;

    movesText.textContent = moves;
    matchesText.textContent = matches;

    message.textContent = "";

    gameBoard.innerHTML = "";

    cards.forEach((emoji, index) => {

        const card = document.createElement("button");

        card.className = "card";

        card.dataset.value = emoji;
        card.dataset.index = index;

        card.textContent = "❓";

        card.addEventListener("click", function () {

            flipCard(card);

        });

        gameBoard.appendChild(card);

    });

}


function flipCard(card) {

    if (locked) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }

    card.classList.add("flipped");

    card.textContent = card.dataset.value;

    if (!firstCard) {

        firstCard = card;

        return;
    }

    secondCard = card;

    moves++;

    movesText.textContent = moves;

    checkMatch();

}


function checkMatch() {

    const isMatch =
        firstCard.dataset.value ===
        secondCard.dataset.value;

    if (isMatch) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matches++;

        matchesText.textContent = matches;

        resetTurn();

        if (matches === emojis.length / 2) {

            message.textContent =
                `🎉 Congratulations! You completed the game in ${moves} moves!`;

        }

    } else {

        locked = true;

        setTimeout(function () {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.textContent = "❓";
            secondCard.textContent = "❓";

            resetTurn();

        }, 800);

    }

}


function resetTurn() {

    firstCard = null;
    secondCard = null;
    locked = false;

}


restartBtn.addEventListener("click", startGame);


function goBack() {

    window.location.href = "../../index.html";

}


startGame();