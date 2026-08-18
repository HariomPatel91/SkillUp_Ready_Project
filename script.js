/* =====================================================
   SKILLUP - FIREBASE + MAIN JAVASCRIPT
   ===================================================== */

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


/* =====================================================
   FIREBASE CONFIG
   ===================================================== */

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

async function login() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }
document.getElementById("loginButton").addEventListener("click", login);
    try {
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login successful!");

    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed: " + error.message);
    }
}
window.login = login;

/* =====================================================
   HELPER
   ===================================================== */

function el(id) {
    return document.getElementById(id);
}


/* =====================================================
   LOGIN / CREATE ACCOUNT
   ===================================================== */

window.showCreateAccount = function () {

    const loginPage = el("loginPage");
    const createPage = el("createAccountPage");

    if (loginPage) {
        loginPage.classList.add("hidden");
    }

    if (createPage) {
        createPage.classList.remove("hidden");
    }
};


window.showLogin = function () {

    const loginPage = el("loginPage");
    const createPage = el("createAccountPage");

    if (createPage) {
        createPage.classList.add("hidden");
    }

    if (loginPage) {
        loginPage.classList.remove("hidden");
    }
};


/* =====================================================
   CREATE ACCOUNT
   ===================================================== */

window.createAccount = async function () {

    const nameElement = el("signupName");
    const emailElement = el("signupEmail");
    const passwordElement = el("signupPassword");
    const message = el("signupMessage");

    if (!nameElement || !emailElement || !passwordElement) {
        console.error("Signup fields not found in index.html");
        return;
    }

    const name = nameElement.value.trim();
    const email = emailElement.value.trim();
    const password = passwordElement.value;

    if (!name || !email || !password) {

        if (message) {
            message.textContent = "Please fill all fields.";
            message.style.color = "red";
        }

        return;
    }

    if (password.length < 6) {

        if (message) {
            message.textContent =
                "Password must be at least 6 characters.";
            message.style.color = "red";
        }

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

        if (message) {
            message.textContent =
                "✅ Account created successfully!";
            message.style.color = "green";
        }

        setTimeout(function () {
            showLogin();
        }, 700);

    } catch (error) {

        console.error(error);

        let text = "Unable to create account.";

        if (error.code === "auth/email-already-in-use") {
            text = "This email is already registered.";
        }

        if (error.code === "auth/invalid-email") {
            text = "Please enter a valid email.";
        }

        if (error.code === "auth/weak-password") {
            text = "Password is too weak.";
        }

        if (message) {
            message.textContent = "❌ " + text;
            message.style.color = "red";
        }
    }
};


/* =====================================================
   LOGIN
   ===================================================== */

window.login = async function () {

    const emailElement = el("loginEmail");
    const passwordElement = el("loginPassword");
    const message = el("loginMessage");

    if (!emailElement || !passwordElement) {
        console.error("Login fields not found in index.html");
        return;
    }

    const email = emailElement.value.trim();
    const password = passwordElement.value;

    if (!email || !password) {

        if (message) {
            message.textContent =
                "Please enter email and password.";
            message.style.color = "red";
        }

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

        console.error(error);

        if (message) {
            message.textContent =
                "❌ Wrong email or password.";
            message.style.color = "red";
        }
    }
};


/* =====================================================
   OPEN APP
   ===================================================== */

function openApp(user) {

    const loginPage = el("loginPage");
    const createPage = el("createAccountPage");
    const appPage = el("appPage");

    if (loginPage) {
        loginPage.classList.add("hidden");
    }

    if (createPage) {
        createPage.classList.add("hidden");
    }

    if (appPage) {
        appPage.classList.remove("hidden");
    }

    const welcome = el("welcomeUser");

    if (welcome) {
        welcome.textContent =
            "Welcome " +
            (user.displayName || "User") +
            " 👋";
    }

    generateReferralCode(user.email);

    showSection("home");

    renderAll();
}


/* =====================================================
   LOGOUT
   ===================================================== */

window.logout = async function () {

    stopCourseTimer();
    clearReadingTimer();

    try {

        await signOut(auth);

        const appPage = el("appPage");
        const loginPage = el("loginPage");

        if (appPage) {
            appPage.classList.add("hidden");
        }

        if (loginPage) {
            loginPage.classList.remove("hidden");
        }

    } catch (error) {

        console.error(error);
    }
};


/* =====================================================
   AUTH STATE
   ===================================================== */

onAuthStateChanged(auth, function (user) {

    if (user) {
        openApp(user);
    }

});


/* =====================================================
   SECTION NAVIGATION
   ===================================================== */

window.showSection = function (name) {

    document
        .querySelectorAll(".section")
        .forEach(function (section) {
            section.classList.add("hidden");
        });

    const section = el(name);

    if (section) {
        section.classList.remove("hidden");
    }

    if (name === "quiz") {
        renderCourseHistory();
    }

    if (name === "learning") {
        renderLearning();
        resetEnglishAssessment();
    }

    if (name === "games") {
        renderGames();
    }
};


/* =====================================================
   LOCAL STORAGE
   ===================================================== */

function key() {

    return (
        "skillup_" +
        (auth.currentUser?.uid || "guest")
    );
}


function load() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(key())
            );

        if (saved) {

            saved.level =
                saved.level || "Beginner";

            saved.englishScore =
                typeof saved.englishScore === "number"
                    ? saved.englishScore
                    : 0;

            saved.daily =
                saved.daily || {};

            saved.quizHistory =
                saved.quizHistory || [];

            saved.learningHistory =
                saved.learningHistory || [];

            saved.games =
                saved.games || [];

            saved.courseHistory =
                saved.courseHistory || [];
            saved.typingHistory=
                saved.typingHistory || [];

            return saved;
        }

    } catch (error) {

        console.log(
            "Storage error:",
            error
        );
    }

    return {
        level: "Beginner",
        englishScore: 0,
        daily: {},
        quizHistory: [],
        learningHistory: [],
        games: [],
        courseHistory: [],
        typingHistory: []
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
    renderCourseHistory();
    renderGames();

}


/* =====================================================
   ENGLISH ASSESSMENT
   ===================================================== */

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
        q: "She has been studying ___ two hours.",
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


/* =====================================================
   START ENGLISH ASSESSMENT
   ===================================================== */

window.startEnglishAssessment = function () {

    eaIndex = 0;
    eaScore = 0;
    eaAnswered = false;

    const assessment = el("englishAssessment");
    const lesson = el("englishLesson");

    if (!assessment) {
        return;
    }

    assessment.classList.remove("hidden");

    if (lesson) {
        lesson.classList.add("hidden");
    }

    showEnglishAssessment();
};


/* =====================================================
   SHOW ENGLISH QUESTION
   ===================================================== */

function showEnglishAssessment() {

    const q =
        englishAssessmentQuestions[eaIndex];

    if (!q) {
        finishEnglishAssessment();
        return;
    }

    const number = el("englishAssessmentNumber");
    const question = el("englishAssessmentQuestion");
    const result = el("englishAssessmentResult");
    const answers = el("englishAssessmentAnswers");

    if (!number || !question || !answers) {
        return;
    }

    number.textContent =
        `Question ${eaIndex + 1} / ${englishAssessmentQuestions.length}`;

    question.textContent = q.q;

    if (result) {
        result.textContent = "";
    }

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

                if (result) {
                    result.textContent =
                        "Correct! 🎉";
                    result.style.color = "green";
                }

            } else {

                button.textContent =
                    option + " ❌";

                if (result) {
                    result.textContent =
                        "Wrong Answer.";
                    result.style.color = "red";
                }
            }
        };

        answers.appendChild(button);
    });
}


