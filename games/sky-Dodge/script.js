const gameArea =
    document.getElementById("gameArea");

const player =
    document.getElementById("player");

const scoreText =
    document.getElementById("score");

const bestText =
    document.getElementById("best");

const message =
    document.getElementById("message");

const startBtn =
    document.getElementById("startBtn");


let playerX = 50;

let score = 0;

let bestScore =
    Number(
        localStorage.getItem(
            "skillupSkyDodgeBest"
        )
    ) || 0;

let gameRunning = false;

let gameTimer = null;

let obstacleTimer = null;

let obstacles = [];

let speed = 3;


bestText.textContent =
    bestScore;


function startGame() {

    clearInterval(gameTimer);
    clearInterval(obstacleTimer);

    obstacles.forEach(function(obstacle) {

        obstacle.remove();

    });

    obstacles = [];

    score = 0;

    speed = 3;

    playerX = 50;

    gameRunning = true;

    scoreText.textContent = score;

    message.textContent =
        "⬅️ ➡️ Dodge the obstacles!";

    startBtn.textContent =
        "🔄 Restart Game";

    updatePlayer();


    gameTimer =
        setInterval(updateGame, 20);


    obstacleTimer =
        setInterval(createObstacle, 900);
}


function updatePlayer() {

    player.style.left =
        playerX + "%";

}


function moveLeft() {

    if (!gameRunning) {
        return;
    }

    playerX -= 5;

    if (playerX < 7) {
        playerX = 7;
    }

    updatePlayer();

}


function moveRight() {

    if (!gameRunning) {
        return;
    }

    playerX += 5;

    if (playerX > 93) {
        playerX = 93;
    }

    updatePlayer();

}


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }

        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            moveRight();

        }

    }
);


function createObstacle() {

    if (!gameRunning) {
        return;
    }

    const obstacle =
        document.createElement("div");

    obstacle.className =
        "obstacle";

    obstacle.textContent =
        "☁️";

    const randomLeft =
        Math.random() * 88 + 3;

    obstacle.style.left =
        randomLeft + "%";

    obstacle.style.top =
        "-50px";

    gameArea.appendChild(obstacle);

    obstacles.push(obstacle);

}


function updateGame() {

    if (!gameRunning) {
        return;
    }

    const gameRect =
        gameArea.getBoundingClientRect();

    const playerRect =
        player.getBoundingClientRect();


    obstacles.forEach(
        function(obstacle, index) {

            let top =
                parseFloat(
                    obstacle.style.top
                );

            top += speed;

            obstacle.style.top =
                top + "px";


            const obstacleRect =
                obstacle.getBoundingClientRect();


            if (
                playerRect.left <
                    obstacleRect.right &&
                playerRect.right >
                    obstacleRect.left &&
                playerRect.top <
                    obstacleRect.bottom &&
                playerRect.bottom >
                    obstacleRect.top
            ) {

                endGame();

                return;

            }


            if (
                top >
                gameRect.height
            ) {

                obstacle.remove();

                obstacles.splice(
                    index,
                    1
                );

                score++;

                scoreText.textContent =
                    score;


                if (
                    score > bestScore
                ) {

                    bestScore =
                        score;

                    bestText.textContent =
                        bestScore;

                    localStorage.setItem(
                        "skillupSkyDodgeBest",
                        bestScore
                    );

                }


                if (
                    score % 10 === 0
                ) {

                    speed += 0.5;

                }

            }

        }
    );

}


function endGame() {

    if (!gameRunning) {
        return;
    }

    gameRunning = false;

    clearInterval(gameTimer);
    clearInterval(obstacleTimer);

    message.textContent =
        `💥 Game Over! Your score: ${score}`;

    startBtn.textContent =
        "▶️ Play Again";

}


startBtn.addEventListener(
    "click",
    startGame
);


function goBack() {

    window.location.href =
        "../../index.html";

}