const questions = [

    {
        question: "What comes next? 2, 4, 6, 8, ?",
        answers: ["9", "10", "11", "12"],
        correct: 1
    },

    {
        question: "Which number is different?",
        answers: ["2", "4", "7", "8"],
        correct: 2
    },

    {
        question: "If all cats are animals, then a cat is a...",
        answers: ["Plant", "Animal", "Machine", "Building"],
        correct: 1
    },

    {
        question: "What comes next? 5, 10, 15, 20, ?",
        answers: ["21", "22", "25", "30"],
        correct: 2
    },

    {
        question: "Which shape has 3 sides?",
        answers: ["Circle", "Square", "Triangle", "Rectangle"],
        correct: 2
    },

    {
        question: "What is 12 + 8?",
        answers: ["18", "20", "22", "24"],
        correct: 1
    },

    {
        question: "Which word does NOT belong?",
        answers: ["Apple", "Mango", "Carrot", "Banana"],
        correct: 2
    },

    {
        question: "If today is Monday, what day comes after 2 days?",
        answers: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        correct: 1
    },

    {
        question: "What is half of 20?",
        answers: ["5", "8", "10", "12"],
        correct: 2
    },

    {
        question: "Which number is the largest?",
        answers: ["15", "25", "35", "30"],
        correct: 2
    }

];

let currentQuestion = 0;
let score = 0;
let answered = false;

function loadQuestion() {

    const q = questions[currentQuestion];

    answered = false;

    document.getElementById("questionNumber").textContent =
        currentQuestion + 1;

    document.getElementById("question").textContent =
        q.question;

    document.getElementById("result").textContent = "";

    const answers =
        document.getElementById("answers");

    answers.innerHTML = "";

    const nextBtn =
        document.getElementById("nextBtn");

    nextBtn.disabled = true;

    q.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className = "answer-btn";

        button.textContent = answer;

        button.onclick = function () {

            checkAnswer(index, button);

        };

        answers.appendChild(button);

    });

}

function checkAnswer(index, selectedButton) {

    if (answered) {
        return;
    }

    answered = true;

    const q = questions[currentQuestion];

    const buttons =
        document.querySelectorAll(".answer-btn");

    if (index === q.correct) {

        score++;

        selectedButton.classList.add("correct");

        document.getElementById("result").textContent =
            "✅ Correct! Great job!";

        document.getElementById("result").style.color =
            "green";

    } else {

        selectedButton.classList.add("wrong");

        buttons[q.correct].classList.add("correct");

        document.getElementById("result").textContent =
            "❌ Wrong answer. The correct answer is highlighted.";

        document.getElementById("result").style.color =
            "red";
    }

    document.getElementById("score").textContent =
        score;

    document.getElementById("nextBtn").disabled =
        false;

}

function nextQuestion() {

    if (!answered) {
        return;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        finishGame();

    }

}

function finishGame() {

    document.querySelector(".game-card")
        .classList.add("hidden");

    document.querySelector(".top-bar")
        .classList.add("hidden");

    document.getElementById("finalScreen")
        .classList.remove("hidden");

    document.getElementById("finalScore").textContent =
        `Your Score: ${score} / ${questions.length}`;

}

function restartGame() {

    currentQuestion = 0;
    score = 0;

    document.getElementById("score").textContent =
        "0";

    document.querySelector(".game-card")
        .classList.remove("hidden");

    document.querySelector(".top-bar")
        .classList.remove("hidden");

    document.getElementById("finalScreen")
        .classList.add("hidden");

    loadQuestion();

}

function goBack() {

    window.location.href = "../../index.html";

}

loadQuestion();