/* =====================================================
   NEXT ENGLISH QUESTION
   ===================================================== */

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


/* =====================================================
   FINISH ENGLISH ASSESSMENT
   ===================================================== */

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

    const assessment =
        el("englishAssessment");

    if (assessment) {
        assessment.classList.add("hidden");
    }

    renderLearning();

    showEnglishLesson();
}


/* =====================================================
   ENGLISH LESSON
   ===================================================== */

function showEnglishLesson() {

    const data = load();

    const lesson =
        el("englishLesson");

    if (!lesson) {
        return;
    }

    const title =
        el("englishLevelTitle");

    const text =
        el("englishLessonText");

    if (title) {

        title.textContent =
            `🇬🇧 ${data.level} English • Daily Lesson`;
    }

    let lessonText = "";

    if (data.level === "Beginner") {

        lessonText =
            "Learn 5 common English words and make 2 simple sentences.";

    } else if (data.level === "Intermediate") {

        lessonText =
            "Write 5 sentences using past and future tense.";

    } else {

        lessonText =
            "Write a short paragraph and use at least 5 advanced English words.";
    }

    if (text) {
        text.textContent = lessonText;
    }

    const taskArea =
        el("englishTaskArea");

    if (taskArea) {

        taskArea.innerHTML = `
            <div class="history-item">
                📚 Today's English Task:<br><br>
                ${lessonText}
            </div>
        `;
    }

    lesson.classList.remove("hidden");
}


/* =====================================================
   COMPLETE ENGLISH LESSON
   ===================================================== */

window.completeEnglishLesson = function () {

    const data = load();

    const today =
        new Date()
            .toISOString()
            .slice(0, 10);

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


window.startDailyEnglishTask = function () {

    showEnglishLesson();

};


window.completeDailyTask = function () {

    completeEnglishLesson();

};


/* =====================================================
   RENDER LEARNING
   ===================================================== */

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
        data.learningHistory.filter(function (item) {

            return item.type.includes("Daily");

        }).length;

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
        new Date()
            .toISOString()
            .slice(0, 10);

    if (dailyText) {

        dailyText.textContent =
            data.daily[today]
                ? "Today's English task is completed ✅"
                : "Complete today's English task.";
    }

    if (!history) {
        return;
    }

    if (data.learningHistory.length) {

        history.innerHTML =
            data.learningHistory
                .map(function (item) {

                    return `

                        <div class="history-item">

                            📅 ${item.date}<br>

                            <strong>
                                ${item.type}
                            </strong>

                            • ${item.score}
                            • ${item.level}

                        </div>

                    `;

                })
                .join("");

    } else {

        history.innerHTML =
            "No learning history yet.";
    }
}


/* =====================================================
   RESET ENGLISH ASSESSMENT
   ===================================================== */

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


/* =====================================================
   PROGRAMMING COURSES
   ===================================================== */

