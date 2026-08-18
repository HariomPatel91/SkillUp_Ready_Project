// =====================================================
// SKILLUP - FIREBASE + MAIN JAVASCRIPT
// =====================================================

// =====================================================
// FIREBASE
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyAGRiax1lT6WFBGAIWu36DxnqYvGXImvpw",
    authDomain: "skillup-c8b46.firebaseapp.com",
    projectId: "skillup-c8b46",
    storageBucket: "skillup-c8b46.firebasestorage.app",
    messagingSenderId: "603510096467",
    appId: "1:603510096467:web:c36ea0ebb461f013dd7ca6",
    measurementId: "G-SGXQB1BXW7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// =====================================================
// HELPER
// =====================================================

function el(id) {
    return document.getElementById(id);
}


// =====================================================
// LOGIN / ACCOUNT
// =====================================================

window.showCreateAccount = function () {
    el("loginPage").classList.add("hidden");
    el("createAccountPage").classList.remove("hidden");
};

window.showLogin = function () {
    el("createAccountPage").classList.add("hidden");
    el("loginPage").classList.remove("hidden");
};


window.createAccount = async function () {

    const name = el("signupName").value.trim();
    const email = el("signupEmail").value.trim();
    const password = el("signupPassword").value;
    const message = el("signupMessage");

    if (!name || !email || !password) {
        message.textContent = "Please fill all fields.";
        message.style.color = "red";
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "Password must be at least 6 characters.";
        message.style.color = "red";
        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateProfile(userCredential.user, {
            displayName: name
        });

        message.textContent =
            "✅ Account created successfully!";

        message.style.color = "green";

        setTimeout(showLogin, 700);

    } catch (error) {

        message.textContent =
            error.code === "auth/email-already-in-use"
                ? "This email is already registered."
                : error.message;

        message.style.color = "red";
    }
};


window.login = async function () {

    const email = el("loginEmail").value.trim();
    const password = el("loginPassword").value;
    const message = el("loginMessage");

    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        message.style.color = "red";
        return;
    }

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        openApp(userCredential.user);

    } catch (error) {

        message.textContent =
            "❌ Wrong email or password.";

        message.style.color = "red";
    }
};


function openApp(user) {

    el("loginPage").classList.add("hidden");
    el("createAccountPage").classList.add("hidden");
    el("appPage").classList.remove("hidden");

    el("welcomeUser").textContent =
        "Welcome " +
        (user.displayName || "User") +
        " 👋";

    generateReferralCode(user.email);

    showSection("home");

    renderAll();
}


window.logout = async function () {

    await signOut(auth);

    el("appPage").classList.add("hidden");
    el("loginPage").classList.remove("hidden");
};


onAuthStateChanged(auth, function (user) {

    if (user) {
        openApp(user);
    }
});


// =====================================================
// SECTION NAVIGATION
// =====================================================

window.showSection = function (name) {

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.add("hidden");
        });

    const section = el(name);

    if (section) {
        section.classList.remove("hidden");
    }

    if (name === "quiz") {
        renderQuizHistory();
    }

    if (name === "learning") {
        renderLearning();
        resetEnglishAssessment();
    }

    if (name === "games") {
        renderGames();
    }
};


// =====================================================
// LOCAL STORAGE
// =====================================================

function key() {

    return "skillup_" +
        (auth.currentUser?.uid || "guest");
}


function load() {

    try {

        const saved =
            JSON.parse(localStorage.getItem(key()));

        if (saved) {

            // पुराने data में missing fields भी ठीक करेंगे

            saved.level =
                saved.level || "Beginner";

            saved.englishScore =
                saved.englishScore || 0;

            saved.daily =
                saved.daily || {};

            saved.quizHistory =
                saved.quizHistory || [];

            saved.learningHistory =
                saved.learningHistory || [];

            saved.games =
                saved.games || [];

            return saved;
        }

    } catch (error) {

        console.log("Storage error:", error);
    }


    return {
        level: "Beginner",
        englishScore: 0,
        daily: {},
        quizHistory: [],
        learningHistory: [],
        games: []
    };
}


