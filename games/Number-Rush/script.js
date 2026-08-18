const questions = [
    {
        question: "5 + 7 = ?",
        answers: ["10", "12", "13", "14"],
        correct: 1
    },

    {
        question: "15 - 6 = ?",
        answers: ["7", "8", "9", "10"],
        correct: 2
    },

    {
        question: "6 × 4 = ?",
        answers: ["20", "22", "24", "26"],
        correct: 2
    },

    {
        question: "36 ÷ 6 = ?",
        answers: ["4", "5", "6", "7"],
        correct: 2
    },

    {
        question: "9 + 8 = ?",
        answers: ["15", "16", "17", "18"],
        correct: 2
    },

    {
        question: "20 - 13 = ?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        question: "7 × 3 = ?",
        answers: ["18", "20", "21", "24"],
        correct: 2
    },

    {
        question: "48 ÷ 8 = ?",
        answers: ["5", "6", "7", "8"],
        correct: 1
    },

    {
        question: "12 + 15 = ?",
        answers: ["25", "26", "27", "28"],
        correct: 2
    },

    {
        question: "50 - 22 = ?",
        answers: ["26", "27", "28", "29"],
        correct: 2
    }
];


let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer = null;
let gameOver = false;


const questionElement =
    document.getElementById("question");

const answersElement =
    document.getElementById("answers");

const scoreElement =
    document.getElementById("score");

const questionNumberElement =
    document.getElementById("questionNumber");

const timerElement =
    document.getElementById("timer");

const messageElement =
    document.getElementById("message");

const restartButton =
    document.getElementById("restartBtn");


function startGame() {

    clearInterval(timer);

    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    gameOver = false;

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    messageElement.textContent = "";

    showQuestion();

    timer = setInterval(function () {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {

            endGame();

        }

    }, 1000);
}


function showQuestion() {

    if (currentQuestion >= questions.length) {

        endGame();

        return;
    }

    const question =
        questions[currentQuestion];

    questionElement.textContent =
        question.question;

    questionNumberElement.textContent =
        currentQuestion + 1;

    answersElement.innerHTML = "";

    question.answers.forEach(
        function(answer, index) {

            const button =
                document.createElement("button");

            button.className =
                "answer-btn";

            button.textContent =
                answer;

            button.onclick =
                function() {

                    checkAnswer(
                        index,
                        button
                    );

                };

            answersElement.appendChild(button);
        }
    );
}


function checkAnswer(index, button) {

    if (gameOver) {
        return;
    }

    const correctAnswer =
        questions[currentQuestion].correct;

    const allButtons =
        document.querySelectorAll(".answer-btn");

    allButtons.forEach(function(btn) {

        btn.disabled = true;

    });


    if (index === correctAnswer) {

        score++;

        scoreElement.textContent =
            score;

        button.classList.add("correct");

        messageElement.textContent =
            "✅ Correct!";

    } else {

        button.classList.add("wrong");

        allButtons[
            correctAnswer
        ].classList.add("correct");

        messageElement.textContent =
            "❌ Wrong answer!";
    }


    setTimeout(function() {

        currentQuestion++;

        messageElement.textContent = "";

        showQuestion();

    }, 600);
}


function endGame() {

    if (gameOver) {
        return;
    }

    gameOver = true;

    clearInterval(timer);

    questionElement.textContent =
        "🏆 Game Over!";

    answersElement.innerHTML = "";

    questionNumberElement.textContent =
        questions.length;

    messageElement.textContent =
        `Your final score is ${score}/${questions.length}`;

}


restartButton.addEventListener(
    "click",
    startGame
);


function goBack() {

    window.location.href =
        "../../index.html";

}


startGame();