const courseData = {

    C: {

        readings: [

            {
                title: "What is C?",
                content: `
                    <h3>Introduction to C</h3>

                    <p>
                        C is a general-purpose programming language
                        created by Dennis Ritchie.
                    </p>

                    <h3>Why Learn C?</h3>

                    <ul>
                        <li>Programming fundamentals</li>
                        <li>Memory concepts</li>
                        <li>Pointers</li>
                        <li>System programming</li>
                    </ul>
                `
            },

            {
                title: "C Variables and Data Types",
                content: `
                    <h3>Variables</h3>

                    <p>
                        A variable stores data in memory.
                    </p>

                    <ul>
                        <li><strong>int</strong> - whole numbers</li>
                        <li><strong>float</strong> - decimal numbers</li>
                        <li><strong>char</strong> - characters</li>
                        <li><strong>double</strong> - decimal values</li>
                    </ul>
                `
            },

            {
                title: "C Operators",
                content: `
                    <h3>Operators</h3>

                    <p>
                        Operators perform operations on values.
                    </p>

                    <ul>
                        <li>+</li>
                        <li>-</li>
                        <li>*</li>
                        <li>/</li>
                        <li>%</li>
                        <li>==</li>
                    </ul>
                `
            },

            {
                title: "C Conditions and Loops",
                content: `
                    <h3>Conditions</h3>

                    <p>
                        The if statement is used for decision making.
                    </p>

                    <h3>Loops</h3>

                    <p>
                        C provides for, while and do-while loops.
                    </p>
                `
            },

            {
                title: "C Functions and Arrays",
                content: `
                    <h3>Functions</h3>

                    <p>
                        Functions are reusable blocks of code.
                    </p>

                    <h3>Arrays</h3>

                    <p>
                        Arrays store multiple values of the same type.
                    </p>
                `
            }

        ],

        questions: [

            [
                "Which function prints output in C?",
                ["input()", "printf()", "print()", "output()"],
                1
            ],

            [
                "Which symbol ends a statement in C?",
                [".", ",", ";", ":"],
                2
            ],

            [
                "Which data type stores an integer?",
                ["float", "int", "char", "double"],
                1
            ],

            [
                "Which loop executes at least once?",
                ["for", "while", "do-while", "if"],
                2
            ],

            [
                "Which operator gives remainder?",
                ["/", "%", "*", "//"],
                1
            ],

            [
                "Which header is commonly used for printf()?",
                ["stdio.h", "math.h", "string.h", "stdlib.h"],
                0
            ],

            [
                "Which keyword declares a constant?",
                ["constant", "const", "fixed", "let"],
                1
            ],

            [
                "Array indexing in C normally starts at?",
                ["0", "1", "-1", "2"],
                0
            ],

            [
                "Which operator compares equality?",
                ["=", "==", "!=", "<="],
                1
            ],

            [
                "Which function is the starting point of a C program?",
                ["start()", "main()", "run()", "begin()"],
                1
            ]

        ]
    },


    "C++": {

        readings: [

            {
                title: "What is C++?",
                content: `
                    <h3>Introduction to C++</h3>

                    <p>
                        C++ is a general-purpose programming language
                        developed by Bjarne Stroustrup.
                    </p>

                    <h3>Why Learn C++?</h3>

                    <ul>
                        <li>Problem solving</li>
                        <li>Object-oriented programming</li>
                        <li>Competitive programming</li>
                        <li>Software development</li>
                    </ul>
                `
            },

            {
                title: "C++ Classes and Objects",
                content: `
                    <h3>Classes</h3>

                    <p>
                        A class is a blueprint for creating objects.
                    </p>

                    <h3>Objects</h3>

                    <p>
                        An object is an instance of a class.
                    </p>
                `
            },

            {
                title: "C++ Inheritance",
                content: `
                    <h3>Inheritance</h3>

                    <p>
                        Inheritance allows one class to acquire
                        properties and behavior from another class.
                    </p>
                `
            },

            {
                title: "C++ Polymorphism",
                content: `
                    <h3>Polymorphism</h3>

                    <p>
                        Polymorphism allows one interface to have
                        different forms of behavior.
                    </p>
                `
            },

            {
                title: "C++ STL",
                content: `
                    <h3>Standard Template Library</h3>

                    <ul>
                        <li>vector</li>
                        <li>map</li>
                        <li>set</li>
                        <li>stack</li>
                        <li>queue</li>
                    </ul>
                `
            }

        ],

        questions: [

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
                ["class", "object", "new", "define"],
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
                [".", "#", "@", "$"],
                0
            ],

            [
                "Which stream is used for output?",
                ["cin", "cout", "scan", "print"],
                1
            ],

            [
                "Which keyword creates a new object dynamically?",
                ["make", "new", "create", "alloc"],
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
                ["$", "#", "@", "%"],
                1
            ],

            [
                "Which container stores key-value pairs?",
                ["vector", "map", "stack", "queue"],
                1
            ]

        ]
    },


    Python: {

        readings: [

            {
                title: "What is Python?",
                content: `
                    <h3>Introduction to Python</h3>

                    <p>
                        Python is a high-level general-purpose
                        programming language with readable syntax.
                    </p>

                    <h3>Uses</h3>

                    <ul>
                        <li>Web development</li>
                        <li>Automation</li>
                        <li>AI</li>
                        <li>Data science</li>
                    </ul>
                `
            },

            {
                title: "Python Variables and Data Types",
                content: `
                    <h3>Variables</h3>

                    <p>
                        Python variables store references to values.
                    </p>

                    <ul>
                        <li>int</li>
                        <li>float</li>
                        <li>str</li>
                        <li>bool</li>
                        <li>list</li>
                    </ul>
                `
            },

            {
                title: "Python Conditions and Loops",
                content: `
                    <h3>Conditions</h3>

                    <p>
                        Python uses if, elif and else.
                    </p>

                    <h3>Loops</h3>

                    <p>
                        Python commonly uses for and while loops.
                    </p>
                `
            },

            {
                title: "Python Functions",
                content: `
                    <h3>Functions</h3>

                    <p>
                        Functions are reusable blocks of code.
                    </p>

                    <p>
                        Python uses the def keyword.
                    </p>
                `
            },

            {
                title: "Python Collections",
                content: `
                    <h3>Collections</h3>

                    <ul>
                        <li>List</li>
                        <li>Tuple</li>
                        <li>Set</li>
                        <li>Dictionary</li>
                    </ul>
                `
            }

        ],

        questions: [

            [
                "Which function displays output?",
                ["echo()", "print()", "display()", "output()"],
                1
            ],

            [
                "Python comment symbol?",
                ["//", "#", "/*", "--"],
                1
            ],

            [
                "Keyword to define a function?",
                ["function", "define", "def", "fun"],
                2
            ],

            [
                "Ordered mutable collection?",
                ["list", "int", "float", "bool"],
                0
            ],

            [
                "Loop commonly used for sequences?",
                ["for", "switch", "case", "goto"],
                0
            ],

            [
                "Which type stores true/false?",
                ["bool", "str", "float", "list"],
                0
            ],

            [
                "Which keyword handles exceptions?",
                ["try", "test", "catching", "error"],
                0
            ],

            [
                "Which symbol is used for exponentiation?",
                ["^", "**", "//", "%%"],
                1
            ],

            [
                "Which function returns length?",
                ["length()", "size()", "len()", "count()"],
                2
            ],

            [
                "Which collection does not allow duplicates?",
                ["list", "tuple", "set", "string"],
                2
            ]

        ]
    },


    Java: {

        readings: [

            {
                title: "What is Java?",
                content: `
                    <h3>Introduction to Java</h3>

                    <p>
                        Java is a popular object-oriented programming
                        language designed to be portable across platforms.
                    </p>

                    <h3>Why Learn Java?</h3>

                    <ul>
                        <li>Object-oriented programming</li>
                        <li>Software development</li>
                        <li>Backend development</li>
                        <li>Large ecosystem</li>
                    </ul>
                `
            },

            {
                title: "Java Classes and Objects",
                content: `
                    <h3>Classes</h3>

                    <p>
                        A class defines fields and methods.
                    </p>

                    <h3>Objects</h3>

                    <p>
                        Objects are instances of classes.
                    </p>
                `
            },

            {
                title: "Java Inheritance",
                content: `
                    <h3>Inheritance</h3>

                    <p>
                        Java uses the extends keyword for inheritance.
                    </p>
                `
            },

            {
                title: "Java Data Types and Conditions",
                content: `
                    <h3>Data Types</h3>

                    <ul>
                        <li>int</li>
                        <li>double</li>
                        <li>char</li>
                        <li>boolean</li>
                    </ul>

                    <h3>Conditions</h3>

                    <p>
                        Java uses if, else if and else.
                    </p>
                `
            },

            {
                title: "Java Collections",
                content: `
                    <h3>Collections</h3>

                    <ul>
                        <li>List</li>
                        <li>Set</li>
                        <li>Queue</li>
                        <li>Map</li>
                    </ul>
                `
            }

        ],

        questions: [

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
                ["class", "Class", "object", "newclass"],
                0
            ],

            [
                "Java program entry method?",
                ["start()", "run()", "main()", "execute()"],
                2
            ],

            [
                "Keyword for class inheritance?",
                ["inherits", "extends", "inherit", "using"],
                1
            ],

            [
                "Whole-number data type?",
                ["float", "char", "int", "boolean"],
                2
            ],

            [
                "Which keyword creates an object?",
                ["new", "make", "object", "create"],
                0
            ],

            [
                "Which collection does not allow duplicates?",
                ["List", "Set", "Array", "Queue"],
                1
            ],

            [
                "Which keyword prevents inheritance?",
                ["stop", "final", "private", "static"],
                1
            ],

            [
                "Which keyword is used for a conditional statement?",
                ["if", "when", "check", "condition"],
                0
            ],

            [
                "Which symbol ends a Java statement?",
                [".", ",", ";", ":"],
                2
            ]

        ]
    }

};


/* =====================================================
   COURSE VARIABLES
   ===================================================== */

const COURSE_MINUTES = 20;
const READING_LOCK_SECONDS = 5;

let currentCourse = "";
let currentReadingIndex = 0;
let currentCourseQuestionIndex = 0;
let courseScore = 0;
let courseAnswerSelected = false;

let courseSecondsLeft =
    COURSE_MINUTES * 60;

let courseTimerInterval = null;
let readingTimerInterval = null;
let readingLocked = true;


/* =====================================================
   START COURSE
   ===================================================== */

window.startCourse = function (language) {

    if (!courseData[language]) {

        alert(
            "This course is not available."
        );

        return;
    }

    stopCourseTimer();

    currentCourse = language;
    currentReadingIndex = 0;
    currentCourseQuestionIndex = 0;
    courseScore = 0;
    courseAnswerSelected = false;

    courseSecondsLeft =
        COURSE_MINUTES * 60;

    if (el("quizLanguages")) {
        el("quizLanguages")
            .classList.add("hidden");
    }

    if (el("courseDashboard")) {
        el("courseDashboard")
            .classList.remove("hidden");
    }

    if (el("courseReading")) {
        el("courseReading")
            .classList.remove("hidden");
    }

    if (el("courseQuiz")) {
        el("courseQuiz")
            .classList.add("hidden");
    }

    if (el("courseCompleted")) {
        el("courseCompleted")
            .classList.add("hidden");
    }

    if (el("certificateArea")) {
        el("certificateArea")
            .classList.add("hidden");
    }

    if (el("courseName")) {
        el("courseName").textContent =
            `${language} Programming Course`;
    }

    updateCourseTimer();
    updateCourseProgress();

    showReading();
    startCourseTimer();
};


/* =====================================================
   COURSE TIMER
   ===================================================== */