function save(data) {

    localStorage.setItem(
        key(),
        JSON.stringify(data)
    );
}


function renderAll() {

    renderLearning();
    renderQuizHistory();
    renderGames();
}


// =====================================================
// ENGLISH LEARNING
// अलग English Learning System
// =====================================================


// ---------- ENGLISH LEVEL TEST ----------

const englishAssessmentQuestions = [

    {
        q: "Choose the correct sentence.",
        a: [
            "She go to school.",
            "She goes to school.",
            "She going school.",
            "She gone school."
        ],
        c: 1
    },

    {
        q: "What is the opposite of 'easy'?",
        a: [
            "simple",
            "hard",
            "soft",
            "small"
        ],
        c: 1
    },

    {
        q: "Choose the correct word: I ___ a student.",
        a: [
            "am",
            "is",
            "are",
            "be"
        ],
        c: 0
    },

    {
        q: "Which word is a noun?",
        a: [
            "quickly",
            "beautiful",
            "teacher",
            "run"
        ],
        c: 2
    },

    {
        q: "Choose the correct past tense: Yesterday I ___ home.",
        a: [
            "go",
            "goes",
            "went",
            "going"
        ],
        c: 2
    },

    {
        q: "Which sentence is correct?",
        a: [
            "I have finished my work.",
            "I has finished my work.",
            "I finished have work.",
            "I have finish my work."
        ],
        c: 0
    },

    {
        q: "Choose the best word: She has been studying ___ two hours.",
        a: [
            "since",
            "for",
            "at",
            "on"
        ],
        c: 1
    },

    {
        q: "What does 'improve' mean?",
        a: [
            "to get better",
            "to stop",
            "to forget",
            "to sleep"
        ],
        c: 0
    },

    {
        q: "Choose the correct sentence.",
        a: [
            "If I will study, I pass.",
            "If I study, I will pass.",
            "If I studied, I pass will.",
            "If study I passed."
        ],
        c: 1
    }

];


let eaIndex = 0;
let eaScore = 0;
let eaAnswered = false;


// =====================================================
// START ENGLISH LEVEL TEST
// =====================================================

window.startEnglishAssessment = function () {

    eaIndex = 0;
    eaScore = 0;
    eaAnswered = false;

    const assessment =
        el("englishAssessment");

    const lesson =
        el("englishLesson");

    if (!assessment) {
        console.error(
            "englishAssessment element not found."
        );
        return;
    }

    assessment.classList.remove("hidden");

    if (lesson) {
        lesson.classList.add("hidden");
    }

    showEnglishAssessment();
};


// =====================================================
// SHOW ENGLISH QUESTION
// =====================================================

function showEnglishAssessment() {

    const q =
        englishAssessmentQuestions[eaIndex];

    const number =
        el("englishAssessmentNumber");

    const question =
        el("englishAssessmentQuestion");

    const answers =
        el("englishAssessmentAnswers");

    const result =
        el("englishAssessmentResult");


    if (!q) {
        finishEnglishAssessment();
        return;
    }


    number.textContent =
        `Question ${eaIndex + 1} / ${englishAssessmentQuestions.length}`;

    question.textContent = q.q;

    result.textContent = "";

    answers.innerHTML = "";

    eaAnswered = false;


    q.a.forEach(function (option, index) {

        const button =
            document.createElement("button");

        button.className = "quiz-answer";

        button.textContent = option;


        button.onclick = function () {

            if (eaAnswered) {
                return;
            }

            eaAnswered = true;


            if (index === q.c) {

                eaScore++;

                button.textContent =
                    option + " ✅";

                result.textContent =
                    "Correct! 🎉";

                result.style.color = "green";

            } else {

                button.textContent =
                    option + " ❌";

                result.textContent =
                    "Wrong Answer. Try the next one.";

                result.style.color = "red";
            }
        };


        answers.appendChild(button);

    });

}


