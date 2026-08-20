/* =========================================================
   SKILLUP - COMPLETE JAVASCRIPT
   Learn • Play • Grow
========================================================= */

"use strict";

/* =========================================================
   BASIC HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "skillup_final_v1";

const safeJSON = (value, fallback = {}) => {
    try {
        return JSON.parse(value) || fallback;
    } catch {
        return fallback;
    }
};


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultData = {
    profile: {
        name: "Hariom",
        email: "learner@skillup.com",
        phone: "",
        year: "",
        course: ""
    },

    stats: {
        testsCompleted: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        achievements: 0
    },

    referralCount: 0,

    certificate: {
        unlocked: false,
        test: "",
        score: 0,
        accuracy: 0,
        medal: ""
    }
};


let appData = {
    ...defaultData,
    ...safeJSON(localStorage.getItem(STORAGE_KEY), {})
};

appData.profile = {
    ...defaultData.profile,
    ...(appData.profile || {})
};

appData.stats = {
    ...defaultData.stats,
    ...(appData.stats || {})
};

appData.certificate = {
    ...defaultData.certificate,
    ...(appData.certificate || {})
};


/* =========================================================
   SAVE DATA
========================================================= */

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

    const toast = $("toast");
    const toastMessage = $("toastMessage");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll("[data-page]");

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const target = $(pageId);

    if (!target) return;

    target.classList.add("active-page");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.page === pageId
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageId = button.dataset.page;

        if (pageId) {
            showPage(pageId);
        }

    });

});


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const stats = appData.stats;

    if ($("testsCompleted"))
        $("testsCompleted").textContent = stats.testsCompleted;

    if ($("bestWpm"))
        $("bestWpm").textContent = stats.bestWpm;

    if ($("bestAccuracy"))
        $("bestAccuracy").textContent =
            `${Math.round(stats.bestAccuracy)}%`;

    if ($("achievementCount"))
        $("achievementCount").textContent =
            stats.achievements;

    if ($("profileTests"))
        $("profileTests").textContent =
            stats.testsCompleted;

    if ($("profileWpm"))
        $("profileWpm").textContent =
            stats.bestWpm;

    if ($("profileAccuracy"))
        $("profileAccuracy").textContent =
            `${Math.round(stats.bestAccuracy)}%`;

    if ($("profileAchievements"))
        $("profileAchievements").textContent =
            stats.achievements;

    const progress =
        Math.min(stats.testsCompleted * 10, 100);

    if ($("homeProgressBar"))
        $("homeProgressBar").style.width =
            `${progress}%`;

    if ($("homeProgressText"))
        $("homeProgressText").textContent =
            `${progress}%`;

}


function updateHeaderProfile() {

    const name =
        appData.profile.name || "Hariom";

    const initial =
        name.trim().charAt(0).toUpperCase() || "H";

    if ($("headerInitial"))
        $("headerInitial").textContent = initial;

    if ($("profileAvatar"))
        $("profileAvatar").textContent = initial;

    if ($("profileDisplayName"))
        $("profileDisplayName").textContent = name;

    if ($("profileDisplayEmail"))
        $("profileDisplayEmail").textContent =
            appData.profile.email || "learner@skillup.com";

}


function updateAllUI() {

    updateDashboard();
    updateHeaderProfile();
    loadProfile();
}


/* =========================================================
   PROFILE
========================================================= */

function loadProfile() {

    if (!$("profileName")) return;

    $("profileName").value =
        appData.profile.name || "";

    $("profileEmail").value =
        appData.profile.email || "";

    $("profilePhone").value =
        appData.profile.phone || "";

    $("profileYear").value =
        appData.profile.year || "";

    $("profileCourse").value =
        appData.profile.course || "";
}


$("profileForm")?.addEventListener("submit", (event) => {

    event.preventDefault();

    appData.profile.name =
        $("profileName").value.trim() || "Hariom";

    appData.profile.email =
        $("profileEmail").value.trim() ||
        "learner@skillup.com";

    appData.profile.phone =
        $("profilePhone").value.trim();

    appData.profile.year =
        $("profileYear").value;

    appData.profile.course =
        $("profileCourse").value.trim();

    saveData();

    updateAllUI();

    showToast("Profile saved successfully!");

});


/* =========================================================
   MEDAL SYSTEM
========================================================= */

function getMedal(score) {

    if (score >= 85) {
        return {
            name: "Gold",
            icon: "🥇"
        };
    }

    if (score >= 60) {
        return {
            name: "Silver",
            icon: "🥈"
        };
    }

    return {
        name: "Bronze",
        icon: "🥉"
    };
}


/* =========================================================
   RECORD TEST
========================================================= */

function recordTest() {

    appData.stats.testsCompleted++;

    saveData();

    updateDashboard();

}


/* =========================================================
   RECORD ACHIEVEMENT
========================================================= */

function recordAchievement() {

    appData.stats.achievements++;

    saveData();

    updateDashboard();

}


/* =========================================================
   CERTIFICATE SYSTEM
========================================================= */

/*
    IMPORTANT:

    Certificate is unlocked ONLY after a test is completed.
*/

function unlockCertificate(testName, score, accuracy) {

    const medal = getMedal(score);

    appData.certificate = {
        unlocked: true,
        test: testName,
        score: Math.round(score),
        accuracy: Math.round(accuracy),
        medal: medal.name
    };

    saveData();

    updateCertificate();

}


function updateCertificate() {

    const certificate =
        appData.certificate;

    if (!$("certificateLocked") ||
        !$("certificateContainer")) {
        return;
    }

    if (!certificate.unlocked) {

        $("certificateLocked")
            .classList.remove("hidden");

        $("certificateContainer")
            .classList.add("hidden");

        return;
    }


    $("certificateLocked")
        .classList.add("hidden");

    $("certificateContainer")
        .classList.remove("hidden");


    $("certificateName").textContent =
        appData.profile.name || "Hariom";

    $("certificateTest").textContent =
        certificate.test || "SkillUp Achievement";

    $("certificateScore").textContent =
        certificate.score;

    $("certificateAccuracy").textContent =
        `${certificate.accuracy}%`;

    $("certificateMedal").textContent =
        certificate.medal || "Bronze";

}


$("typingCertificateBtn")?.addEventListener(
    "click",
    () => {

        /*
            EXTRA SAFETY CHECK:
            Button cannot create a certificate
            unless certificate has been unlocked.
        */

        if (!appData.certificate.unlocked) {

            showToast(
                "Complete the test first!"
            );

            return;
        }

        updateCertificate();

        showPage("certificatePage");

    }
);


$("printCertificateBtn")?.addEventListener(
    "click",
    () => {

        if (!appData.certificate.unlocked) {

            showToast(
                "Certificate is locked."
            );

            return;
        }

        window.print();

    }
);


/* =========================================================
   TYPING TEST
========================================================= */

const typingTexts = {

    easy: [
        "Learning is a journey that becomes easier when we practice every day. Small steps can create big improvements.",
        "Typing is a useful skill for students. Practice regularly and try to type each sentence clearly and correctly.",
        "SkillUp helps learners practice new skills through simple tests, games and challenges."
    ],

    medium: [
        "Technology is changing the way students learn and communicate. Developing practical skills can help students become more confident.",
        "Consistent practice is more important than trying to become perfect in one day. Focus on accuracy first and speed will improve naturally.",
        "Good learning habits include regular practice, curiosity, patience and the willingness to learn from mistakes."
    ],

    hard: [
        "Information technology combines creativity, problem solving and logical thinking. A strong foundation allows learners to understand complex systems.",
        "Successful learning requires discipline, experimentation and continuous improvement. Mistakes should be treated as opportunities to understand a concept better.",
        "Programming teaches us how to break a difficult problem into smaller logical steps and then create a solution using precise instructions."
    ]

};


