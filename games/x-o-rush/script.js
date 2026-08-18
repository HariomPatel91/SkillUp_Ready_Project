const cells =
    document.querySelectorAll(".cell");

const turnText =
    document.getElementById("turn");

const message =
    document.getElementById("message");

const restartBtn =
    document.getElementById("restartBtn");

const xScoreText =
    document.getElementById("xScore");

const oScoreText =
    document.getElementById("oScore");


let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let currentPlayer = "X";

let gameActive = true;

let xScore = 0;
let oScore = 0;


const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


cells.forEach(function(cell, index) {

    cell.addEventListener(
        "click",
        function() {

            playMove(index);

        }
    );

});


function playMove(index) {

    if (!gameActive) {
        return;
    }

    if (board[index] !== "") {
        return;
    }

    board[index] =
        currentPlayer;

    cells[index].textContent =
        currentPlayer;

    cells[index].classList.add(
        currentPlayer.toLowerCase()
    );

    checkWinner();

}


function checkWinner() {

    let winnerPattern = null;

    for (
        let pattern of winningPatterns
    ) {

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            winnerPattern =
                pattern;

            break;

        }

    }


    if (winnerPattern) {

        gameActive = false;

        winnerPattern.forEach(
            function(index) {

                cells[index]
                    .classList.add("win");

            }
        );

        if (currentPlayer === "X") {

            xScore++;

            xScoreText.textContent =
                xScore;

        } else {

            oScore++;

            oScoreText.textContent =
                oScore;

        }

        message.textContent =
            `🎉 Player ${currentPlayer} wins!`;

        turnText.textContent =
            "Game Finished";

        return;
    }


    if (!board.includes("")) {

        gameActive = false;

        message.textContent =
            "🤝 It's a Draw!";

        turnText.textContent =
            "Game Finished";

        return;
    }


    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";

    turnText.textContent =
        `Player ${currentPlayer}'s Turn`;

}


function newGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "X";

    gameActive = true;

    turnText.textContent =
        "Player X's Turn";

    message.textContent = "";

    cells.forEach(function(cell) {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "win"
        );

    });

}


restartBtn.addEventListener(
    "click",
    newGame
);


function goBack() {

    window.location.href =
        "../../index.html";

}