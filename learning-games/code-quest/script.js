const questions = [

    {
        question: "Which language is mainly used to structure a web page?",
        answers: ["HTML", "CSS", "Python", "Java"],
        correct: 0
    },

    {
        question: "Which language is used to style HTML pages?",
        answers: ["JavaScript", "CSS", "C++", "SQL"],
        correct: 1
    },

    {
        question: "Which language adds interactivity to web pages?",
        answers: ["HTML", "CSS", "JavaScript", "C"],
        correct: 2
    },

    {
        question: "Which symbol is used for a single-line comment in JavaScript?",
        answers: ["//", "##", "<!--", "**"],
        correct: 0
    },

    {
        question: "Which keyword is commonly used to declare a variable in JavaScript?",
        answers: ["var", "int", "string", "define"],
        correct: 0
    },

    {
        question: "Which function displays output in Python?",
        answers: ["printf()", "print()", "cout", "display()"],
        correct: 1
    },

    {
        question: "Which function is the starting point of a C program?",
        answers: ["start()", "main()", "run()", "begin()"],
        correct: 1
    },

    {
        question: "Which keyword creates a class in Java?",
        answers: ["object", "class", "new", "struct"],
        correct: 1
    },

    {
        question: "Which operator is used for equality comparison in many languages?",
        answers: ["=", "==", "+=", "!="],
        correct: 1
    },

    {
        question: "Which data structure stores key-value pairs?",
        answers: ["Array", "Map", "Stack", "Queue"],
        correct: 1
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
            "✅ Correct! Excellent!";

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