let typingState = {

    difficulty: "easy",

    text: "",

    started: false,

    finished: false,

    startTime: 0,

    elapsed: 0,

    timer: null

};


function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function createTypingTest() {

    clearInterval(typingState.timer);

    typingState.started = false;
    typingState.finished = false;
    typingState.startTime = 0;
    typingState.elapsed = 0;

    typingState.text =
        randomItem(
            typingTexts[
                typingState.difficulty
            ]
        );


    if ($("typingText"))
        $("typingText").textContent =
            typingState.text;

    if ($("typingInput")) {

        $("typingInput").value = "";

        $("typingInput").disabled = true;

    }


    if ($("typingTime"))
        $("typingTime").textContent = "0s";

    if ($("typingWpm"))
        $("typingWpm").textContent = "0";

    if ($("typingAccuracy"))
        $("typingAccuracy").textContent = "100%";

    if ($("typingCorrect"))
        $("typingCorrect").textContent = "0";

    if ($("typingWrong"))
        $("typingWrong").textContent = "0";


    if ($("typingResult"))
        $("typingResult").classList.add("hidden");


    if ($("typingCertificateBtn"))
        $("typingCertificateBtn").disabled = true;


    if ($("typingDifficultyLabel"))
        $("typingDifficultyLabel").textContent =
            typingState.difficulty
                .charAt(0)
                .toUpperCase() +
            typingState.difficulty.slice(1);

}


function calculateTypingStats() {

    const input =
        $("typingInput")?.value || "";

    let correct = 0;
    let wrong = 0;

    for (
        let i = 0;
        i < input.length;
        i++
    ) {

        if (
            i < typingState.text.length &&
            input[i] === typingState.text[i]
        ) {
            correct++;
        } else {
            wrong++;
        }

    }


    const totalTyped =
        correct + wrong;

    const accuracy =
        totalTyped > 0
            ? (correct / totalTyped) * 100
            : 100;


    const minutes =
        Math.max(
            typingState.elapsed / 60000,
            1 / 60000
        );


    const wpm =
        Math.round(
            (correct / 5) / minutes
        );


    if ($("typingCorrect"))
        $("typingCorrect").textContent =
            correct;

    if ($("typingWrong"))
        $("typingWrong").textContent =
            wrong;

    if ($("typingAccuracy"))
        $("typingAccuracy").textContent =
            `${Math.round(accuracy)}%`;

    if ($("typingWpm"))
        $("typingWpm").textContent =
            Math.max(wpm, 0);

    return {
        correct,
        wrong,
        accuracy,
        wpm
    };

}


function startTypingTest() {

    if (typingState.started) return;

    typingState.started = true;
    typingState.finished = false;

    typingState.startTime =
        Date.now();

    typingState.elapsed = 0;


    if ($("typingInput")) {

        $("typingInput").disabled = false;

        $("typingInput").focus();

    }


    typingState.timer =
        setInterval(() => {

            typingState.elapsed =
                Date.now() -
                typingState.startTime;

            const seconds =
                Math.floor(
                    typingState.elapsed / 1000
                );

            if ($("typingTime"))
                $("typingTime").textContent =
                    `${seconds}s`;

            calculateTypingStats();

        }, 250);

}


function finishTypingTest() {

    if (!typingState.started ||
        typingState.finished) {
        return;
    }

    typingState.finished = true;

    typingState.elapsed =
        Date.now() -
        typingState.startTime;

    clearInterval(typingState.timer);


    const stats =
        calculateTypingStats();


    if ($("typingInput"))
        $("typingInput").disabled = true;


    /*
        SCORE:
        WPM contributes 60%
        Accuracy contributes 40%
    */

    const speedScore =
        Math.min(stats.wpm / 60, 1) * 60;

    const accuracyScore =
        stats.accuracy * 0.4;

    const totalScore =
        Math.min(
            100,
            speedScore + accuracyScore
        );


    const medal =
        getMedal(totalScore);


    if ($("finalWpm"))
        $("finalWpm").textContent =
            stats.wpm;

    if ($("finalAccuracy"))
        $("finalAccuracy").textContent =
            `${Math.round(stats.accuracy)}%`;

    if ($("finalCorrect"))
        $("finalCorrect").textContent =
            stats.correct;

    if ($("finalWrong"))
        $("finalWrong").textContent =
            stats.wrong;

    if ($("typingMedal"))
        $("typingMedal").textContent =
            medal.icon;

    if ($("typingResultTitle"))
        $("typingResultTitle").textContent =
            `Typing Complete — ${medal.name}`;

    if ($("typingResultMessage"))
        $("typingResultMessage").textContent =
            `You scored ${Math.round(totalScore)}/100 with ${Math.round(stats.accuracy)}% accuracy.`;


    if ($("typingResult"))
        $("typingResult").classList.remove("hidden");


    /*
        Update best stats.
    */

    appData.stats.bestWpm =
        Math.max(
            appData.stats.bestWpm,
            stats.wpm
        );

    appData.stats.bestAccuracy =
        Math.max(
            appData.stats.bestAccuracy,
            stats.accuracy
        );


    recordTest();

    /*
        Certificate unlock happens ONLY here.
    */

    unlockCertificate(
        "SkillUp Typing Test",
        totalScore,
        stats.accuracy
    );


    if ($("typingCertificateBtn"))
        $("typingCertificateBtn").disabled = false;


    showToast(
        `Test complete! ${medal.icon} ${medal.name}`
    );

}


/* =========================================================
   TYPING INPUT EVENTS
========================================================= */

$("typingInput")?.addEventListener(
    "input",
    () => {

        if (!typingState.started) {

            startTypingTest();

        }


        const input =
            $("typingInput").value;

        /*
            Prevent typing beyond passage length.
        */

        if (
            input.length >=
            typingState.text.length
        ) {

            $("typingInput").value =
                input.slice(
                    0,
                    typingState.text.length
                );

            calculateTypingStats();

            finishTypingTest();

        } else {

            calculateTypingStats();

        }

    }
);


$("startTypingBtn")?.addEventListener(
    "click",
    () => {

        startTypingTest();

        showToast("Typing test started!");

    }
);


$("newTypingTestBtn")?.addEventListener(
    "click",
    () => {

        createTypingTest();

        showToast("New typing test created!");

    }
);


$("typingNewTestResultBtn")?.addEventListener(
    "click",
    () => {

        createTypingTest();

        showToast("New typing test ready!");

    }
);


/* =========================================================
   TYPING DIFFICULTY
========================================================= */

document
    .querySelectorAll(
        "[data-difficulty]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        "[data-difficulty]"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");

                typingState.difficulty =
                    button.dataset.difficulty;

                createTypingTest();

            }
        );

    });


/* =========================================================
   READING TEST
========================================================= */