function startCourseTimer() {

    stopCourseTimer();

    courseTimerInterval =
        setInterval(function () {

            if (courseSecondsLeft > 0) {

                courseSecondsLeft--;

                updateCourseTimer();
                updateCourseProgress();

            } else {

                courseSecondsLeft = 0;

                updateCourseTimer();
                updateCourseProgress();

                stopCourseTimer();

                checkCertificateUnlock();
            }

        }, 1000);
}


function stopCourseTimer() {

    if (courseTimerInterval) {

        clearInterval(
            courseTimerInterval
        );

        courseTimerInterval = null;
    }
}


function updateCourseTimer() {

    const timer =
        el("courseTimer");

    if (!timer) {
        return;
    }

    const minutes =
        Math.floor(
            courseSecondsLeft / 60
        );

    const seconds =
        courseSecondsLeft % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const message =
        el("courseTimerMessage");

    if (courseSecondsLeft === 0) {

        timer.style.color = "#16a34a";

        if (message) {
            message.textContent =
                "✅ Minimum 20-minute learning time completed.";
        }

    } else {

        timer.style.color = "";

        if (message) {
            message.textContent =
                "⏱️ Keep learning. Certificate unlocks after 20 minutes.";
        }
    }
}


/* =====================================================
   READING
   ===================================================== */

function showReading() {

    clearReadingTimer();

    if (!currentCourse) {
        return;
    }

    const readings =
        courseData[currentCourse].readings;

    const reading =
        readings[currentReadingIndex];

    if (!reading) {

        startCourseQuiz();

        return;
    }

    readingLocked = true;

    if (el("courseReading")) {
        el("courseReading")
            .classList.remove("hidden");
    }

    if (el("readingNumber")) {

        el("readingNumber").textContent =
            `Reading ${currentReadingIndex + 1} / ${readings.length}`;
    }

    if (el("readingTitle")) {

        el("readingTitle").textContent =
            reading.title;
    }

    if (el("readingContent")) {

        el("readingContent").innerHTML =
            reading.content;
    }

    const nextButton =
        el("nextReadingBtn");

    if (nextButton) {
        nextButton.disabled = true;
    }

    if (el("readingTimer")) {

        el("readingTimer").textContent =
            `🔒 Next available in ${READING_LOCK_SECONDS} seconds...`;
    }

    let seconds =
        READING_LOCK_SECONDS;

    readingTimerInterval =
        setInterval(function () {

            seconds--;

            if (seconds > 0) {

                if (el("readingTimer")) {

                    el("readingTimer").textContent =
                        `🔒 Next available in ${seconds} seconds...`;
                }

            } else {

                clearReadingTimer();

                readingLocked = false;

                if (nextButton) {
                    nextButton.disabled = false;
                }

                if (el("readingTimer")) {

                    el("readingTimer").textContent =
                        "✅ Reading completed. You can continue.";
                }
            }

        }, 1000);

    updateCourseProgress();
}


function clearReadingTimer() {

    if (readingTimerInterval) {

        clearInterval(
            readingTimerInterval
        );

        readingTimerInterval = null;
    }
}


window.nextReading = function () {

    if (readingLocked) {
        return;
    }

    currentReadingIndex++;

    if (
        currentReadingIndex <
        courseData[currentCourse].readings.length
    ) {

        showReading();

    } else {

        startCourseQuiz();
    }
};


/* =====================================================
   COURSE QUIZ
   ===================================================== */

function startCourseQuiz() {

    clearReadingTimer();

    if (el("courseReading")) {
        el("courseReading")
            .classList.add("hidden");
    }

    if (el("courseQuiz")) {
        el("courseQuiz")
            .classList.remove("hidden");
    }

    currentCourseQuestionIndex = 0;
    courseScore = 0;
    courseAnswerSelected = false;

    showCourseQuestion();

    updateCourseProgress();
}


function showCourseQuestion() {

    const questions =
        courseData[currentCourse].questions;

    const q =
        questions[currentCourseQuestionIndex];

    if (!q) {

        finishCourseQuiz();

        return;
    }

    courseAnswerSelected = false;

    if (el("courseQuestionNumber")) {

        el("courseQuestionNumber").textContent =
            `Question ${currentCourseQuestionIndex + 1} / ${questions.length}`;
    }

    if (el("courseQuestion")) {

        el("courseQuestion").textContent =
            q[0];
    }

    if (el("courseQuizResult")) {

        el("courseQuizResult").textContent = "";
    }

    const answers =
        el("courseAnswers");

    if (!answers) {
        return;
    }

    answers.innerHTML = "";

    q[1].forEach(function (option, index) {

        const button =
            document.createElement("button");

        button.className =
            "quiz-answer";

        button.textContent =
            option;

        button.onclick = function () {

            if (courseAnswerSelected) {
                return;
            }

            courseAnswerSelected = true;

            if (index === q[2]) {

                courseScore++;

                button.textContent =
                    option + " ✅";

                if (el("courseQuizResult")) {

                    el("courseQuizResult").textContent =
                        "Correct Answer! 🎉";

                    el("courseQuizResult").style.color =
                        "green";
                }

            } else {

                button.textContent =
                    option + " ❌";

                if (el("courseQuizResult")) {

                    el("courseQuizResult").textContent =
                        "Wrong Answer.";

                    el("courseQuizResult").style.color =
                        "red";
                }
            }
        };

        answers.appendChild(button);
    });

    updateCourseProgress();
}


window.nextCourseQuestion = function () {

    if (!courseAnswerSelected) {

        alert(
            "Please select an answer first."
        );

        return;
    }

    currentCourseQuestionIndex++;

    if (
        currentCourseQuestionIndex <
        courseData[currentCourse].questions.length
    ) {

        showCourseQuestion();

    } else {

        finishCourseQuiz();
    }
};


/* =====================================================
   FINISH QUIZ
   ===================================================== */

function finishCourseQuiz() {

    if (el("courseQuiz")) {
        el("courseQuiz")
            .classList.add("hidden");
    }

    if (el("courseCompleted")) {
        el("courseCompleted")
            .classList.remove("hidden");
    }

    const total =
        courseData[currentCourse]
            .questions.length;

    const percentage =
        Math.round(
            (courseScore / total) * 100
        );

    if (el("courseFinalScore")) {

        el("courseFinalScore").textContent =
            `${currentCourse} Quiz Score: ${courseScore} / ${total} (${percentage}%)`;
    }

    if (el("courseTimeMessage")) {

        el("courseTimeMessage").textContent =
            courseSecondsLeft === 0
                ? "✅ Minimum 20-minute requirement completed."
                : `⏱️ ${formatTime(courseSecondsLeft)} remaining before certificate unlock.`;
    }

    saveCourseHistory();

    checkCertificateUnlock();

    updateCourseProgress();
}


/* =====================================================
   CERTIFICATE UNLOCK
   ===================================================== */

function checkCertificateUnlock() {

    const button =
        el("generateCertificateBtn");

    const status =
        el("certificateStatus");

    if (!button || !status) {
        return;
    }

    const readingComplete =
        currentReadingIndex >=
        courseData[currentCourse].readings.length;

    const quizComplete =
        currentCourseQuestionIndex >=
        courseData[currentCourse].questions.length;

    const timeComplete =
        courseSecondsLeft <= 0;

    if (
        readingComplete &&
        quizComplete &&
        timeComplete
    ) {

        button.disabled = false;

        status.textContent =
            "🎉 All requirements completed! Your certificate is ready.";

        status.style.color = "green";

    } else {

        button.disabled = true;

        const remaining = [];

        if (!readingComplete) {
            remaining.push(
                "complete all readings"
            );
        }

        if (!quizComplete) {
            remaining.push(
                "complete the quiz"
            );
        }

        if (!timeComplete) {

            remaining.push(
                `complete ${formatTime(courseSecondsLeft)} more`
            );
        }

        status.textContent =
            "🔒 Still required: " +
            remaining.join(" • ");

        status.style.color = "";
    }
}


