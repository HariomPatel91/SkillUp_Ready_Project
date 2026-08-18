const questions = [

    {
        question: "What is the capital of India?",
        answers: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        correct: 1
    },

    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: 1
    },

    {
        question: "How many days are there in a leap year?",
        answers: ["365", "366", "364", "360"],
        correct: 1
    },

    {
        question: "Which is the largest ocean in the world?",
        answers: ["Indian Ocean", "Atlantic Ocean", "Pacific Ocean", "Arctic Ocean"],
        correct: 2
    },

    {
        question: "Who wrote the Indian national anthem?",
        answers: [
            "Rabindranath Tagore",
            "Mahatma Gandhi",
            "Subhash Chandra Bose",
            "Sarojini Naidu"
        ],
        correct: 0
    },

    {
        question: "Which is the largest planet in our Solar System?",
        answers: ["Earth", "Saturn", "Jupiter", "Neptune"],
        correct: 2
    },

    {
        question: "How many continents are there?",
        answers: ["5", "6", "7", "8"],
        correct: 2
    },

    {
        question: "Which gas do plants mainly use for photosynthesis?",
        answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correct: 2
    },

    {
        question: "Which is the national animal of India?",
        answers: ["Lion", "Tiger", "Elephant", "Peacock"],
        correct: 1
    },

    {
        question: "Which is the fastest land animal?",
        answers: ["Lion", "Horse", "Cheetah", "Tiger"],
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

    document.getElementById("nextBtn").disabled =
        true;

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
            "✅ Correct! Great knowledge!";

        document.getElementById("result").style.color =
            "green";

    } else {

        selectedButton.classList.add("wrong");

        buttons[q.correct].classList.add("correct");

        document.getElementById("result").textContent =
            "❌ Wrong answer.";

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