const readingData = {

    easy: {
        title: "The Importance of Practice",
        passage:
            "Practice helps learners improve their skills. When we practice regularly, difficult tasks become easier and we become more confident.",
        questions: [
            {
                question:
                    "What helps learners improve?",
                options: [
                    "Practice",
                    "Sleeping",
                    "Ignoring work",
                    "Avoiding mistakes"
                ],
                answer: 0
            },
            {
                question:
                    "What happens with regular practice?",
                options: [
                    "Tasks become easier",
                    "Learning stops",
                    "Skills disappear",
                    "Nothing changes"
                ],
                answer: 0
            }
        ]
    },

    medium: {
        title: "Technology and Education",
        passage:
            "Technology has changed education by making information easier to access. Digital tools can help students practice concepts, communicate with teachers and explore new subjects.",
        questions: [
            {
                question:
                    "How has technology changed education?",
                options: [
                    "Information is easier to access",
                    "Books disappeared",
                    "Students stopped learning",
                    "Schools closed"
                ],
                answer: 0
            },
            {
                question:
                    "What can digital tools help students do?",
                options: [
                    "Practice concepts",
                    "Avoid education",
                    "Stop communication",
                    "Forget subjects"
                ],
                answer: 0
            }
        ]
    },

    hard: {
        title: "Problem Solving",
        passage:
            "Problem solving involves understanding a problem, breaking it into smaller parts and developing a logical solution. This approach is useful in programming, mathematics and everyday decision making.",
        questions: [
            {
                question:
                    "What is an important part of problem solving?",
                options: [
                    "Breaking the problem into smaller parts",
                    "Ignoring the problem",
                    "Guessing randomly",
                    "Avoiding logic"
                ],
                answer: 0
            },
            {
                question:
                    "Where can problem solving be useful?",
                options: [
                    "Programming and mathematics",
                    "Only games",
                    "Only sports",
                    "Nowhere"
                ],
                answer: 0
            }
        ]
    }

};


let readingDifficulty = "easy";


document
    .querySelectorAll(
        "[data-reading-difficulty]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        "[data-reading-difficulty]"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");

                readingDifficulty =
                    button.dataset.readingDifficulty;

            }
        );

    });


function loadReadingTest() {

    const data =
        readingData[readingDifficulty];

    if (!data) return;

    $("readingTitle").textContent =
        data.title;

    $("readingPassage").textContent =
        data.passage;

    $("readingQuestions").innerHTML =
        data.questions
            .map((item, index) => {

                return `
                    <div class="question-card"
                         data-question="${index}">

                        <h3>
                            ${index + 1}. ${item.question}
                        </h3>

                        ${item.options
                            .map(
                                (option, optionIndex) => `
                                    <button
                                        class="question-option"
                                        data-option="${optionIndex}">
                                        ${option}
                                    </button>
                                `
                            )
                            .join("")}

                    </div>
                `;

            })
            .join("");


    document
        .querySelectorAll(
            "#readingQuestions .question-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const parent =
                        button.closest(
                            ".question-card"
                        );

                    parent
                        .querySelectorAll(
                            ".question-option"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );

                    button.classList.add(
                        "selected"
                    );

                }
            );

        });


    $("submitReadingBtn")
        .classList.remove("hidden");

}


$("startReadingBtn")?.addEventListener(
    "click",
    () => {

        loadReadingTest();

        showToast(
            "Reading test started!"
        );

    }
);


$("submitReadingBtn")?.addEventListener(
    "click",
    () => {

        const data =
            readingData[readingDifficulty];

        if (!data) return;


        let score = 0;


        data.questions.forEach(
            (item, index) => {

                const card =
                    document.querySelector(
                        `[data-question="${index}"]`
                    );

                const selected =
                    card?.querySelector(
                        ".question-option.selected"
                    );

                if (
                    selected &&
                    Number(
                        selected.dataset.option
                    ) === item.answer
                ) {
                    score++;
                }

            }
        );


        const accuracy =
            (score / data.questions.length) * 100;

        const medal =
            getMedal(accuracy);


        $("readingScore").textContent =
            `${score}/${data.questions.length}`;

        $("readingAccuracy").textContent =
            `${Math.round(accuracy)}%`;

        $("readingMedal").textContent =
            medal.icon;

        $("readingResultMessage").textContent =
            `You earned ${medal.name} with ${Math.round(accuracy)}% accuracy.`;


        $("readingResult")
            .classList.remove("hidden");


        recordTest();


        unlockCertificate(
            "SkillUp Reading Test",
            accuracy,
            accuracy
        );


        showToast(
            `Reading complete! ${medal.icon}`
        );

    }
);


/* =========================================================
   BRAIN CHALLENGE
========================================================= */

const brainQuestions = [
    {
        question:
            "What number comes next? 2, 4, 6, 8, ?",
        options: ["9", "10", "11", "12"],
        answer: 1
    },
    {
        question:
            "Which one is different?",
        options: [
            "Apple",
            "Mango",
            "Carrot",
            "Banana"
        ],
        answer: 2
    },
    {
        question:
            "If 5 + 5 = 10, what is 10 + 10?",
        options: ["15", "20", "25", "30"],
        answer: 1
    },
    {
        question:
            "Which shape has three sides?",
        options: [
            "Circle",
            "Square",
            "Triangle",
            "Rectangle"
        ],
        answer: 2
    }
];


let brainIndex = 0;
let brainScore = 0;
let brainRunning = false;
let brainTimerValue = 30;
let brainTimer = null;


function loadBrainQuestion() {

    const item =
        brainQuestions[brainIndex];

    if (!item) {

        finishBrain();

        return;

    }


    $("brainQuestionNumber").textContent =
        `Question ${brainIndex + 1}`;

    $("brainQuestion").textContent =
        item.question;


    $("brainOptions").innerHTML =
        item.options
            .map(
                (option, index) => `
                    <button
                        class="option-btn"
                        data-brain-option="${index}">
                        ${option}
                    </button>
                `
            )
            .join("");


    document
        .querySelectorAll(
            "[data-brain-option]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (!brainRunning) return;

                    const selected =
                        Number(
                            button.dataset.brainOption
                        );

                    if (
                        selected ===
                        item.answer
                    ) {

                        brainScore++;

                        button.classList.add(
                            "correct"
                        );

                    } else {

                        button.classList.add(
                            "wrong"
                        );

                    }


                    document
                        .querySelectorAll(
                            "[data-brain-option]"
                        )
                        .forEach(btn =>
                            btn.disabled = true
                        );


                    setTimeout(() => {

                        brainIndex++;

                        loadBrainQuestion();

                    }, 450);

                }
            );

        });

}


function finishBrain() {

    clearInterval(brainTimer);

    brainRunning = false;

    const accuracy =
        (brainScore / brainQuestions.length) * 100;

    const medal =
        getMedal(accuracy);


    $("brainMedal").textContent =
        medal.icon;

    $("brainScore").textContent =
        `${brainScore}/${brainQuestions.length}`;

    $("brainAccuracy").textContent =
        `${Math.round(accuracy)}%`;

    $("brainResultMessage").textContent =
        `You achieved ${medal.name} performance.`;


    $("brainResult")
        .classList.remove("hidden");


    recordTest();


    unlockCertificate(
        "SkillUp Brain Challenge",
        accuracy,
        accuracy
    );

}


$("startBrainBtn")?.addEventListener(
    "click",
    () => {

        brainIndex = 0;
        brainScore = 0;
        brainRunning = true;
        brainTimerValue = 30;


        $("brainResult")
            .classList.add("hidden");


        $("startBrainBtn")
            .classList.add("hidden");


        loadBrainQuestion();


        clearInterval(brainTimer);

        brainTimer =
            setInterval(() => {

                brainTimerValue--;

                $("brainTimer").textContent =
                    `${brainTimerValue}s`;


                if (brainTimerValue <= 0) {

                    finishBrain();

                    $("startBrainBtn")
                        .classList.remove("hidden");

                }

            }, 1000);

    }
);


/* =========================================================
   CODING QUIZ
========================================================= */