/* =====================================================
   COURSE PROGRESS
   ===================================================== */

function updateCourseProgress() {

    if (!currentCourse) {
        return;
    }

    const totalReadings =
        courseData[currentCourse]
            .readings.length;

    const totalQuestions =
        courseData[currentCourse]
            .questions.length;

    const readingProgress =
        Math.min(
            currentReadingIndex,
            totalReadings
        ) / totalReadings;

    const quizProgress =
        Math.min(
            currentCourseQuestionIndex,
            totalQuestions
        ) / totalQuestions;

    const timeProgress =
        1 -
        (
            courseSecondsLeft /
            (COURSE_MINUTES * 60)
        );

    const progress =
        Math.round(
            readingProgress * 40 +
            quizProgress * 40 +
            Math.max(0, timeProgress) * 20
        );

    const finalProgress =
        Math.min(100, progress);

    const text =
        el("courseProgressText");

    const bar =
        el("courseProgressBar");

    if (text) {

        text.textContent =
            `Course Progress: ${finalProgress}%`;
    }

    if (bar) {

        bar.style.width =
            `${finalProgress}%`;
    }
}


function formatTime(totalSeconds) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    return (
        `${minutes}m ${String(seconds).padStart(2, "0")}s`
    );
}


/* =====================================================
   CERTIFICATE TIER
   ===================================================== */

function getCertificateTier(scorePercentage) {

    if (scorePercentage >= 90) {

        return {
            name: "Gold",
            emoji: "🥇"
        };
    }

    if (scorePercentage >= 75) {

        return {
            name: "Silver",
            emoji: "🥈"
        };
    }

    return {
        name: "Bronze",
        emoji: "🥉"
    };
}


/* =====================================================
   GENERATE CERTIFICATE
   ===================================================== */