// =====================================================
// NEXT ENGLISH QUESTION
// =====================================================

window.nextEnglishAssessment = function () {

    if (!eaAnswered) {

        alert(
            "Please select an answer first."
        );

        return;
    }


    eaIndex++;


    if (
        eaIndex <
        englishAssessmentQuestions.length
    ) {

        showEnglishAssessment();

    } else {

        finishEnglishAssessment();
    }
};


// =====================================================
// FINISH ENGLISH LEVEL TEST
// =====================================================

function finishEnglishAssessment() {

    const data = load();

    data.englishScore = eaScore;


    if (eaScore >= 8) {

        data.level = "Advanced";

    } else if (eaScore >= 5) {

        data.level = "Intermediate";

    } else {

        data.level = "Beginner";
    }


    data.learningHistory.unshift({

        date: new Date().toLocaleString(),

        type: "English Level Test",

        score:
            `${eaScore}/${englishAssessmentQuestions.length}`,

        level: data.level
    });


    data.learningHistory =
        data.learningHistory.slice(0, 50);


    save(data);


    el("englishAssessment")
        .classList.add("hidden");


    renderLearning();

    showEnglishLesson();
}


// =====================================================
// ENGLISH DAILY LESSON
// =====================================================

function showEnglishLesson() {

    const data = load();

    const lesson =
        el("englishLesson");

    const title =
        el("englishLevelTitle");

    const text =
        el("englishLessonText");

    const taskArea =
        el("englishTaskArea");


    if (!lesson) {
        return;
    }


    title.textContent =
        `🇬🇧 ${data.level} English • Daily Lesson`;


    if (data.level === "Beginner") {

        text.textContent =
            "Learn 5 common English words and make 2 simple sentences.";

    } else if (data.level === "Intermediate") {

        text.textContent =
            "Write 5 sentences using past and future tense.";

    } else {

        text.textContent =
            "Write a short paragraph and use at least 5 advanced English words.";
    }


    taskArea.innerHTML = `
        <div class="history-item">
            📚 Today's English Task:<br><br>
            ${text.textContent}
        </div>
    `;


    lesson.classList.remove("hidden");
}


// =====================================================
// COMPLETE ENGLISH LESSON
// =====================================================

window.completeEnglishLesson = function () {

    const data = load();

    const today =
        new Date().toISOString().slice(0, 10);


    if (data.daily[today]) {

        const message =
            el("englishLessonMessage");

        if (message) {

            message.textContent =
                "✅ Today's English task is already completed.";
        }

        renderLearning();

        return;
    }


    data.learningHistory.unshift({

        date: new Date().toLocaleString(),

        type: "English Daily Lesson",

        score: "Completed",

        level: data.level
    });


    data.daily[today] = true;


    save(data);


    const message =
        el("englishLessonMessage");

    if (message) {

        message.textContent =
            "✅ Task completed! Your progress is saved.";
    }


    renderLearning();
};


// =====================================================
// DAILY TASK BUTTON
// =====================================================

window.completeDailyTask = function () {

    completeEnglishLesson();

    const message =
        el("dailyTaskMessage");

    if (message) {

        const data = load();

        const today =
            new Date().toISOString().slice(0, 10);

        if (data.daily[today]) {

            message.textContent =
                "✅ Today's task completed! Come back tomorrow for the next task.";
        }
    }
};


// =====================================================
// RENDER LEARNING
// =====================================================