const quizData = {

    C: [
        {
            question:
                "Which symbol is used to end a statement in C?",
            options: [";", ":", ".", ","],
            answer: 0
        },
        {
            question:
                "Which function is the starting point of a C program?",
            options: [
                "start()",
                "main()",
                "run()",
                "begin()"
            ],
            answer: 1
        },
        {
            question:
                "Which data type stores an integer?",
            options: [
                "float",
                "char",
                "int",
                "double"
            ],
            answer: 2
        }
    ],

    "C++": [
        {
            question:
                "Which extension is commonly used for C++ source files?",
            options: [
                ".html",
                ".cpp",
                ".py",
                ".java"
            ],
            answer: 1
        },
        {
            question:
                "Which concept allows a class to inherit another class?",
            options: [
                "Inheritance",
                "Looping",
                "Casting",
                "Compilation"
            ],
            answer: 0
        },
        {
            question:
                "Which operator is used for stream insertion with cout?",
            options: [
                "<<",
                ">>",
                "==",
                "&&"
            ],
            answer: 0
        }
    ],

    Java: [
        {
            question:
                "Which keyword is used to create a class in Java?",
            options: [
                "class",
                "define",
                "struct",
                "object"
            ],
            answer: 0
        },
        {
            question:
                "Which method is the usual entry point of a Java application?",
            options: [
                "start()",
                "main()",
                "run()",
                "execute()"
            ],
            answer: 1
        },
        {
            question:
                "Which keyword creates an object?",
            options: [
                "new",
                "create",
                "object",
                "make"
            ],
            answer: 0
        }
    ],

    Python: [
        {
            question:
                "Which function displays output in Python?",
            options: [
                "echo()",
                "print()",
                "show()",
                "displayText()"
            ],
            answer: 1
        },
        {
            question:
                "Which symbol starts a comment in Python?",
            options: [
                "//",
                "/*",
                "#",
                "--"
            ],
            answer: 2
        },
        {
            question:
                "Which keyword defines a function in Python?",
            options: [
                "function",
                "def",
                "fun",
                "define"
            ],
            answer: 1
        }
    ]

};


let selectedLanguage = "C";
let quizIndex = 0;
let quizScore = 0;
let quizRunning = false;


document
    .querySelectorAll(".language-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".language-btn")
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");

                selectedLanguage =
                    button.dataset.language;

                resetQuiz();

            }
        );

    });


function resetQuiz() {

    quizIndex = 0;
    quizScore = 0;
    quizRunning = false;

    $("quizScore").textContent =
        "Score: 0";

    $("quizQuestion").textContent =
        `Press Start to begin ${selectedLanguage} Quiz.`;

    $("quizOptions").innerHTML = "";

    $("startQuizBtn")
        .classList.remove("hidden");

    $("nextQuizBtn")
        .classList.add("hidden");

    $("quizResult")
        .classList.add("hidden");

}


function loadQuizQuestion() {

    const questions =
        quizData[selectedLanguage];

    if (
        !questions ||
        quizIndex >= questions.length
    ) {

        finishQuiz();

        return;

    }


    const item =
        questions[quizIndex];


    $("quizQuestionNumber").textContent =
        `Question ${quizIndex + 1}/${questions.length}`;

    $("quizScore").textContent =
        `Score: ${quizScore}`;


    $("quizQuestion").textContent =
        item.question;


    $("quizOptions").innerHTML =
        item.options
            .map(
                (option, index) => `
                    <button
                        class="option-btn"
                        data-quiz-option="${index}">
                        ${option}
                    </button>
                `
            )
            .join("");


    document
        .querySelectorAll(
            "[data-quiz-option]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (!quizRunning) return;

                    const selected =
                        Number(
                            button.dataset.quizOption
                        );


                    if (
                        selected ===
                        item.answer
                    ) {

                        quizScore++;

                        button.classList.add(
                            "correct"
                        );

                    } else {

                        button.classList.add(
                            "wrong"
                        );

                        const correctButton =
                            document.querySelector(
                                `[data-quiz-option="${item.answer}"]`
                            );

                        correctButton?.classList.add(
                            "correct"
                        );

                    }


                    document
                        .querySelectorAll(
                            "[data-quiz-option]"
                        )
                        .forEach(btn =>
                            btn.disabled = true
                        );


                    $("nextQuizBtn")
                        .classList.remove("hidden");

                }
            );

        });

}


function finishQuiz() {

    quizRunning = false;

    const questions =
        quizData[selectedLanguage];

    const accuracy =
        (quizScore / questions.length) * 100;

    const medal =
        getMedal(accuracy);


    $("quizMedal").textContent =
        medal.icon;

    $("quizFinalScore").textContent =
        `${quizScore}/${questions.length}`;

    $("quizFinalAccuracy").textContent =
        `${Math.round(accuracy)}%`;

    $("quizResultMessage").textContent =
        `${selectedLanguage} Quiz completed with ${medal.name} performance.`;


    $("quizResult")
        .classList.remove("hidden");


    recordTest();


    unlockCertificate(
        `${selectedLanguage} Coding Quiz`,
        accuracy,
        accuracy
    );

}


$("startQuizBtn")?.addEventListener(
    "click",
    () => {

        quizIndex = 0;
        quizScore = 0;
        quizRunning = true;

        $("quizResult")
            .classList.add("hidden");

        $("startQuizBtn")
            .classList.add("hidden");

        $("nextQuizBtn")
            .classList.add("hidden");

        loadQuizQuestion();

    }
);


$("nextQuizBtn")?.addEventListener(
    "click",
    () => {

        quizIndex++;

        $("nextQuizBtn")
            .classList.add("hidden");

        loadQuizQuestion();

    }
);


/* =========================================================
   GK MASTER
========================================================= */

const gkQuestions = [
    {
        question:
            "What is the capital of India?",
        options: [
            "Mumbai",
            "New Delhi",
            "Kolkata",
            "Chennai"
        ],
        answer: 1
    },
    {
        question:
            "Which planet is known as the Red Planet?",
        options: [
            "Earth",
            "Mars",
            "Venus",
            "Jupiter"
        ],
        answer: 1
    },
    {
        question:
            "How many days are there in a leap year?",
        options: [
            "365",
            "366",
            "364",
            "360"
        ],
        answer: 1
    },
    {
        question:
            "Which is the largest ocean?",
        options: [
            "Atlantic",
            "Indian",
            "Pacific",
            "Arctic"
        ],
        answer: 2
    }
];


let gkIndex = 0;
let gkScore = 0;
let gkRunning = false;


function loadGkQuestion() {

    const item =
        gkQuestions[gkIndex];

    if (!item) {

        finishGk();

        return;

    }


    $("gkQuestionNumber").textContent =
        `Question ${gkIndex + 1}/${gkQuestions.length}`;

    $("gkScore").textContent =
        `Score: ${gkScore}`;

    $("gkQuestion").textContent =
        item.question;


    $("gkOptions").innerHTML =
        item.options
            .map(
                (option, index) => `
                    <button
                        class="option-btn"
                        data-gk-option="${index}">
                        ${option}
                    </button>
                `
            )
            .join("");


    document
        .querySelectorAll(
            "[data-gk-option]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (!gkRunning) return;

                    const selected =
                        Number(
                            button.dataset.gkOption
                        );


                    if (
                        selected ===
                        item.answer
                    ) {

                        gkScore++;

                        button.classList.add(
                            "correct"
                        );

                    } else {

                        button.classList.add(
                            "wrong"
                        );

                    }


                    document
                        .querySelectorAll(
                            "[data-gk-option]"
                        )
                        .forEach(btn =>
                            btn.disabled = true
                        );


                    setTimeout(() => {

                        gkIndex++;

                        loadGkQuestion();

                    }, 450);

                }
            );

        });

}