window.generateCertificate = function () {

    if (courseSecondsLeft > 0) {

        alert(
            "⏱️ Complete the full 20-minute course before generating the certificate."
        );

        return;
    }

    if (
        currentReadingIndex <
        courseData[currentCourse].readings.length
    ) {

        alert(
            "📖 Please complete all reading lessons first."
        );

        return;
    }

    if (
        currentCourseQuestionIndex <
        courseData[currentCourse].questions.length
    ) {

        alert(
            "🧠 Please complete the quiz first."
        );

        return;
    }

    const total =
        courseData[currentCourse]
            .questions.length;

    const percentage =
        Math.round(
            (courseScore / total) * 100
        );

    const tier =
        getCertificateTier(percentage);

    const user =
        auth.currentUser;

    const studentName =
        user?.displayName ||
        "SkillUp Learner";

    const today =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    if (el("certificateStudentName")) {

        el("certificateStudentName")
            .textContent =
            studentName;
    }

    if (el("certificateCourseName")) {

        el("certificateCourseName")
            .textContent =
            `${currentCourse} Programming`;
    }

    if (el("certificateLanguage")) {

        el("certificateLanguage")
            .textContent =
            currentCourse;
    }

    if (el("certificateAward")) {

        el("certificateAward")
            .textContent =
            `${tier.emoji} ${tier.name}`;
    }

    if (el("certificateScore")) {

        el("certificateScore")
            .textContent =
            `${percentage}%`;
    }

    if (el("certificateDate")) {

        el("certificateDate")
            .textContent =
            today;
    }

    if (el("certificateSeal")) {

        el("certificateSeal")
            .textContent =
            tier.name.toUpperCase();
    }

    if (el("certificateArea")) {

        el("certificateArea")
            .classList.remove("hidden");

        el("certificateArea")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
};


/* =====================================================
   PRINT CERTIFICATE
   ===================================================== */

window.printCertificate = function () {

    const certificate =
        el("certificate");

    if (!certificate) {
        return;
    }

    const printWindow =
        window.open("", "_blank");

    if (!printWindow) {

        alert(
            "Please allow popups for printing the certificate."
        );

        return;
    }

    printWindow.document.write(`

        <html>

        <head>

            <title>
                SkillUp Certificate
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background: #fff;
                }

                #certificate {
                    max-width: 900px;
                    margin: auto;
                }

                .certificate-border {
                    padding: 45px;
                    min-height: 650px;
                    border: 12px double #d4af37;
                    outline: 2px solid #172033;
                    outline-offset: -25px;
                    text-align: center;
                    color: #172033;
                    background: #fff;
                }

                .certificate-top {
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                    font-size: 13px;
                    letter-spacing: 2px;
                    color: #555;
                    margin-bottom: 30px;
                }

                .certificate-icon {
                    font-size: 55px;
                }

                .certificate-small-title {
                    font-size: 15px;
                    font-weight: bold;
                    letter-spacing: 5px;
                    color: #8a6b00;
                }

                h1 {
                    font-family: Georgia, serif;
                    font-size: 38px;
                }

                #certificateStudentName {
                    font-family:
                        "Brush Script MT",
                        "Segoe Script",
                        cursive;
                    font-size: 38px;
                    color: #7c3aed;
                }

                #certificateCourseName {
                    font-family: Georgia, serif;
                    font-size: 28px;
                    color: #2563eb;
                }

                .certificate-line {
                    width: 65%;
                    height: 1px;
                    background: #aaa;
                    margin: 8px auto 18px;
                }

                .certificate-description {
                    max-width: 650px;
                    margin: 15px auto;
                    line-height: 1.6;
                }

                .certificate-details {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 10px;
                    margin: 30px auto;
                    max-width: 750px;
                }

                .certificate-details div {
                    padding: 12px 7px;
                    border-top: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                }

                .certificate-details span {
                    display: block;
                    font-size: 10px;
                    color: #777;
                    margin-bottom: 5px;
                }

                .certificate-details strong {
                    font-size: 14px;
                }

                .certificate-signatures {
                    display: grid;
                    grid-template-columns:
                        1fr 110px 1fr;
                    align-items: end;
                    gap: 20px;
                    margin-top: 35px;
                }

                .signature-box {
                    text-align: center;
                }

                .signature-style {
                    font-family:
                        "Brush Script MT",
                        "Segoe Script",
                        cursive;
                    font-size: 25px;
                    font-style: italic;
                    height: 35px;
                }

                .signature-line {
                    height: 1px;
                    background: #333;
                    margin-bottom: 7px;
                }

                .signature-box strong,
                .signature-box span {
                    display: block;
                    font-size: 12px;
                }

                .certificate-seal {
                    width: 95px;
                    height: 95px;
                    border: 4px double #d4af37;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 10px;
                    color: #8a6b00;
                    font-weight: bold;
                }

                .certificate-actions {
                    display: none;
                }

                @media print {

                    body {
                        padding: 0;
                    }

                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }

                }

            </style>

        </head>

        <body>

            ${certificate.outerHTML}

        </body>

        </html>

    `);

    printWindow.document.close();

    setTimeout(function () {

        printWindow.print();

    }, 500);
};


/* =====================================================
   COURSE HISTORY
   ===================================================== */

function saveCourseHistory() {

    const data = load();

    const total =
        courseData[currentCourse]
            .questions.length;

    const percentage =
        Math.round(
            (courseScore / total) * 100
        );

    data.courseHistory.unshift({

        date:
            new Date().toLocaleString(),

        language:
            currentCourse,

        score:
            `${courseScore}/${total}`,

        percentage:
            percentage,

        certificate:
            percentage >= 90
                ? "Gold"
                : percentage >= 75
                    ? "Silver"
                    : "Bronze"

    });

    data.courseHistory =
        data.courseHistory.slice(0, 50);

    save(data);

    renderCourseHistory();
}


function renderCourseHistory() {

    const history =
        el("courseHistory");

    if (!history) {
        return;
    }

    const data = load();

    if (!data.courseHistory.length) {

        history.innerHTML =
            "No course history yet.";

        return;
    }

    history.innerHTML =
        data.courseHistory
            .map(function (item) {

                const emoji =
                    item.certificate === "Gold"
                        ? "🥇"
                        : item.certificate === "Silver"
                            ? "🥈"
                            : "🥉";

                return `

                    <div class="history-item">

                        📅 ${item.date}<br>

                        <strong>
                            ${item.language} Programming
                        </strong>

                        — Score:
                        ${item.score}
                        (${item.percentage}%)

                        <br>

                        ${emoji}
                        ${item.certificate} Level

                    </div>

                `;

            })
            .join("");
}


window.chooseCourse = function () {

    stopCourseTimer();
    clearReadingTimer();

    if (el("courseDashboard")) {

        el("courseDashboard")
            .classList.add("hidden");
    }

    if (el("quizLanguages")) {

        el("quizLanguages")
            .classList.remove("hidden");
    }

    currentCourse = "";
};


/* =====================================================
   PLAY ZONE
   ===================================================== */

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

                    <div class="game-card
                        ${unlocked ? "" : "locked"}">

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
                                    ? `

                                        <a
                                            href="games/${game[0]}/index.html"
                                            class="play-btn">
                                            ▶️ Play Now
                                        </a>

                                        <button
                                            class="secondary-btn"
                                            style="margin-top:8px;width:100%"
                                            onclick="markGameComplete(${index})">

                                            ${
                                                completed
                                                    ? "✅ Completed"
                                                    : "Mark Complete"
                                            }

                                        </button>

                                    `
                                    : `

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


/* =====================================================
   LEARNING GAMES
   ===================================================== */

window.selectLearningDifficulty = function (level) {

    const message =
        el("learningDifficultyMessage");

    if (!message) {
        return;
    }

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

    if (
        !message ||
        !message.textContent.includes("selected")
    ) {

        alert(
            "Please select a difficulty first."
        );

        return;
    }

    location.href =
        `learning-games/${game}/index.html`;
};


/* =====================================================
   MOTIVATIONAL SHAYARI
   ===================================================== */

const shayaris = [

    "मेहनत इतनी खामोशी से करो, कि सफलता शोर मचा दे। 🚀",

    "आज की मेहनत ही कल की पहचान बनेगी। 💪",

    "छोटे कदम भी एक दिन बड़ी मंजिल तक ले जाते हैं। 🌟",

    "सीखते रहो, बढ़ते रहो और कभी हार मत मानो। 🔥",

    "हार मत मानो, शुरुआत छोटी हो सकती है, मंजिल बड़ी हो सकती है। 🏆",

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

    const text =
        el("shayariText");

    if (text) {
        text.textContent =
            shayaris[random];
    }
};


/* =====================================================
   RESUME BUILDER
   ===================================================== */

window.generateResume = function () {

    const name =
        el("resumeName")?.value.trim();

    const email =
        el("resumeEmail")?.value.trim();

    const education =
        el("resumeEducation")?.value.trim();

    if (!name || !email || !education) {

        alert(
            "Please fill Name, Email and Education."
        );

        return;
    }

    const output =
        el("resumeOutput");

    if (!output) {
        return;
    }

    output.innerHTML = `

        <h1>${name}</h1>

        <p>
            <strong>Email:</strong>
            ${email}
        </p>

        <p>
            <strong>Phone:</strong>
            ${el("resumePhone")?.value || ""}
        </p>

        <hr>

        <h3>About Me</h3>

        <p>
            ${el("resumeAbout")?.value || ""}
        </p>

        <h3>Education</h3>

        <p>
            ${education}
        </p>

        <h3>Skills</h3>

        <p>
            ${el("resumeSkills")?.value || ""}
        </p>

        <br>

        <button onclick="window.print()">
            Print / Save Resume
        </button>

    `;

    output.classList.remove("hidden");
};


/* =====================================================
   REFER & EARN
   ===================================================== */

function generateReferralCode(email) {

    const code =
        "SKILLUP" +
        (
            email
                ? email.substring(0, 4).toUpperCase()
                : ""
        );

    const referral =
        el("referralCode");

    if (referral) {
        referral.textContent = code;
    }
}


window.copyReferral = function () {

    const referral =
        el("referralCode");

    const message =
        el("copyMessage");

    if (!referral) {
        return;
    }

    navigator.clipboard
        .writeText(
            referral.textContent
        )
        .then(function () {

            if (message) {

                message.textContent =
                    "✅ Referral code copied!";
            }

        })
        .catch(function () {

            alert(
                "Unable to copy referral code."
            );
        });
};


function getReferralLink() {

    const referral =
        el("referralCode");

    return (
        location.origin +
        location.pathname +
        "?ref=" +
        (referral?.textContent || "")
    );
}


window.copyReferralLink = function () {

    navigator.clipboard
        .writeText(
            getReferralLink()
        )
        .then(function () {

            const message =
                el("shareMessage");

            if (message) {

                message.textContent =
                    "✅ Referral link copied!";
            }

        });
};


window.shareReferral = async function () {

    const link =
        getReferralLink();

    if (navigator.share) {

        try {

            await navigator.share({

                title: "Join SkillUp",

                text:
                    "Join SkillUp - Learn, Play & Grow 🚀",

                url: link

            });

        } catch (error) {

            console.log(
                "Share cancelled."
            );
        }

    } else {

        await navigator.clipboard
            .writeText(link);

        const message =
            el("shareMessage");

        if (message) {

            message.textContent =
                "✅ Link copied!";
        }
    }
};


/* =====================================================
   PDF MAKER
   ===================================================== */

window.generatePDF = function () {

    const title =
        el("pdfTitle")?.value.trim();

    const content =
        el("pdfContent")?.value.trim();

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


/* =====================================================
   DARK / LIGHT THEME
   ===================================================== */

window.toggleTheme = function () {

    document.body
        .classList
        .toggle("dark-theme");

    const dark =
        document.body
            .classList
            .contains("dark-theme");

    const button =
        el("themeButton");

    if (button) {

        button.textContent =
            dark
                ? "☀️"
                : "🌙";
    }

    localStorage.setItem(
        "skillupTheme",
        dark
            ? "dark"
            : "light"
    );
};


if (
    localStorage.getItem(
        "skillupTheme"
    ) === "dark"
) {

    document.body
        .classList
        .add("dark-theme");
}


/* =====================================================
   STARTUP
   ===================================================== */

console.log(
    "✅ SkillUp JavaScript loaded successfully."
);
/* =====================================================
   TYPING MASTER
===================================================== */

const typingTexts = [

    "Learning never stops when you keep practicing every day.",

    "Success comes from consistent effort, patience and practice.",

    "Programming is not about memorizing code. It is about solving problems.",

    "Every small improvement brings you one step closer to your goal.",

    "Practice typing every day to improve your speed and accuracy.",

    "Believe in yourself, keep learning and never give up on your dreams.",

    "A good programmer learns from mistakes and keeps improving every day."

];


let typingTime = 30;
let typingTimeLeft = 30;
let typingTimerInterval = null;

let typingStarted = false;
let typingFinished = false;

let typingStartTime = null;
let typingCurrentText = "";

let typingCorrectChars = 0;
let typingWrongChars = 0;


/* =====================================================
   START TYPING TEST
===================================================== */

window.startTypingTest = function (seconds) {

    clearInterval(typingTimerInterval);

    typingTime = seconds;
    typingTimeLeft = seconds;

    typingStarted = false;
    typingFinished = false;

    typingCorrectChars = 0;
    typingWrongChars = 0;

    typingStartTime = null;

    const startScreen =
        el("typingStartScreen");

    const testScreen =
        el("typingTestScreen");

    const resultScreen =
        el("typingResultScreen");

    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    if (resultScreen) {
        resultScreen.classList.add("hidden");
    }

    if (testScreen) {
        testScreen.classList.remove("hidden");
    }


    /* Random typing text */

    typingCurrentText =
        typingTexts[
            Math.floor(
                Math.random() *
                typingTexts.length
            )
        ];


    const text =
        el("typingText");

    if (text) {
        text.textContent =
            typingCurrentText;
    }


    const input =
        el("typingInput");

    if (input) {

        input.value = "";

        input.disabled = false;

        input.focus();

        input.oninput =
            handleTypingInput;
    }


    updateTypingStats();

    const timer =
        el("typingTimer");

    if (timer) {
        timer.textContent =
            typingTimeLeft;
    }

    const message =
        el("typingMessage");

    if (message) {

        message.textContent =
            "Start typing to begin.";

    }
};


/* =====================================================
   HANDLE TYPING
===================================================== */

function handleTypingInput() {

    const input =
        el("typingInput");

    if (!input || typingFinished) {
        return;
    }


    const value =
        input.value;


    /* Start timer on first character */

    if (!typingStarted && value.length > 0) {

        typingStarted = true;

        typingStartTime =
            Date.now();

        startTypingTimer();

        const message =
            el("typingMessage");

        if (message) {

            message.textContent =
                "⌨️ Keep typing...";

        }
    }


    calculateTypingScore(value);

    updateTypingText(value);

    updateTypingStats();


    /* Finish automatically */

    if (
        value.length >=
        typingCurrentText.length
    ) {

        finishTypingTest();

    }
}


/* =====================================================
   TIMER
===================================================== */

function startTypingTimer() {

    clearInterval(typingTimerInterval);

    typingTimerInterval =
        setInterval(function () {

            typingTimeLeft--;

            const timer =
                el("typingTimer");

            if (timer) {
                timer.textContent =
                    typingTimeLeft;
            }


            updateTypingStats();


            if (typingTimeLeft <= 0) {

                finishTypingTest();

            }

        }, 1000);
}


/* =====================================================
   CALCULATE SCORE
===================================================== */

function calculateTypingScore(value) {

    let correct = 0;
    let wrong = 0;


    for (
        let i = 0;
        i < value.length;
        i++
    ) {

        if (
            value[i] ===
            typingCurrentText[i]
        ) {

            correct++;

        } else {

            wrong++;

        }
    }


    typingCorrectChars = correct;
    typingWrongChars = wrong;
}


/* =====================================================
   UPDATE TYPING TEXT
===================================================== */

function updateTypingText(value) {

    const text =
        el("typingText");

    if (!text) {
        return;
    }


    let html = "";


    for (
        let i = 0;
        i < typingCurrentText.length;
        i++
    ) {

        const character =
            typingCurrentText[i];


        if (i < value.length) {

            if (
                value[i] ===
                character
            ) {

                html +=
                    `<span class="correct">${escapeTypingHTML(character)}</span>`;

            } else {

                html +=
                    `<span class="wrong">${escapeTypingHTML(character)}</span>`;
            }

        } else {

            html +=
                escapeTypingHTML(character);

        }
    }


    text.innerHTML = html;
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeTypingHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   UPDATE STATS
===================================================== */

function updateTypingStats() {

    const elapsed =
        typingTime -
        typingTimeLeft;


    let minutes =
        elapsed / 60;


    if (minutes <= 0) {
        minutes = 1 / 60;
    }


    const wpm =
        Math.round(
            (
                typingCorrectChars / 5
            ) / minutes
        );


    const totalTyped =
        typingCorrectChars +
        typingWrongChars;


    const accuracy =
        totalTyped === 0
            ? 100
            : Math.round(
                (
                    typingCorrectChars /
                    totalTyped
                ) * 100
            );


    const wpmElement =
        el("typingWPM");

    if (wpmElement) {
        wpmElement.textContent =
            wpm;
    }


    const accuracyElement =
        el("typingAccuracy");

    if (accuracyElement) {

        accuracyElement.textContent =
            accuracy + "%";

    }


    const correctElement =
        el("typingCorrect");

    if (correctElement) {

        correctElement.textContent =
            typingCorrectChars;

    }
}


/* =====================================================
   FINISH TEST
===================================================== */

function finishTypingTest() {

    if (typingFinished) {
        return;
    }

    typingFinished = true;

    clearInterval(
        typingTimerInterval
    );


    const input =
        el("typingInput");

    if (input) {
        input.disabled = true;
    }


    const totalTyped =
        typingCorrectChars +
        typingWrongChars;


    const elapsedSeconds =
        Math.max(
            1,
            typingTime -
            typingTimeLeft
        );


    const minutes =
        elapsedSeconds / 60;


    const wpm =
        Math.round(
            (
                typingCorrectChars / 5
            ) / minutes
        );


    const accuracy =
        totalTyped === 0
            ? 0
            : Math.round(
                (
                    typingCorrectChars /
                    totalTyped
                ) * 100
            );


    /* Result values */

    const finalWPM =
        el("finalTypingWPM");

    if (finalWPM) {
        finalWPM.textContent =
            wpm;
    }


    const finalAccuracy =
        el("finalTypingAccuracy");

    if (finalAccuracy) {

        finalAccuracy.textContent =
            accuracy + "%";

    }


    const finalCorrect =
        el("finalTypingCorrect");

    if (finalCorrect) {

        finalCorrect.textContent =
            typingCorrectChars;

    }


    const finalWrong =
        el("finalTypingWrong");

    if (finalWrong) {

        finalWrong.textContent =
            typingWrongChars;

    }


    /* Performance message */

    let performance =
        "Keep practicing! 💪";


    if (
        wpm >= 50 &&
        accuracy >= 90
    ) {

        performance =
            "🔥 Excellent! You are a Typing Master!";

    } else if (
        wpm >= 35 &&
        accuracy >= 85
    ) {

        performance =
            "⭐ Great job! Your typing is improving.";

    } else if (
        wpm >= 20
    ) {

        performance =
            "👍 Good work! Keep practicing.";

    }


    const performanceElement =
        el("typingPerformance");

    if (performanceElement) {

        performanceElement.textContent =
            performance;

    }


    const testScreen =
        el("typingTestScreen");

    const resultScreen =
        el("typingResultScreen");


    if (testScreen) {
        testScreen.classList.add("hidden");
    }

    if (resultScreen) {
        resultScreen.classList.remove("hidden");
    }


    saveTypingHistory(
        wpm,
        accuracy,
        typingCorrectChars,
        typingWrongChars
    );
}


/* =====================================================
   SAVE TYPING HISTORY
===================================================== */

function saveTypingHistory(
    wpm,
    accuracy,
    correct,
    wrong
) {

    const data =
        load();


    if (!data.typingHistory) {
        data.typingHistory = [];
    }


    data.typingHistory.unshift({

        date:
            new Date().toLocaleString(),

        time:
            typingTime,

        wpm:
            wpm,

        accuracy:
            accuracy,

        correct:
            correct,

        wrong:
            wrong

    });


    data.typingHistory =
        data.typingHistory.slice(0, 20);


    save(data);

    renderTypingHistory();
}


/* =====================================================
   RENDER TYPING HISTORY
===================================================== */

function renderTypingHistory() {

    const history =
        el("typingHistory");

    if (!history) {
        return;
    }


    const data =
        load();


    if (
        !data.typingHistory ||
        !data.typingHistory.length
    ) {

        history.innerHTML =
            "No typing tests completed yet.";

        return;
    }


    history.innerHTML =
        data.typingHistory
            .map(function (item) {

                return `

                    <div class="typing-history-item">

                        📅 ${item.date}

                        <br>

                        ⏱️ ${item.time} sec

                        • ⚡ ${item.wpm} WPM

                        • 🎯 ${item.accuracy}%

                        <br>

                        ✅ Correct:
                        ${item.correct}

                        • ❌ Wrong:
                        ${item.wrong}

                    </div>

                `;

            })
            .join("");
}


/* =====================================================
   RESTART TYPING
===================================================== */

window.restartTypingTest = function () {

    const resultScreen =
        el("typingResultScreen");

    const startScreen =
        el("typingStartScreen");

    if (resultScreen) {
        resultScreen.classList.add("hidden");
    }

    if (startScreen) {
        startScreen.classList.remove("hidden");
    }

    renderTypingHistory();
};


/* =====================================================
   TYPING MASTER STARTUP
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderTypingHistory();

    }
);
// =====================================================
// PROFILE
// =====================================================

function loadProfile() {

    const savedName =
        localStorage.getItem("skillupUserName") || "Student";

    const savedEmail =
        localStorage.getItem("skillupUserEmail") || "student@email.com";


    // Name & Email
    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");


    if (profileName) {
        profileName.innerText = savedName;
    }

    if (profileEmail) {
        profileEmail.innerText = savedEmail;
    }


    // Typing Tests
    let typingHistory = [];

    try {
        typingHistory =
            JSON.parse(
                localStorage.getItem("typingHistory") || "[]"
            );
    } catch (error) {
        typingHistory = [];
    }


    const typingCount =
        document.getElementById("profileTyping");

    if (typingCount) {
        typingCount.innerText = typingHistory.length;
    }


    // Courses
    let courseHistory = [];

    try {
        courseHistory =
            JSON.parse(
                localStorage.getItem("courseHistory") || "[]"
            );
    } catch (error) {
        courseHistory = [];
    }


    const courses =
        document.getElementById("profileCourses");

    if (courses) {
        courses.innerText = courseHistory.length;
    }


    // Quiz Count
    const quizCount =
        document.getElementById("profileQuizzes");

    const savedQuizCount =
        Number(
            localStorage.getItem("skillupQuizCount") || 0
        );

    if (quizCount) {
        quizCount.innerText = savedQuizCount;
    }


    // Certificates
    const certificateCount =
        document.getElementById("profileCertificates");

    const savedCertificates =
        Number(
            localStorage.getItem("skillupCertificates") || 0
        );

    if (certificateCount) {
        certificateCount.innerText =
            savedCertificates;
    }


    // =================================================
    // PROFILE PROGRESS
    // =================================================

    let progress = 0;

    if (courseHistory.length > 0) {
        progress += 25;
    }

    if (savedQuizCount > 0) {
        progress += 25;
    }

    if (typingHistory.length > 0) {
        progress += 25;
    }

    if (savedCertificates > 0) {
        progress += 25;
    }


    const progressBar =
        document.getElementById(
            "profileProgressBar"
        );

    const progressText =
        document.getElementById(
            "profileProgressText"
        );


    if (progressBar) {
        progressBar.style.width =
            progress + "%";
    }


    if (progressText) {
        progressText.innerText =
            "Progress: " + progress + "%";
    }

}


// =====================================================
// SHOW PROFILE
// =====================================================

function showProfile() {

    showSection("profile");

    loadProfile();

}


// =====================================================
// LOAD PROFILE WHEN APP OPENS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

    }
);
// =====================================================
// PROFILE SYSTEM
// =====================================================

function saveProfile() {

    const profile = {

        name: document.getElementById("profileName").value,
        email: document.getElementById("profileEmail").value,
        phone: document.getElementById("profilePhone").value,
        whatsapp: document.getElementById("profileWhatsapp").value,
        college: document.getElementById("profileCollege").value,
        course: document.getElementById("profileCourse").value,
        year: document.getElementById("profileYear").value,
        city: document.getElementById("profileCity").value,
        skills: document.getElementById("profileSkills").value,
        about: document.getElementById("profileAbout").value

    };

    localStorage.setItem(
        "skillupProfile",
        JSON.stringify(profile)
    );

    updateProfilePreview();

    const message =
        document.getElementById("profileMessage");

    message.textContent =
        "✅ Profile saved successfully!";

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}
//=================== LOAD PROFILE=========================
// ====================================================={
 {

    const savedProfile =
        localStorage.getItem("skillupProfile");

    if (!savedProfile) {
        updateProfilePreview();

    }

    const profile =
        JSON.parse(savedProfile);

    document.getElementById("profileName").value =
        profile.name || "";

    document.getElementById("profileEmail").value =
        profile.email || "";

    document.getElementById("profilePhone").value =
        profile.phone || "";

    document.getElementById("profileWhatsapp").value =
        profile.whatsapp || "";

    document.getElementById("profileCollege").value =
        profile.college || "";

    document.getElementById("profileCourse").value =
        profile.course || "";

    document.getElementById("profileYear").value =
        profile.year || "";

    document.getElementById("profileCity").value =
        profile.city || "";

    document.getElementById("profileSkills").value =
        profile.skills || "";

    document.getElementById("profileAbout").value =
        profile.about || "";

    updateProfilePreview();
}


// =====================================================
// PROFILE PREVIEW
// =====================================================

function updateProfilePreview() {

    const getValue = (id) => {

        const element =
            document.getElementById(id);

        if (!element) return "";

        return element.value.trim();

    };


    const name = getValue("profileName");
    const email = getValue("profileEmail");
    const phone = getValue("profilePhone");
    const whatsapp = getValue("profileWhatsapp");
    const college = getValue("profileCollege");
    const course = getValue("profileCourse");
    const year = getValue("profileYear");
    const city = getValue("profileCity");
    const skills = getValue("profileSkills");
    const about = getValue("profileAbout");


    document.getElementById("previewName").textContent =
        name || "Your Name";

    document.getElementById("previewCourse").textContent =
        course || "Your Course";

    document.getElementById("previewEmail").textContent =
        email || "Not Added";

    document.getElementById("previewPhone").textContent =
        phone || "Not Added";

    document.getElementById("previewWhatsapp").textContent =
        whatsapp || "Not Added";

    document.getElementById("previewCollege").textContent =
        college || "Not Added";

    document.getElementById("previewYear").textContent =
        year || "Not Added";

    document.getElementById("previewCity").textContent =
        city || "Not Added";

    document.getElementById("previewSkills").textContent =
        skills || "No skills added yet.";

    document.getElementById("previewAbout").textContent =
        about || "No information added yet.";
}


// =====================================================
// LOAD PROFILE WHEN WEBSITE OPENS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

});