function renderLearning() {

    const data = load();

    const progress =
        el("learningProgress");

    const dailyText =
        el("dailyTaskText");

    const history =
        el("learningHistory");


    if (!progress) {
        return;
    }


    const completedTasks =
        data.learningHistory.filter(
            item =>
                item.type.includes("Daily")
        ).length;


    progress.innerHTML = `

        <p>
            Level:
            <span class="level-badge">
                ${data.level}
            </span>
        </p>

        <p>
            Assessment Score:
            ${data.englishScore}/9
        </p>

        <p>
            Completed Tasks:
            ${completedTasks}
        </p>
    `;


    const today =
        new Date().toISOString().slice(0, 10);


    dailyText.textContent =
        data.daily[today]
            ? "Today's English task is completed ✅"
            : "Complete today's English task.";


    if (data.learningHistory.length) {

        history.innerHTML =
            data.learningHistory
                .map(item => `

                    <div class="history-item">

                        📅 ${item.date}<br>

                        <strong>
                            ${item.type}
                        </strong>

                        • ${item.score}
                        • ${item.level}

                    </div>

                `)
                .join("");

    } else {

        history.innerHTML =
            "No learning history yet.";
    }
}


// =====================================================
// RESET ENGLISH
// =====================================================

function resetEnglishAssessment() {

    const assessment =
        el("englishAssessment");

    const lesson =
        el("englishLesson");


    if (assessment) {
        assessment.classList.add("hidden");
    }

    if (lesson) {
        lesson.classList.add("hidden");
    }
}


// =====================================================
// PROGRAMMING QUIZ
// ONLY C, C++, PYTHON, JAVA
// =====================================================