function finishGk() {

    gkRunning = false;

    const accuracy =
        (gkScore / gkQuestions.length) * 100;

    const medal =
        getMedal(accuracy);


    $("gkMedal").textContent =
        medal.icon;

    $("gkFinalScore").textContent =
        `${gkScore}/${gkQuestions.length}`;

    $("gkFinalAccuracy").textContent =
        `${Math.round(accuracy)}%`;

    $("gkResultMessage").textContent =
        `GK Master completed with ${medal.name} performance.`;


    $("gkResult")
        .classList.remove("hidden");


    recordTest();


    unlockCertificate(
        "SkillUp GK Master",
        accuracy,
        accuracy
    );


    $("startGkBtn")
        .classList.remove("hidden");

}


$("startGkBtn")?.addEventListener(
    "click",
    () => {

        gkIndex = 0;
        gkScore = 0;
        gkRunning = true;

        $("gkResult")
            .classList.add("hidden");

        $("startGkBtn")
            .classList.add("hidden");

        loadGkQuestion();

    }
);


$("nextGkBtn")?.addEventListener(
    "click",
    () => {

        gkIndex++;

        $("nextGkBtn")
            .classList.add("hidden");

        loadGkQuestion();

    }
);


/* =========================================================
   MATH CHALLENGE
========================================================= */

let mathDifficulty = "easy";

let mathQuestionIndex = 0;
let mathScore = 0;
let mathRunning = false;
let mathCurrentAnswer = 0;

const mathTotalQuestions = 5;


function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function createMathQuestion() {

    let a;
    let b;
    let operator;

    if (mathDifficulty === "easy") {

        a = randomNumber(1, 20);
        b = randomNumber(1, 20);

        operator =
            Math.random() > 0.5
                ? "+"
                : "-";

    } else if (
        mathDifficulty === "medium"
    ) {

        a = randomNumber(10, 50);
        b = randomNumber(2, 20);

        const operators =
            ["+", "-", "*"];

        operator =
            randomItem(operators);

    } else {

        a = randomNumber(20, 100);
        b = randomNumber(2, 30);

        const operators =
            ["+", "-", "*"];

        operator =
            randomItem(operators);

    }


    if (
        operator === "-" &&
        b > a
    ) {
        [a, b] = [b, a];
    }


    if (operator === "+")
        mathCurrentAnswer = a + b;

    if (operator === "-")
        mathCurrentAnswer = a - b;

    if (operator === "*")
        mathCurrentAnswer = a * b;


    $("mathQuestion").textContent =
        `${a} ${operator} ${b} = ?`;

}


function loadNextMathQuestion() {

    if (
        mathQuestionIndex >=
        mathTotalQuestions
    ) {

        finishMath();

        return;

    }


    $("mathQuestionNumber").textContent =
        `Question ${mathQuestionIndex + 1}/${mathTotalQuestions}`;

    $("mathScore").textContent =
        `Score: ${mathScore}`;


    $("mathAnswer").value = "";

    $("mathFeedback").textContent = "";

    createMathQuestion();

}


function finishMath() {

    mathRunning = false;

    const accuracy =
        (mathScore / mathTotalQuestions) * 100;

    const medal =
        getMedal(accuracy);


    $("mathMedal").textContent =
        medal.icon;

    $("mathFinalScore").textContent =
        `${mathScore}/${mathTotalQuestions}`;

    $("mathFinalAccuracy").textContent =
        `${Math.round(accuracy)}%`;

    $("mathResultMessage").textContent =
        `Math Challenge completed with ${medal.name} performance.`;


    $("mathResult")
        .classList.remove("hidden");

    $("startMathBtn")
        .classList.remove("hidden");

    $("submitMathBtn")
        .classList.add("hidden");


    recordTest();


    unlockCertificate(
        "SkillUp Math Challenge",
        accuracy,
        accuracy
    );

}


document
    .querySelectorAll(
        "[data-math-difficulty]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        "[data-math-difficulty]"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                button.classList.add("active");

                mathDifficulty =
                    button.dataset.mathDifficulty;

            }
        );

    });


$("startMathBtn")?.addEventListener(
    "click",
    () => {

        mathQuestionIndex = 0;
        mathScore = 0;
        mathRunning = true;

        $("mathResult")
            .classList.add("hidden");

        $("startMathBtn")
            .classList.add("hidden");

        $("submitMathBtn")
            .classList.remove("hidden");

        loadNextMathQuestion();

    }
);


$("submitMathBtn")?.addEventListener(
    "click",
    () => {

        if (!mathRunning) return;

        const value =
            Number(
                $("mathAnswer").value
            );


        if (
            $("mathAnswer").value.trim() === ""
        ) {

            showToast(
                "Please enter an answer."
            );

            return;

        }


        if (value === mathCurrentAnswer) {

            mathScore++;

            $("mathFeedback").textContent =
                "✅ Correct!";

        } else {

            $("mathFeedback").textContent =
                `❌ Correct answer: ${mathCurrentAnswer}`;

        }


        mathQuestionIndex++;


        setTimeout(() => {

            loadNextMathQuestion();

        }, 600);

    }
);


/* =========================================================
   GAMES
========================================================= */

const gameModal = $("gameModal");
const gameContent = $("gameContent");


function openGame() {

    if (!gameModal) return;

    gameModal.classList.remove("hidden");

}


function closeGame() {

    if (!gameModal) return;

    gameModal.classList.add("hidden");

}


$("closeGameBtn")?.addEventListener(
    "click",
    closeGame
);


gameModal?.addEventListener(
    "click",
    (event) => {

        if (event.target === gameModal) {
            closeGame();
        }

    }
);


/* =========================================================
   X-O GAME
========================================================= */

let xoBoard = Array(9).fill("");
let xoPlayer = "X";
let xoGameOver = false;


function renderXO() {

    gameContent.innerHTML = `

        <h2>❌⭕ X-O Rush</h2>

        <p id="xoStatus">
            Your turn — X
        </p>

        <div class="game-board">

            ${xoBoard.map(
                (cell, index) => `
                    <button
                        class="game-cell"
                        data-xo="${index}">
                        ${cell}
                    </button>
                `
            ).join("")}

        </div>

        <button
            class="secondary-btn"
            id="restartXO">
            Restart
        </button>

    `;


    document
        .querySelectorAll("[data-xo]")
        .forEach(cell => {

            cell.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            cell.dataset.xo
                        );

                    playXO(index);

                }
            );

        });


    $("restartXO")?.addEventListener(
        "click",
        startXO
    );

}


function checkXOWinner() {

    const patterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];


    for (const pattern of patterns) {

        const [a, b, c] = pattern;

        if (
            xoBoard[a] &&
            xoBoard[a] === xoBoard[b] &&
            xoBoard[a] === xoBoard[c]
        ) {

            return xoBoard[a];

        }

    }


    if (
        xoBoard.every(
            cell => cell !== ""
        )
    ) {
        return "draw";
    }

    return null;

}


function computerXOMove() {

    const available =
        xoBoard
            .map((cell, index) =>
                cell === "" ? index : null
            )
            .filter(index => index !== null);


    if (!available.length) return;


    const index =
        randomItem(available);

    xoBoard[index] = "O";


    const result =
        checkXOWinner();

    if (result) {

        xoGameOver = true;

        renderXO();

        setTimeout(() => {

            $("xoStatus").textContent =
                result === "O"
                    ? "Computer wins!"
                    : "It's a draw!";

        }, 10);

        return;

    }


    xoPlayer = "X";

    renderXO();

}