const quizData = {

    C: [

        [
            "Which function prints output in C?",
            [
                "input()",
                "printf()",
                "print()",
                "output()"
            ],
            1
        ],

        [
            "Which symbol ends a statement in C?",
            [
                ".",
                ",",
                ";",
                ":"
            ],
            2
        ],

        [
            "Which data type stores an integer?",
            [
                "float",
                "int",
                "char",
                "double"
            ],
            1
        ],

        [
            "Which loop executes at least once?",
            [
                "for",
                "while",
                "do-while",
                "if"
            ],
            2
        ],

        [
            "Which operator gives remainder?",
            [
                "/",
                "%",
                "*",
                "//"
            ],
            1
        ],

        [
            "Which header is commonly used for printf()?",
            [
                "stdio.h",
                "math.h",
                "string.h",
                "stdlib.h"
            ],
            0
        ],

        [
            "Which keyword declares a constant?",
            [
                "constant",
                "const",
                "fixed",
                "let"
            ],
            1
        ],

        [
            "Array indexing in C normally starts at?",
            [
                "0",
                "1",
                "-1",
                "2"
            ],
            0
        ],

        [
            "Which operator is used to compare equality?",
            [
                "=",
                "==",
                "!=",
                "<="
            ],
            1
        ],

        [
            "Which function is the starting point of a C program?",
            [
                "start()",
                "main()",
                "run()",
                "begin()"
            ],
            1
        ],

        [
            "Which data type stores a single character?",
            [
                "char",
                "string",
                "text",
                "character"
            ],
            0
        ],

        [
            "Which keyword is used for a conditional statement?",
            [
                "if",
                "when",
                "check",
                "condition"
            ],
            0
        ]
    ],


    "C++": [

        [
            "Who developed C++?",
            [
                "Dennis Ritchie",
                "Bjarne Stroustrup",
                "James Gosling",
                "Guido van Rossum"
            ],
            1
        ],

        [
            "Which keyword creates a class?",
            [
                "class",
                "object",
                "new",
                "define"
            ],
            0
        ],

        [
            "Same function name with different parameters is called?",
            [
                "Inheritance",
                "Encapsulation",
                "Overloading",
                "Abstraction"
            ],
            2
        ],

        [
            "One class acquiring another class's properties is?",
            [
                "Inheritance",
                "Compilation",
                "Looping",
                "Casting"
            ],
            0
        ],

        [
            "Object member access operator?",
            [
                ".",
                "#",
                "@",
                "$"
            ],
            0
        ],

        [
            "Which stream is used for output?",
            [
                "cin",
                "cout",
                "scan",
                "print"
            ],
            1
        ],

        [
            "Which keyword creates a new object dynamically?",
            [
                "make",
                "new",
                "create",
                "alloc"
            ],
            1
        ],

        [
            "Which feature hides implementation details?",
            [
                "Abstraction",
                "Looping",
                "Casting",
                "Parsing"
            ],
            0
        ],

        [
            "Which symbol starts a preprocessor directive?",
            [
                "$",
                "#",
                "@",
                "%"
            ],
            1
        ],

        [
            "Which container stores key-value pairs?",
            [
                "vector",
                "map",
                "stack",
                "queue"
            ],
            1
        ],

        [
            "Which stream is commonly used for input?",
            [
                "cin",
                "cout",
                "input",
                "scan"
            ],
            0
        ],

        [
            "Which operator is used for scope resolution?",
            [
                ".",
                "::",
                "->",
                "##"
            ],
            1
        ]
    ],


    Python: [

        [
            "Which function displays output?",
            [
                "echo()",
                "print()",
                "display()",
                "output()"
            ],
            1
        ],

        [
            "Python comment symbol?",
            [
                "//",
                "#",
                "/*",
                "--"
            ],
            1
        ],

        [
            "Keyword to define a function?",
            [
                "function",
                "define",
                "def",
                "fun"
            ],
            2
        ],

        [
            "Ordered mutable collection?",
            [
                "list",
                "int",
                "float",
                "bool"
            ],
            0
        ],

        [
            "Loop commonly used for sequences?",
            [
                "for",
                "switch",
                "case",
                "goto"
            ],
            0
        ],

        [
            "Which type stores true/false?",
            [
                "bool",
                "str",
                "float",
                "list"
            ],
            0
        ],

        [
            "Which keyword handles exceptions?",
            [
                "try",
                "test",
                "catching",
                "error"
            ],
            0
        ],

        [
            "Which symbol is used for exponentiation?",
            [
                "^",
                "**",
                "//",
                "%%"
            ],
            1
        ],

        [
            "Which function returns the length of an object?",
            [
                "length()",
                "size()",
                "len()",
                "count()"
            ],
            2
        ],

        [
            "Which keyword is used for a condition?",
            [
                "if",
                "when",
                "check",
                "condition"
            ],
            0
        ],

        [
            "Which collection does not allow duplicate values?",
            [
                "list",
                "tuple",
                "set",
                "string"
            ],
            2
        ],

        [
            "Which keyword is used to import a module?",
            [
                "include",
                "import",
                "using",
                "require"
            ],
            1
        ]
    ],


    Java: [

        [
            "Who originally developed Java?",
            [
                "James Gosling",
                "Bjarne Stroustrup",
                "Dennis Ritchie",
                "Guido van Rossum"
            ],
            0
        ],

        [
            "Keyword to create a class?",
            [
                "class",
                "Class",
                "object",
                "newclass"
            ],
            0
        ],

        [
            "Java program entry method?",
            [
                "start()",
                "run()",
                "main()",
                "execute()"
            ],
            2
        ],

        [
            "Keyword for class inheritance?",
            [
                "inherits",
                "extends",
                "inherit",
                "using"
            ],
            1
        ],

        [
            "Whole-number data type?",
            [
                "float",
                "char",
                "int",
                "boolean"
            ],
            2
        ],

        [
            "Which keyword creates an object?",
            [
                "new",
                "make",
                "object",
                "create"
            ],
            0
        ],

        [
            "Which collection does not allow duplicates?",
            [
                "List",
                "Set",
                "Array",
                "Queue"
            ],
            1
        ],

        [
            "Which keyword prevents inheritance?",
            [
                "stop",
                "final",
                "private",
                "static"
            ],
            1
        ],

        [
            "Which keyword is used for a conditional statement?",
            [
                "if",
                "when",
                "check",
                "condition"
            ],
            0
        ],

        [
            "Which symbol ends a Java statement?",
            [
                ".",
                ",",
                ";",
                ":"
            ],
            2
        ],

        [
            "Which keyword is used to inherit a class?",
            [
                "extends",
                "inherits",
                "superclass",
                "using"
            ],
            0
        ],

        [
            "Which type stores true or false?",
            [
                "boolean",
                "bool",
                "bit",
                "logic"
            ],
            0
        ]
    ]

};


let currentLanguage = "";
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;


// =====================================================
// START PROGRAMMING QUIZ
// =====================================================

window.startQuiz = function (language) {

    if (!quizData[language]) {

        alert("This quiz is not available.");

        return;
    }


    currentLanguage = language;

    currentQuestionIndex = 0;

    score = 0;

    answerSelected = false;


    el("quizLanguages")
        .classList.add("hidden");

    el("quizFinished")
        .classList.add("hidden");

    el("quizGame")
        .classList.remove("hidden");


    el("quizTitle").textContent =
        language + " Quiz";


    showQuestion();
};


// =====================================================
// SHOW PROGRAMMING QUESTION
// =====================================================

function showQuestion() {

    const q =
        quizData[currentLanguage]
        [currentQuestionIndex];


    el("questionNumber").textContent =
        `Question ${currentQuestionIndex + 1} / ${quizData[currentLanguage].length}`;


    el("question").textContent =
        q[0];


    el("quizResult").textContent = "";

    el("answers").innerHTML = "";

    answerSelected = false;


    q[1].forEach(function (option, index) {

        const button =
            document.createElement("button");

        button.className =
            "quiz-answer";

        button.textContent =
            option;


        button.onclick = function () {

            if (answerSelected) {
                return;
            }

            answerSelected = true;


            if (index === q[2]) {

                score++;

                button.textContent =
                    option + " ✅";

                el("quizResult").textContent =
                    "Correct Answer! 🎉";

            } else {

                button.textContent =
                    option + " ❌";

                el("quizResult").textContent =
                    "Wrong Answer!";
            }
        };


        el("answers")
            .appendChild(button);

    });
}


// =====================================================
// NEXT PROGRAMMING QUESTION
// =====================================================

window.nextQuestion = function () {

    if (!answerSelected) {

        alert(
            "Please select an answer first."
        );

        return;
    }


    currentQuestionIndex++;


    if (
        currentQuestionIndex <
        quizData[currentLanguage].length
    ) {

        showQuestion();

    } else {

        finishQuiz();
    }
};


// =====================================================
// FINISH QUIZ
// =====================================================

function finishQuiz() {

    el("quizGame")
        .classList.add("hidden");

    el("quizFinished")
        .classList.remove("hidden");


    el("finalScore").textContent =
        `${currentLanguage} Quiz Score: ${score} / ${quizData[currentLanguage].length}`;


    const data = load();


    data.quizHistory.unshift({

        date: new Date().toLocaleString(),

        language: currentLanguage,

        score:
            `${score}/${quizData[currentLanguage].length}`
    });


    data.quizHistory =
        data.quizHistory.slice(0, 50);


    save(data);

    renderQuizHistory();
}


// =====================================================
// RETRY
// =====================================================

window.restartQuiz = function () {

    startQuiz(currentLanguage);
};


// =====================================================
// CHOOSE ANOTHER QUIZ
// =====================================================

window.chooseQuiz = function () {

    el("quizFinished")
        .classList.add("hidden");

    el("quizGame")
        .classList.add("hidden");

    el("quizLanguages")
        .classList.remove("hidden");
};


// =====================================================
// QUIZ HISTORY
// =====================================================

function renderQuizHistory() {

    const data = load();

    const history =
        el("quizHistory");


    if (!history) {
        return;
    }


    if (!data.quizHistory.length) {

        history.innerHTML =
            "No quiz history yet.";

        return;
    }


    history.innerHTML =
        data.quizHistory
            .map(function (item) {

                return `

                    <div class="history-item">

                        📅 ${item.date}
                        —
                        <strong>
                            ${item.language}
                        </strong>
                        —
                        ${item.score}

                        <br><br>

                        <button
                            class="secondary-btn"
                            onclick="startQuiz('${item.language}')"
                        >
                            🔄 Repeat Quiz
                        </button>

                    </div>

                `;
            })
            .join("");
}