function playXO(index) {

    if (
        xoGameOver ||
        xoBoard[index] !== ""
    ) return;


    xoBoard[index] = "X";


    let result =
        checkXOWinner();


    if (result) {

        xoGameOver = true;

        renderXO();

        setTimeout(() => {

            $("xoStatus").textContent =
                result === "X"
                    ? "🎉 You win!"
                    : "It's a draw!";

        }, 10);

        return;

    }


    xoPlayer = "O";

    renderXO();

    setTimeout(
        computerXOMove,
        450
    );

}


function startXO() {

    xoBoard = Array(9).fill("");
    xoPlayer = "X";
    xoGameOver = false;

    renderXO();

    openGame();

}


function startMemory() {

    const symbols = [
        "🍎",
        "🍎",
        "🚀",
        "🚀",
        "⭐",
        "⭐",
        "🎯",
        "🎯"
    ];

    symbols.sort(
        () => Math.random() - 0.5
    );


    gameContent.innerHTML = `

        <h2>🧩 Memory Match</h2>

        <p id="memoryStatus">
            Find all matching pairs.
        </p>

        <div class="memory-grid">

            ${symbols.map(
                (_, index) => `
                    <button
                        class="memory-card"
                        data-memory="${index}">
                        ?
                    </button>
                `
            ).join("")}

        </div>

        <button
            class="secondary-btn"
            id="restartMemory">
            Restart
        </button>

    `;


    let first = null;
    let second = null;
    let lock = false;
    let matched = 0;


    document
        .querySelectorAll(
            "[data-memory]"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    if (
                        lock ||
                        card.classList.contains(
                            "matched"
                        )
                    ) return;


                    const index =
                        Number(
                            card.dataset.memory
                        );

                    card.textContent =
                        symbols[index];


                    if (first === null) {

                        first = {
                            card,
                            index
                        };

                        return;

                    }


                    second = {
                        card,
                        index
                    };

                    lock = true;


                    if (
                        symbols[
                            first.index
                        ] ===
                        symbols[
                            second.index
                        ]
                    ) {

                        first.card
                            .classList
                            .add("matched");

                        second.card
                            .classList
                            .add("matched");

                        matched += 2;

                        first = null;
                        second = null;

                        lock = false;


                        if (matched === symbols.length) {

                            $("memoryStatus")
                                .textContent =
                                "🎉 All pairs matched!";

                        }

                    } else {

                        setTimeout(() => {

                            first.card.textContent =
                                "?";

                            second.card.textContent =
                                "?";

                            first = null;
                            second = null;

                            lock = false;

                        }, 650);

                    }

                }
            );

        });


    $("restartMemory")?.addEventListener(
        "click",
        startMemory
    );


    openGame();

}


function startNumberRush() {

    let score = 0;
    let target = 1;


    gameContent.innerHTML = `

        <h2>🔢 Number Rush</h2>

        <p>
            Click numbers in order from 1 to 16.
        </p>

        <p>
            Score:
            <strong id="numberScore">0</strong>
        </p>

        <div class="number-grid">

            ${Array.from(
                { length: 16 },
                (_, index) => `
                    <button
                        class="number-cell"
                        data-number="${index + 1}">
                        ${index + 1}
                    </button>
                `
            ).sort(() => Math.random() - 0.5).join("")}

        </div>

        <button
            class="secondary-btn"
            id="restartNumber">
            Restart
        </button>

    `;


    document
        .querySelectorAll(
            "[data-number]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        Number(
                            button.dataset.number
                        );

                    if (value === target) {

                        button.disabled = true;

                        target++;
                        score++;

                        $("numberScore")
                            .textContent =
                            score;


                        if (target > 16) {

                            showToast(
                                "🎉 Number Rush complete!"
                            );

                        }

                    } else {

                        showToast(
                            `Find ${target} next!`
                        );

                    }

                }
            );

        });


    $("restartNumber")?.addEventListener(
        "click",
        startNumberRush
    );


    openGame();

}


function startSkyDodge() {

    let score = 0;
    let running = true;


    gameContent.innerHTML = `

        <h2>☁️ Sky Dodge</h2>

        <p>
            Click the moving target as quickly as possible.
        </p>

        <p>
            Score:
            <strong id="skyScore">0</strong>
        </p>

        <div
            id="skyArea"
            style="
                position:relative;
                height:300px;
                border-radius:18px;
                background:#f3f4ff;
                overflow:hidden;
                margin:20px 0;
            ">

            <button
                id="skyTarget"
                style="
                    position:absolute;
                    width:55px;
                    height:55px;
                    border-radius:50%;
                    border:none;
                    cursor:pointer;
                    background:#5b5ce2;
                    color:white;
                    font-size:24px;
                ">
                ☁️
            </button>

        </div>

        <button
            class="secondary-btn"
            id="restartSky">
            Restart
        </button>

    `;


    const area = $("skyArea");
    const target = $("skyTarget");


    function moveTarget() {

        if (!running) return;

        const maxX =
            Math.max(
                0,
                area.clientWidth - 55
            );

        const maxY =
            Math.max(
                0,
                area.clientHeight - 55
            );


        target.style.left =
            `${randomNumber(0, maxX)}px`;

        target.style.top =
            `${randomNumber(0, maxY)}px`;

    }


    target.addEventListener(
        "click",
        () => {

            score++;

            $("skyScore").textContent =
                score;

            moveTarget();

        }
    );


    const moveTimer =
        setInterval(
            moveTarget,
            700
        );


    $("restartSky")?.addEventListener(
        "click",
        () => {

            running = false;

            clearInterval(moveTimer);

            startSkyDodge();

        }
    );


    moveTarget();

    openGame();

}


/* =========================================================
   LEARNING GAME
========================================================= */

function startLearningGame(type) {

    if (type === "mathgame") {

        startMathGame();

    } else if (type === "codinggame") {

        startCodingGame();

    } else if (type === "gkgame") {

        startGKGame();

    } else if (type === "braingame") {

        startBrainGame();

    }

}


function startMathGame() {

    let score = 0;
    let answer = 0;


    function newQuestion() {

        const a =
            randomNumber(1, 20);

        const b =
            randomNumber(1, 20);

        answer = a + b;

        gameContent.querySelector(
            "#learningMathQuestion"
        ).textContent =
            `${a} + ${b} = ?`;

        gameContent.querySelector(
            "#learningMathAnswer"
        ).value = "";

    }


    gameContent.innerHTML = `

        <h2>➗ Math Learning Game</h2>

        <p>
            Solve the question.
        </p>

        <h3
            id="learningMathQuestion"
            style="margin:25px 0;">
            Loading...
        </h3>

        <input
            id="learningMathAnswer"
            class="answer-input"
            type="number"
            placeholder="Your answer">

        <button
            id="learningMathSubmit"
            class="primary-btn">
            Submit
        </button>

        <p
            id="learningMathFeedback"
            class="feedback-text">
        </p>

        <p>
            Score:
            <strong id="learningMathScore">
                0
            </strong>
        </p>

    `;


    $("learningMathSubmit")
        .addEventListener(
            "click",
            () => {

                const value =
                    Number(
                        $("learningMathAnswer").value
                    );


                if (
                    value === answer
                ) {

                    score++;

                    $("learningMathFeedback")
                        .textContent =
                        "✅ Correct!";

                } else {

                    $("learningMathFeedback")
                        .textContent =
                        `❌ Answer: ${answer}`;

                }


                $("learningMathScore")
                    .textContent =
                    score;


                setTimeout(
                    newQuestion,
                    500
                );

            }
        );


    newQuestion();

    openGame();

}


function startCodingGame() {

    const questions = [
        {
            q: "Which keyword creates a class in Java?",
            a: "class"
        },
        {
            q: "Which function prints text in Python?",
            a: "print"
        },
        {
            q: "Which data type stores integers in C?",
            a: "int"
        }
    ];


    let index = 0;
    let score = 0;


    gameContent.innerHTML = `

        <h2>💻 Coding Learning Game</h2>

        <h3
            id="codingGameQuestion"
            style="margin:25px 0;">
        </h3>

        <input
            id="codingGameAnswer"
            class="answer-input"
            placeholder="Type your answer">

        <button
            id="codingGameSubmit"
            class="primary-btn">
            Submit
        </button>

        <p
            id="codingGameFeedback"
            class="feedback-text">
        </p>

        <p>
            Score:
            <strong id="codingGameScore">0</strong>
        </p>

    `;


    function load() {

        if (index >= questions.length) {

            $("codingGameFeedback")
                .textContent =
                `🎉 Game complete! Score ${score}/${questions.length}`;

            $("codingGameSubmit").disabled =
                true;

            return;

        }


        $("codingGameQuestion")
            .textContent =
            questions[index].q;

        $("codingGameAnswer").value = "";

    }


    $("codingGameSubmit")
        .addEventListener(
            "click",
            () => {

                const value =
                    $("codingGameAnswer")
                        .value
                        .trim()
                        .toLowerCase();


                if (
                    value ===
                    questions[index].a
                ) {

                    score++;

                    $("codingGameFeedback")
                        .textContent =
                        "✅ Correct!";

                } else {

                    $("codingGameFeedback")
                        .textContent =
                        `❌ Answer: ${questions[index].a}`;

                }


                $("codingGameScore")
                    .textContent =
                    score;


                index++;

                setTimeout(
                    load,
                    500
                );

            }
        );


    load();

    openGame();

}


function startGKGame() {

    let index = 0;
    let score = 0;


    const questions = [
        {
            q: "Which planet is called the Red Planet?",
            options: [
                "Earth",
                "Mars",
                "Venus"
            ],
            answer: 1
        },
        {
            q: "Capital of India?",
            options: [
                "Mumbai",
                "New Delhi",
                "Kolkata"
            ],
            answer: 1
        }
    ];


    function load() {

        if (index >= questions.length) {

            gameContent.innerHTML = `
                <h2>🌍 GK Game Complete!</h2>
                <p style="margin:20px 0;">
                    Your Score:
                    <strong>${score}/${questions.length}</strong>
                </p>
                <button
                    class="primary-btn"
                    id="restartGKGame">
                    Play Again
                </button>
            `;

            $("restartGKGame")
                .addEventListener(
                    "click",
                    startGKGame
                );

            return;

        }


        const item =
            questions[index];


        gameContent.innerHTML = `

            <h2>🌍 GK Learning Game</h2>

            <h3 style="margin:25px 0;">
                ${item.q}
            </h3>

            <div class="option-grid">

                ${item.options.map(
                    (option, optionIndex) => `
                        <button
                            class="option-btn"
                            data-gkgame="${optionIndex}">
                            ${option}
                        </button>
                    `
                ).join("")}

            </div>

            <p>
                Score:
                <strong>${score}</strong>
            </p>

        `;


        document
            .querySelectorAll(
                "[data-gkgame]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const selected =
                            Number(
                                button.dataset.gkgame
                            );

                        if (
                            selected ===
                            item.answer
                        ) {
                            score++;
                        }

                        index++;

                        setTimeout(
                            load,
                            400
                        );

                    }
                );

            });

    }


    load();

    openGame();

}


function startBrainGame() {

    const numbers = [
        2,
        4,
        6,
        8
    ];

    let score = 0;


    gameContent.innerHTML = `

        <h2>🧠 Brain Learning Game</h2>

        <p style="margin:20px 0;">
            What comes after 8?
        </p>

        <div class="option-grid">

            <button
                class="option-btn"
                data-brain-game="9">
                9
            </button>

            <button
                class="option-btn"
                data-brain-game="10">
                10
            </button>

            <button
                class="option-btn"
                data-brain-game="12">
                12
            </button>

            <button
                class="option-btn"
                data-brain-game="14">
                14
            </button>

        </div>

        <p id="brainGameFeedback"></p>

    `;


    document
        .querySelectorAll(
            "[data-brain-game]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        button.dataset.brainGame ===
                        "10"
                    ) {

                        $("brainGameFeedback")
                            .textContent =
                            "🎉 Correct! Great thinking.";

                    } else {

                        $("brainGameFeedback")
                            .textContent =
                            "❌ Try again!";

                    }

                }
            );

        });


    openGame();

}


/* =========================================================
   GAME BUTTONS
========================================================= */

document
    .querySelectorAll(
        "[data-game]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const game =
                    button.dataset.game;


                if (game === "xo")
                    startXO();

                else if (game === "memory")
                    startMemory();

                else if (game === "number")
                    startNumberRush();

                else if (game === "sky")
                    startSkyDodge();

                else
                    startLearningGame(game);

            }
        );

    });


/* =========================================================
   REFERRAL
========================================================= */

const referralCode =
    "SKILLUP-HARIOM";


if ($("referralCode"))
    $("referralCode").textContent =
        referralCode;


if ($("referralCount"))
    $("referralCount").textContent =
        appData.referralCount;


$("copyReferralBtn")?.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                referralCode
            );

            showToast(
                "Referral code copied!"
            );

        } catch {

            showToast(
                "Copy is not supported here."
            );

        }

    }
);


$("shareReferralBtn")?.addEventListener(
    "click",
    async () => {

        const message =
            `Join SkillUp - Learn, Play & Grow! My referral code is ${referralCode}`;

        if (
            navigator.share
        ) {

            try {

                await navigator.share({
                    title: "SkillUp",
                    text: message
                });

            } catch {
                // User cancelled sharing.
            }

        } else {

            try {

                await navigator.clipboard.writeText(
                    message
                );

                showToast(
                    "Share message copied!"
                );

            } catch {

                showToast(
                    message
                );

            }

        }

    }
);


/* =========================================================
   INITIALIZE TYPING
========================================================= */

createTypingTest();


/* =========================================================
   INITIALIZE CERTIFICATE
========================================================= */

updateCertificate();


/* =========================================================
   INITIALIZE PROFILE + DASHBOARD
========================================================= */

updateAllUI();


/* =========================================================
   INITIAL PAGE
========================================================= */

showPage("homePage");


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
            Escape closes game modal.
        */

        if (
            event.key === "Escape" &&
            gameModal &&
            !gameModal.classList.contains("hidden")
        ) {

            closeGame();

        }

    }
);


/* =========================================================
   PREVENT ACCIDENTAL FORM SUBMIT
========================================================= */

document
    .querySelectorAll(
        "form"
    )
    .forEach(form => {

        form.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    event.target.tagName !== "TEXTAREA"
                ) {

                    event.preventDefault();

                }

            }
        );

    });

/* =====================================================
   SKILLUP LOGIN / SIGNUP SYSTEM
===================================================== */

const LOGIN_KEY = "skillup_login_user";


function getLoginUser() {

    return safeJSON(
        localStorage.getItem(LOGIN_KEY),
        null
    );

}


function saveLoginUser(user) {

    localStorage.setItem(
        LOGIN_KEY,
        JSON.stringify(user)
    );

}


/* =====================================================
   SHOW LOGIN / SIGNUP
===================================================== */

function showLoginForm() {

    $("loginForm")?.classList.remove("hidden");

    $("signupForm")?.classList.add("hidden");

    if ($("loginMessage"))
        $("loginMessage").textContent = "";

}