// =====================================================
// PLAY ZONE
// =====================================================

const gameList = [

    [
        "memory-match",
        "🧠 Memory Match",
        "Test memory and concentration."
    ],

    [
        "Number-Rush",
        "🔢 Number Rush",
        "Merge numbers and reach a high score."
    ],

    [
        "sky-Dodge",
        "☁️ Sky Dodge",
        "Dodge obstacles and survive."
    ],

    [
        "x-o-rush",
        "❌⭕ X-O Rush",
        "Challenge your opponent in Tic-Tac-Toe."
    ]

];


window.renderGames = function () {

    const data = load();

    const grid =
        el("gamesGrid");


    if (!grid) {
        return;
    }


    grid.innerHTML =
        gameList
            .map(function (game, index) {

                const unlocked =
                    index === 0 ||
                    data.games.includes(index - 1);

                const completed =
                    data.games.includes(index);


                return `

                    <div
                        class="game-card
                        ${unlocked ? "" : "locked"}"
                    >

                        <div class="game-image">

                            <div class="game-placeholder">
                                ${game[1].split(" ")[0]}
                            </div>

                        </div>


                        <div class="game-content">

                            <h3>
                                ${game[1]}
                            </h3>

                            <p>
                                ${game[2]}
                            </p>


                            ${
                                unlocked

                                ?

                                `

                                <a
                                    href="games/${game[0]}/index.html"
                                    class="play-btn"
                                >
                                    ▶️ Play Now
                                </a>

                                <button
                                    class="secondary-btn"
                                    style="margin-top:8px;width:100%"
                                    onclick="markGameComplete(${index})"
                                >
                                    ${
                                        completed
                                        ? "✅ Completed"
                                        : "Mark Complete"
                                    }
                                </button>

                                `

                                :

                                `

                                <p class="unlock-note">
                                    🔒 Complete the previous game first.
                                </p>

                                `
                            }

                        </div>

                    </div>

                `;

            })
            .join("");
};


window.markGameComplete = function (index) {

    const data = load();

    if (!data.games.includes(index)) {

        data.games.push(index);

        save(data);
    }

    renderGames();
};


// =====================================================
// LEARNING GAMES
// =====================================================

window.selectLearningDifficulty = function (level) {

    const message =
        el("learningDifficultyMessage");


    const icon =
        level === "easy"
            ? "🟢"
            : level === "medium"
                ? "🟡"
                : "🔴";


    message.textContent =
        `${icon} ${level} selected!`;
};


window.openLearningGame = function (game) {

    const message =
        el("learningDifficultyMessage");


    if (!message.textContent.includes("selected")) {

        alert(
            "Please select a difficulty first."
        );

        return;
    }


    location.href =
        `learning-games/${game}/index.html`;
};


// =====================================================
// MOTIVATIONAL SHAYARI
// =====================================================

const shayaris = [

    "मेहनत इतनी खामोशी से करो, कि सफलता शोर मचा दे। 🚀",

    "आज की मेहनत ही कल की पहचान बनेगी। 💪",

    "छोटे कदम भी एक दिन बड़ी मंजिल तक ले जाते हैं। 🌟",

    "सीखते रहो, बढ़ते रहो और कभी हार मत मानो। 🔥",

    "हार मत मानो, शुरुआत छोटी हो सकती है, मंजिल बड़ी हो सकती है। 🏆",

    "सपने वो नहीं जो नींद में आते हैं, सपने वो हैं जो आपको मेहनत करने पर मजबूर करते हैं। 🌟",

    "हर दिन खुद को कल से बेहतर बनाओ। 🚀",

    "मुश्किल रास्ते अक्सर खूबसूरत मंजिल तक ले जाते हैं। 💪",

    "आज की मेहनत, कल की सफलता है। 🏆",

    "रुकना नहीं है, सीखते रहना है। 📚"

];