function showSignupForm() {

    $("loginForm")?.classList.add("hidden");

    $("signupForm")?.classList.remove("hidden");

    if ($("signupMessage"))
        $("signupMessage").textContent = "";

}


/* =====================================================
   CREATE ACCOUNT
===================================================== */

$("showSignupBtn")?.addEventListener(
    "click",
    showSignupForm
);


$("showLoginBtn")?.addEventListener(
    "click",
    showLoginForm
);


$("createAccountBtn")?.addEventListener(
    "click",
    () => {

        const name =
            $("signupName")?.value.trim();

        const email =
            $("signupEmail")?.value.trim();

        const password =
            $("signupPassword")?.value;

        const confirmPassword =
            $("signupConfirmPassword")?.value;


        if (!name || !email || !password) {

            $("signupMessage").textContent =
                "Please fill all fields.";

            return;

        }


        if (password.length < 6) {

            $("signupMessage").textContent =
                "Password must be at least 6 characters.";

            return;

        }


        if (password !== confirmPassword) {

            $("signupMessage").textContent =
                "Passwords do not match.";

            return;

        }


        const existingUser =
            safeJSON(
                localStorage.getItem(
                    "skillup_account"
                ),
                null
            );


        if (
            existingUser &&
            existingUser.email === email
        ) {

            $("signupMessage").textContent =
                "Account already exists. Please login.";

            return;

        }


        const user = {

            name,
            email,
            password,

            createdAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "skillup_account",
            JSON.stringify(user)
        );


        /*
            Also update SkillUp profile.
        */

        appData.profile.name =
            name;

        appData.profile.email =
            email;

        saveData();


        $("signupMessage").textContent =
            "Account created successfully!";


        showToast(
            "Account created successfully!"
        );


        setTimeout(
            () => {

                showLoginForm();

                $("loginEmail").value =
                    email;

                $("loginPassword").value =
                    "";

            },
            700
        );

    }
);


/* =====================================================
   LOGIN
===================================================== */

$("loginBtn")?.addEventListener(
    "click",
    () => {

        const email =
            $("loginEmail")?.value.trim();

        const password =
            $("loginPassword")?.value;


        if (!email || !password) {

            $("loginMessage").textContent =
                "Please enter email and password.";

            return;

        }


        const account =
            safeJSON(
                localStorage.getItem(
                    "skillup_account"
                ),
                null
            );


        if (!account) {

            $("loginMessage").textContent =
                "Account not found. Please create an account first.";

            return;

        }


        if (
            email !== account.email ||
            password !== account.password
        ) {

            $("loginMessage").textContent =
                "Incorrect email or password.";

            return;

        }


        saveLoginUser({
            name: account.name,
            email: account.email
        });


        /*
            Update profile.
        */

        appData.profile.name =
            account.name;

        appData.profile.email =
            account.email;

        saveData();


        $("loginMessage").textContent =
            "Login successful!";


        showToast(
            `Welcome, ${account.name}!`
        );


        setTimeout(
            () => {

                openDashboardAfterLogin();

            },
            500
        );

    }
);


/* =====================================================
   OPEN DASHBOARD AFTER LOGIN
===================================================== */

function openDashboardAfterLogin() {

    $("loginPage")
        ?.classList.add("hidden");


    /*
        Show the main website.
    */

    const mainContent =
        $("appPage") ||
        $("mainApp") ||
        $("dashboardPage");


    if (mainContent) {

        mainContent.classList.remove(
            "hidden"
        );

    }


    showPage("homePage");

    updateAllUI();

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutSkillUp() {

    localStorage.removeItem(
        LOGIN_KEY
    );


    $("loginPage")
        ?.classList.remove("hidden");


    const mainContent =
        $("appPage") ||
        $("mainApp") ||
        $("dashboardPage");


    if (mainContent) {

        mainContent.classList.add(
            "hidden"
        );

    }


    showLoginForm();

    showToast(
        "You have been logged out."
    );

}


$("logoutBtn")?.addEventListener(
    "click",
    logoutSkillUp
);


/* =====================================================
   LOGIN STATE CHECK
===================================================== */

function checkLoginState() {

    const loggedUser =
        getLoginUser();


    if (loggedUser) {

        /*
            User already logged in.
        */

        $("loginPage")
            ?.classList.add("hidden");


        const mainContent =
            $("appPage") ||
            $("mainApp") ||
            $("dashboardPage");


        if (mainContent) {

            mainContent.classList.remove(
                "hidden"
            );

        }


        /*
            Restore profile.
        */

        if (loggedUser.name)
            appData.profile.name =
                loggedUser.name;

        if (loggedUser.email)
            appData.profile.email =
                loggedUser.email;

        saveData();


        updateAllUI();

        showPage("homePage");

    } else {

        /*
            No login session.
        */

        $("loginPage")
            ?.classList.remove("hidden");


        const mainContent =
            $("appPage") ||
            $("mainApp") ||
            $("dashboardPage");


        if (mainContent) {

            mainContent.classList.add(
                "hidden"
            );

        }

        showLoginForm();

    }

}


/* =====================================================
   RUN LOGIN CHECK
===================================================== */

checkLoginState();
/* =========================================================
   FINAL SAFETY LOG
========================================================= */

console.log(
    "SkillUp loaded successfully — Learn • Play • Grow"
);
/* =====================================================
   CERTIFICATE SYSTEM
===================================================== */

let certificateData =
    safeJSON(
        localStorage.getItem("skillup_certificate"),
        null
    );


function saveCertificate(data) {

    certificateData = data;

    localStorage.setItem(
        "skillup_certificate",
        JSON.stringify(data)
    );

}


/* =====================================================
   UNLOCK CERTIFICATE
===================================================== */

function unlockCertificate(
    testName,
    score,
    accuracy,
    medal
) {

    const user =
        getLoginUser();

    const name =
        user?.name ||
        appData?.profile?.name ||
        "SkillUp Student";


    saveCertificate({

        unlocked: true,

        name: name,

        test: testName,

        score: score,

        accuracy: accuracy,

        medal: medal || "Bronze",

        completedAt:
            new Date().toISOString()

    });


    updateCertificate();

}


/* =====================================================
   UPDATE CERTIFICATE
===================================================== */

function updateCertificate() {

    const locked =
        $("certificateLocked");

    const certificate =
        $("certificateContainer");


    {

        locked?.classList.remove(
            "hidden"
        );

        certificate?.classList.add(
            "hidden"
        );

        return;

    }


    locked?.classList.add(
        "hidden"
    );

    certificate?.classList.remove(
        "hidden"
    );


    $("certificateName").textContent =
        certificateData.name || "SkillUp Student";


    $("certificateTest").textContent =
        certificateData.test || "SkillUp Test";


    $("certificateScore").textContent =
        certificateData.score ?? 0;


    $("certificateAccuracy").textContent =
        `${certificateData.accuracy ?? 0}%`;


    $("certificateMedal").textContent =
        certificateData.medal || "Bronze";

}


/* =====================================================
   CERTIFICATE NAVIGATION
===================================================== */

document
    .querySelectorAll(
        '[data-page="certificatePage"]'
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    "certificatePage"
                );

                updateCertificate();

            }
        );

    });


/* =====================================================
   GENERATE / PRINT
===================================================== */

$("printCertificateBtn")
    ?.addEventListener(
        "click",
        () => {

            if (
                !certificateData?.unlocked
            ) {

                showToast(
                    "Complete a test first!"
                );

                return;

            }


            updateCertificate();

            window.print();

        }
    );


/* =====================================================
   INITIAL CERTIFICATE CHECK
===================================================== */

updateCertificate();