window.newShayari = function () {

    const random =
        Math.floor(
            Math.random() *
            shayaris.length
        );


    el("shayariText").textContent =
        shayaris[random];
};


// =====================================================
// RESUME BUILDER
// =====================================================

window.generateResume = function () {

    const name =
        el("resumeName").value.trim();

    const email =
        el("resumeEmail").value.trim();

    const education =
        el("resumeEducation").value.trim();


    if (!name || !email || !education) {

        alert(
            "Please fill Name, Email and Education."
        );

        return;
    }


    el("resumeOutput").innerHTML = `

        <h1>${name}</h1>

        <p>
            <strong>Email:</strong>
            ${email}
        </p>

        <p>
            <strong>Phone:</strong>
            ${el("resumePhone").value}
        </p>

        <hr>

        <h3>About Me</h3>

        <p>
            ${el("resumeAbout").value}
        </p>

        <h3>Education</h3>

        <p>
            ${education}
        </p>

        <h3>Skills</h3>

        <p>
            ${el("resumeSkills").value}
        </p>

        <br>

        <button onclick="window.print()">
            Print / Save Resume
        </button>

    `;


    el("resumeOutput")
        .classList.remove("hidden");
};


// =====================================================
// REFER & EARN
// =====================================================

function generateReferralCode(email) {

    const code =
        "SKILLUP" +
        (
            email
                ? email.substring(0, 4).toUpperCase()
                : ""
        );


    el("referralCode").textContent =
        code;
}


window.copyReferral = function () {

    navigator.clipboard
        .writeText(
            el("referralCode").textContent
        )
        .then(function () {

            el("copyMessage").textContent =
                "✅ Referral code copied!";
        });
};


function getReferralLink() {

    return (
        location.origin +
        location.pathname +
        "?ref=" +
        el("referralCode").textContent
    );
}


window.copyReferralLink = function () {

    navigator.clipboard
        .writeText(
            getReferralLink()
        )
        .then(function () {

            el("shareMessage").textContent =
                "✅ Referral link copied!";
        });
};


window.shareReferral = async function () {

    const link =
        getReferralLink();


    if (navigator.share) {

        await navigator.share({

            title: "Join SkillUp",

            text:
                "Join SkillUp - Learn, Play & Grow 🚀",

            url: link
        });

    } else {

        await navigator.clipboard
            .writeText(link);

        el("shareMessage").textContent =
            "✅ Link copied!";
    }
};


// =====================================================
// PDF MAKER
// =====================================================

window.generatePDF = function () {

    const title =
        el("pdfTitle").value.trim();

    const content =
        el("pdfContent").value.trim();


    if (!title || !content) {

        alert(
            "Please enter PDF title and content."
        );

        return;
    }


    const newWindow =
        window.open("", "_blank");


    if (!newWindow) {

        alert(
            "Please allow popups for SkillUp."
        );

        return;
    }


    newWindow.document.write(`

        <html>

        <head>

            <title>
                ${title}
            </title>

        </head>

        <body
            style="
                font-family:Arial;
                padding:50px;
            "
        >

            <h1>
                ${title}
            </h1>

            <div
                style="
                    white-space:pre-wrap;
                    line-height:1.6;
                "
            >
                ${content}
            </div>

        </body>

        </html>

    `);


    newWindow.document.close();


    setTimeout(function () {

        newWindow.print();

    }, 500);
};


// =====================================================
// DARK / LIGHT THEME
// =====================================================

window.toggleTheme = function () {

    document.body
        .classList
        .toggle("dark-theme");


    const dark =
        document.body
            .classList
            .contains("dark-theme");


    el("themeButton").textContent =
        dark ? "☀️" : "🌙";


    localStorage.setItem(
        "skillupTheme",
        dark ? "dark" : "light"
    );
};


if (
    localStorage.getItem("skillupTheme")
    === "dark"
) {

    document.body
        .classList
        .add("dark-theme");
}


// =====================================================
// END
// =====================================================