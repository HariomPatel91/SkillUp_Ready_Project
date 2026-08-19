// ==========================================================
// SKILLUP - COMPLETE SCRIPT.JS
// Firebase Authentication + App Functions
// ==========================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ==========================================================
// FIREBASE CONFIG
// ==========================================================

const firebaseConfig = {
    apiKey: "AIzaSyAvd3PWmshrxj1vM5-uMmdx0YaKuJvXkOc",
    authDomain: "skillup-new-5a743.firebaseapp.com",
    projectId: "skillup-new-5a743",
    storageBucket: "skillup-new-5a743.firebasestorage.app",
    messagingSenderId: "432227486410",
    appId: "1:432227486410:web:00aa7d9b6eec13f5724233"
};


// ==========================================================
// INITIALIZE FIREBASE
// ==========================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;


// ==========================================================
// ELEMENTS
// ==========================================================

const loginPage = document.getElementById("loginPage");
const createAccountPage = document.getElementById("createAccountPage");
const appPage = document.getElementById("appPage");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const loginButton = document.getElementById("loginButton");
const createAccountButton =
    document.getElementById("createAccountButton");

const loginMessage =
    document.getElementById("loginMessage");


// ==========================================================
// PAGE DISPLAY
// ==========================================================

function showLogin() {

    if (loginPage)
        loginPage.classList.remove("hidden");

    if (createAccountPage)
        createAccountPage.classList.add("hidden");

    if (appPage)
        appPage.classList.add("hidden");
}


function showCreateAccount() {

    if (loginPage)
        loginPage.classList.add("hidden");

    if (createAccountPage)
        createAccountPage.classList.remove("hidden");

    if (appPage)
        appPage.classList.add("hidden");
}


function showApp() {

    if (loginPage)
        loginPage.classList.add("hidden");

    if (createAccountPage)
        createAccountPage.classList.add("hidden");

    if (appPage)
        appPage.classList.remove("hidden");

    showSection("home");
}


// ==========================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ==========================================================

window.showLogin = showLogin;
window.showCreateAccount = showCreateAccount;


// ==========================================================
// CREATE ACCOUNT BUTTON
// ==========================================================

if (createAccountButton) {

    createAccountButton.addEventListener(
        "click",
        showCreateAccount
    );
}


// ==========================================================
// LOGIN
// ==========================================================

async function login() {

    const email =
        document.getElementById("loginEmail")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value;

    if (!email || !password) {

        showLoginMessage(
            "Please enter email and password.",
            "error"
        );

        return;
    }


    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {

        showLoginMessage(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    try {

        showLoginMessage(
            "Logging in...",
            "normal"
        );

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        currentUser = result.user;

        showLoginMessage(
            "Login successful! 🚀",
            "success"
        );

        setTimeout(() => {

            showApp();

        }, 500);


    } catch (error) {

        console.error("LOGIN ERROR:", error);

        let message =
            "Login failed. Please try again.";

        switch (error.code) {

            case "auth/invalid-email":
                message =
                    "Invalid email address.";
                break;

            case "auth/user-not-found":
                message =
                    "No account found with this email.";
                break;

            case "auth/wrong-password":
                message =
                    "Incorrect password.";
                break;

            case "auth/invalid-credential":
                message =
                    "Email or password is incorrect.";
                break;

            case "auth/too-many-requests":
                message =
                    "Too many attempts. Please try again later.";
                break;

            case "auth/network-request-failed":
                message =
                    "Internet connection problem.";
                break;
        }

        showLoginMessage(message, "error");
    }
}


function showLoginMessage(message, type) {

    if (!loginMessage)
        return;

    loginMessage.textContent = message;

    loginMessage.style.display = "block";

    if (type === "error") {
        loginMessage.style.color = "red";
    }

    else if (type === "success") {
        loginMessage.style.color = "green";
    }

    else {
        loginMessage.style.color = "inherit";
    }
}


window.login = login;


// ==========================================================
// LOGIN BUTTON
// ==========================================================

if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );
}


// ==========================================================
// ENTER KEY LOGIN
// ==========================================================

if (loginPassword) {

    loginPassword.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                login();
            }

        }
    );
}


// ==========================================================
// CREATE ACCOUNT
// ==========================================================

async function createAccount() {

    const name =
        document.getElementById("signupName")?.value.trim();

    const email =
        document.getElementById("signupEmail")?.value.trim();

    const password =
        document.getElementById("signupPassword")?.value;

    const message =
        document.getElementById("signupMessage");


    if (!name || !email || !password) {

        if (message)
            message.textContent =
                "Please fill all fields.";

        return;
    }


    if (!email.includes("@") || !email.includes(".")) {

        if (message)
            message.textContent =
                "Please enter a valid email.";

        return;
    }


    if (password.length < 6) {

        if (message)
            message.textContent =
                "Password must be at least 6 characters.";

        return;
    }


    try {

        if (message)
            message.textContent =
                "Creating account...";


        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        await updateProfile(
            result.user,
            {
                displayName: name
            }
        );


        currentUser = result.user;


        // Save basic profile
        localStorage.setItem(
            "skillup_profile_" + result.user.uid,
            JSON.stringify({
                name: name,
                email: email
            })
        );


        if (message) {

            message.textContent =
                "Account created successfully! 🚀";

            message.style.color = "green";
        }


        setTimeout(() => {

            showApp();

        }, 700);


    } catch (error) {

        console.error(
            "CREATE ACCOUNT ERROR:",
            error
        );


        let msg =
            "Account creation failed.";

        switch (error.code) {

            case "auth/email-already-in-use":
                msg =
                    "This email already has an account. Please login.";
                break;

            case "auth/invalid-email":
                msg =
                    "Invalid email address.";
                break;

            case "auth/weak-password":
                msg =
                    "Password is too weak. Use at least 6 characters.";
                break;

            case "auth/network-request-failed":
                msg =
                    "Internet connection problem.";
                break;
        }


        if (message) {

            message.textContent = msg;
            message.style.color = "red";
        }
    }
}


window.createAccount = createAccount;


// ==========================================================
// LOGOUT
// ==========================================================

async function logout() {

    try {

        await signOut(auth);

        currentUser = null;

        showLogin();

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );
    }
}


window.logout = logout;


// ==========================================================
// FIREBASE AUTH STATE
// ==========================================================

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            currentUser = user;

            console.log(
                "Firebase User:",
                user.email
            );

            updateUserInterface(user);

            showApp();

        } else {

            currentUser = null;

            showLogin();
        }
    }
);


// ==========================================================
// UPDATE USER UI
// ==========================================================

function updateUserInterface(user) {

    const welcome =
        document.getElementById("welcomeUser");

    if (welcome) {

        const name =
            user.displayName ||
            user.email.split("@")[0];

        welcome.textContent =
            "Welcome to SkillUp, " +
            name +
            " 👋";
    }


    // Main profile email if available
    const emailElement =
        document.querySelector(
            "#appPage .profile-card p"
        );

    if (emailElement) {

        emailElement.textContent =
            user.email;
    }
}


// ==========================================================
// SECTION NAVIGATION
// ==========================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(
            "#appPage .section"
        );


    sections.forEach(section => {

        section.classList.add("hidden");

    });


    const selected =
        document.getElementById(sectionId);


    if (selected) {

        selected.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } else {

        console.warn(
            "Section not found:",
            sectionId
        );
    }


    if (sectionId === "profile") {

        loadProfile();

    }

}


window.showSection = showSection;


// ==========================================================
// THEME
// ==========================================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const button =
        document.getElementById("themeButton");

    if (button) {

        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            button.textContent = "☀️";

        } else {

            button.textContent = "🌙";
        }
    }

}


window.toggleTheme = toggleTheme;


// ==========================================================
// PROFILE
// ==========================================================

function getProfileKey() {

    if (!currentUser)
        return null;

    return "skillup_profile_" +
        currentUser.uid;
}


function saveProfile() {

    if (!currentUser) {

        return;
    }


    const profile = {

        name:
            document.getElementById(
                "profileName"
            )?.value || "",

        email:
            document.getElementById(
                "profileEmail"
            )?.value ||
            currentUser.email,

        phone:
            document.getElementById(
                "profilePhone"
            )?.value || "",

        whatsapp:
            document.getElementById(
                "profileWhatsapp"
            )?.value || "",

        college:
            document.getElementById(
                "profileCollege"
            )?.value || "",

        course:
            document.getElementById(
                "profileCourse"
            )?.value || "",

        year:
            document.getElementById(
                "profileYear"
            )?.value || "",

        city:
            document.getElementById(
                "profileCity"
            )?.value || "",

        skills:
            document.getElementById(
                "profileSkills"
            )?.value || "",

        about:
            document.getElementById(
                "profileAbout"
            )?.value || ""
    };


    localStorage.setItem(
        getProfileKey(),
        JSON.stringify(profile)
    );


    updateProfilePreview(profile);


    const message =
        document.getElementById(
            "profileMessage"
        );


    if (message) {

        message.textContent =
            "Profile saved successfully! ✅";

        message.style.color = "green";
    }
}


window.saveProfile = saveProfile;


// ==========================================================
// LOAD PROFILE
// ==========================================================

function loadProfile() {

    if (!currentUser)
        return;


    const key =
        getProfileKey();

    const saved =
        localStorage.getItem(key);


    let profile;


    if (saved) {

        try {

            profile =
                JSON.parse(saved);

        } catch {

            profile = {};

        }

    } else {

        profile = {

            name:
                currentUser.displayName ||
                "",

            email:
                currentUser.email ||
                ""
        };
    }


    setValue(
        "profileName",
        profile.name
    );

    setValue(
        "profileEmail",
        profile.email ||
        currentUser.email
    );

    setValue(
        "profilePhone",
        profile.phone
    );

    setValue(
        "profileWhatsapp",
        profile.whatsapp
    );

    setValue(
        "profileCollege",
        profile.college
    );

    setValue(
        "profileCourse",
        profile.course
    );

    setValue(
        "profileYear",
        profile.year
    );

    setValue(
        "profileCity",
        profile.city
    );

    setValue(
        "profileSkills",
        profile.skills
    );

    setValue(
        "profileAbout",
        profile.about
    );


    updateProfilePreview(profile);
}


window.loadProfile = loadProfile;


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element && value !== undefined) {

        element.value = value || "";
    }
}


function updateProfilePreview(profile) {

    setText(
        "previewName",
        profile.name || "Your Name"
    );

    setText(
        "previewCourse",
        profile.course || "Your Course"
    );

    setText(
        "previewEmail",
        profile.email || "Not Added"
    );

    setText(
        "previewPhone",
        profile.phone || "Not Added"
    );

    setText(
        "previewWhatsapp",
        profile.whatsapp || "Not Added"
    );

    setText(
        "previewCollege",
        profile.college || "Not Added"
    );

    setText(
        "previewYear",
        profile.year || "Not Added"
    );

    setText(
        "previewCity",
        profile.city || "Not Added"
    );

    setText(
        "previewSkills",
        profile.skills ||
        "No skills added yet."
    );

    setText(
        "previewAbout",
        profile.about ||
        "No information added yet."
    );
}


function setText(id, text) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = text;
    }
}


// ==========================================================
// SHAYARI
// ==========================================================

const shayaris = [

    "मेहनत इतनी खामोशी से करो, कि सफलता शोर मचा दे। 🚀",

    "हार मत मानो, शुरुआत हमेशा छोटी होती है। 💪",

    "आज की मेहनत ही कल की पहचान बनेगी। 🌟",

    "सपने वो नहीं जो सोते समय आते हैं, सपने वो हैं जो सोने नहीं देते। 🔥",

    "धीरे चलो लेकिन कभी रुकना मत। 🚀",

    "कामयाबी मेहनत करने वालों को ही मिलती है। 🏆",

    "खुद पर विश्वास रखो, रास्ते खुद बनते जाएंगे। ✨"
];


function newShayari() {

    const element =
        document.getElementById(
            "shayariText"
        );


    if (!element)
        return;


    const random =
        Math.floor(
            Math.random() *
            shayaris.length
        );


    element.textContent =
        shayaris[random];
}


window.newShayari = newShayari;


// ==========================================================
// RESUME
// ==========================================================

function generateResume() {

    const name =
        document.getElementById(
            "resumeName"
        )?.value || "";

    const email =
        document.getElementById(
            "resumeEmail"
        )?.value || "";

    const phone =
        document.getElementById(
            "resumePhone"
        )?.value || "";

    const education =
        document.getElementById(
            "resumeEducation"
        )?.value || "";

    const skills =
        document.getElementById(
            "resumeSkills"
        )?.value || "";

    const about =
        document.getElementById(
            "resumeAbout"
        )?.value || "";


    const output =
        document.getElementById(
            "resumeOutput"
        );


    if (!output)
        return;


    output.innerHTML = `

        <div class="resume-preview">

            <h1>${escapeHTML(name || "Your Name")}</h1>

            <p>
                ${escapeHTML(email)}
                ${email && phone ? " | " : ""}
                ${escapeHTML(phone)}
            </p>

            <hr>

            <h3>About Me</h3>
            <p>${escapeHTML(about)}</p>

            <h3>Education</h3>
            <p>${escapeHTML(education)}</p>

            <h3>Skills</h3>
            <p>${escapeHTML(skills)}</p>

        </div>

    `;


    output.classList.remove("hidden");
}


window.generateResume = generateResume;


// ==========================================================
// REFERRAL
// ==========================================================

function getReferralCode() {

    if (!currentUser)
        return "SKILLUP";


    return (
        "SU-" +
        currentUser.uid
            .substring(0, 6)
            .toUpperCase()
    );
}


function updateReferralCode() {

    const element =
        document.getElementById(
            "referralCode"
        );


    if (element) {

        element.textContent =
            getReferralCode();
    }
}


function copyReferral() {

    const code =
        getReferralCode();


    navigator.clipboard
        .writeText(code)
        .then(() => {

            const msg =
                document.getElementById(
                    "copyMessage"
                );

            if (msg)
                msg.textContent =
                    "Referral code copied! ✅";

        });
}


window.copyReferral = copyReferral;


function copyReferralLink() {

    const code =
        getReferralCode();

    const link =
        window.location.origin +
        window.location.pathname +
        "?ref=" +
        code;


    navigator.clipboard
        .writeText(link)
        .then(() => {

            const msg =
                document.getElementById(
                    "copyMessage"
                );

            if (msg)
                msg.textContent =
                    "Referral link copied! ✅";

        });
}


window.copyReferralLink =
    copyReferralLink;


function shareReferral() {

    const code =
        getReferralCode();

    const link =
        window.location.origin +
        window.location.pathname +
        "?ref=" +
        code;


    if (navigator.share) {

        navigator.share({

            title: "SkillUp",
            text:
                "Join SkillUp - Learn, Play & Grow 🚀",
            url: link

        });

    } else {

        copyReferralLink();

    }
}


window.shareReferral = shareReferral;


// ==========================================================
// PDF MAKER
// ==========================================================

function generatePDF() {

    const title =
        document.getElementById(
            "pdfTitle"
        )?.value ||
        "SkillUp Document";


    const content =
        document.getElementById(
            "pdfContent"
        )?.value ||
        "";


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow)
        return;


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHTML(title)}
            </title>

            <style>

                body {
                    font-family: Arial;
                    padding: 40px;
                }

                h1 {
                    text-align: center;
                }

                .content {
                    white-space: pre-wrap;
                    line-height: 1.6;
                }

            </style>

        </head>

        <body>

            <h1>
                ${escapeHTML(title)}
            </h1>

            <div class="content">
                ${escapeHTML(content)}
            </div>

        </body>

        </html>

    `);


    printWindow.document.close();


    setTimeout(() => {

        printWindow.print();

    }, 500);
}


window.generatePDF = generatePDF;


// ==========================================================
// TYPING MASTER
// ==========================================================

let typingTimer = null;
let typingTime = 30;
let typingRemaining = 30;
let typingStarted = false;


const typingTexts = [

    "Learning new skills every day makes you stronger and more confident.",

    "Practice programming regularly and improve your problem solving skills.",

    "SkillUp helps students learn play and grow every single day.",

    "Success comes from consistent practice patience and hard work."

];


function startTypingTest(seconds) {

    typingTime = seconds;
    typingRemaining = seconds;
    typingStarted = false;


    const start =
        document.getElementById(
            "typingStartScreen"
        );

    const test =
        document.getElementById(
            "typingTestScreen"
        );

    const result =
        document.getElementById(
            "typingResultScreen"
        );


    if (start)
        start.classList.add("hidden");

    if (result)
        result.classList.add("hidden");

    if (test)
        test.classList.remove("hidden");


    const text =
        typingTexts[
            Math.floor(
                Math.random() *
                typingTexts.length
            )
        ];


    setText(
        "typingText",
        text
    );


    const input =
        document.getElementById(
            "typingInput"
        );


    if (input) {

        input.value = "";
        input.focus();

        input.oninput =
            calculateTyping;

    }


    setText(
        "typingTimer",
        typingRemaining
    );


    clearInterval(typingTimer);

    typingTimer =
        setInterval(() => {

            typingRemaining--;

            setText(
                "typingTimer",
                typingRemaining
            );


            if (typingRemaining <= 0) {

                finishTypingTest();

            }

        }, 1000);
}


window.startTypingTest =
    startTypingTest;


function calculateTyping() {

    const input =
        document.getElementById(
            "typingInput"
        );

    const target =
        document.getElementById(
            "typingText"
        );


    if (!input || !target)
        return;


    const typed =
        input.value;

    const text =
        target.textContent;


    let correct = 0;


    for (
        let i = 0;
        i < typed.length;
        i++
    ) {

        if (typed[i] === text[i]) {

            correct++;

        }

    }


    const elapsed =
        typingTime -
        typingRemaining;


    const minutes =
        Math.max(
            elapsed / 60,
            1 / 60
        );


    const words =
        correct / 5;


    const wpm =
        Math.round(
            words / minutes
        );


    const accuracy =
        typed.length === 0
            ? 100
            : Math.round(
                (correct /
                    typed.length) *
                100
            );


    setText(
        "typingWPM",
        wpm
    );

    setText(
        "typingAccuracy",
        accuracy + "%"
    );

    setText(
        "typingCorrect",
        correct
    );
}


function finishTypingTest() {

    clearInterval(typingTimer);


    const input =
        document.getElementById(
            "typingInput"
        );

    if (input)
        input.disabled = true;


    calculateTyping();


    const wpm =
        document.getElementById(
            "typingWPM"
        )?.textContent || "0";

    const accuracy =
        document.getElementById(
            "typingAccuracy"
        )?.textContent || "0%";

    const correct =
        document.getElementById(
            "typingCorrect"
        )?.textContent || "0";


    const result =
        document.getElementById(
            "typingResultScreen"
        );

    const test =
        document.getElementById(
            "typingTestScreen"
        );


    if (test)
        test.classList.add("hidden");

    if (result)
        result.classList.remove("hidden");


    setText(
        "finalTypingWPM",
        wpm
    );

    setText(
        "finalTypingAccuracy",
        accuracy
    );

    setText(
        "finalTypingCorrect",
        correct
    );


    const wrong =
        Math.max(
            0,
            (input?.value.length || 0) -
            Number(correct)
        );


    setText(
        "finalTypingWrong",
        wrong
    );


    setText(
        "typingPerformance",
        getTypingPerformance(
            Number(wpm)
        )
    );


    saveTypingHistory(
        Number(wpm),
        accuracy
    );
}


window.finishTypingTest =
    finishTypingTest;


function getTypingPerformance(wpm) {

    if (wpm >= 50)
        return "Excellent typing speed! 🏆";

    if (wpm >= 35)
        return "Great job! Keep practicing. 🚀";

    if (wpm >= 20)
        return "Good progress! Keep improving. 💪";

    return "Keep practicing and your speed will improve. ✨";
}


function restartTypingTest() {

    const result =
        document.getElementById(
            "typingResultScreen"
        );

    const start =
        document.getElementById(
            "typingStartScreen"
        );


    if (result)
        result.classList.add("hidden");

    if (start)
        start.classList.remove("hidden");
}


window.restartTypingTest =
    restartTypingTest;


function saveTypingHistory(wpm, accuracy) {

    if (!currentUser)
        return;


    const key =
        "skillup_typing_" +
        currentUser.uid;


    const history =
        JSON.parse(
            localStorage.getItem(key) ||
            "[]"
        );


    history.push({

        wpm: wpm,
        accuracy: accuracy,
        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(
        key,
        JSON.stringify(history)
    );


    loadTypingHistory();
}


function loadTypingHistory() {

    if (!currentUser)
        return;


    const key =
        "skillup_typing_" +
        currentUser.uid;


    const history =
        JSON.parse(
            localStorage.getItem(key) ||
            "[]"
        );


    const element =
        document.getElementById(
            "typingHistory"
        );


    if (!element)
        return;


    if (history.length === 0) {

        element.textContent =
            "No typing tests completed yet.";

        return;
    }


    element.innerHTML =
        history
            .slice()
            .reverse()
            .slice(0, 10)
            .map(item => `

                <div class="history-item">

                    ⚡ ${item.wpm} WPM

                    | 🎯 ${escapeHTML(item.accuracy)}

                    | 📅 ${escapeHTML(item.date)}

                </div>

            `)
            .join("");
}


// ==========================================================
// LEARNING GAMES
// ==========================================================

let learningDifficulty = "";


function selectLearningDifficulty(level) {

    learningDifficulty = level;


    const message =
        document.getElementById(
            "learningDifficultyMessage"
        );


    if (message) {

        message.textContent =
            "Difficulty selected: " +
            level.toUpperCase() +
            " ✅";
    }
}


window.selectLearningDifficulty =
    selectLearningDifficulty;


function openLearningGame(game) {

    if (!learningDifficulty) {

        alert(
            "Please select difficulty first."
        );

        return;
    }


    alert(
        "🎮 " +
        game +
        " started!\nDifficulty: " +
        learningDifficulty.toUpperCase()
    );
}


window.openLearningGame =
    openLearningGame;


// ==========================================================
// PROGRAMMING COURSES
// ==========================================================

let selectedCourse = "";


function startCourse(language) {

    selectedCourse = language;


    showSection("quiz");


    const languages =
        document.getElementById(
            "quizLanguages"
        );

    const dashboard =
        document.getElementById(
            "courseDashboard"
        );


    if (languages)
        languages.classList.add("hidden");

    if (dashboard)
        dashboard.classList.remove("hidden");


    setText(
        "courseName",
        language + " Programming"
    );


    setText(
        "readingTitle",
        "Introduction to " +
        language
    );


    const content =
        document.getElementById(
            "readingContent"
        );


    if (content) {

        content.innerHTML = `

            <h3>
                Learn ${escapeHTML(language)}
            </h3>

            <p>
                This course introduces the basic
                concepts of ${escapeHTML(language)}
                programming.
            </p>

            <p>
                Study the lessons, complete the quiz
                and unlock your SkillUp certificate.
            </p>

        `;
    }


    setText(
        "courseProgressText",
        "Course Progress: 10%"
    );

    const bar =
        document.getElementById(
            "courseProgressBar"
        );

    if (bar)
        bar.style.width = "10%";
}


window.startCourse =
    startCourse;


function chooseCourse() {

    const languages =
        document.getElementById(
            "quizLanguages"
        );

    const dashboard =
        document.getElementById(
            "courseDashboard"
        );


    if (languages)
        languages.classList.remove("hidden");

    if (dashboard)
        dashboard.classList.add("hidden");
}


window.chooseCourse =
    chooseCourse;


// ==========================================================
// ENGLISH QUIZ
// ==========================================================

const englishQuestions = [

    {
        q: "Choose the correct sentence.",
        answers: [
            "He go to school.",
            "He goes to school.",
            "He going school.",
            "He gone school."
        ],
        correct: 1
    },

    {
        q: "What is the opposite of 'hot'?",
        answers: [
            "Warm",
            "Cold",
            "Heat",
            "Fire"
        ],
        correct: 1
    },

    {
        q: "Choose the correct article: ___ apple.",
        answers: [
            "A",
            "An",
            "The",
            "No article"
        ],
        correct: 1
    },

    {
        q: "Which word is a noun?",
        answers: [
            "Run",
            "Beautiful",
            "School",
            "Quickly"
        ],
        correct: 2
    },

    {
        q: "What is the past tense of 'go'?",
        answers: [
            "Goed",
            "Going",
            "Went",
            "Gone"
        ],
        correct: 2
    }
];


let englishIndex = 0;
let englishScore = 0;


function startEnglishQuiz() {

    englishIndex = 0;
    englishScore = 0;


    const start =
        document.getElementById(
            "englishQuizStart"
        );

    const game =
        document.getElementById(
            "englishQuizGame"
        );

    const finished =
        document.getElementById(
            "englishQuizFinished"
        );


    if (start)
        start.classList.add("hidden");

    if (finished)
        finished.classList.add("hidden");

    if (game)
        game.classList.remove("hidden");


    showEnglishQuestion();
}


window.startEnglishQuiz =
    startEnglishQuiz;


function showEnglishQuestion() {

    const question =
        englishQuestions[
            englishIndex
        ];


    if (!question)
        return;


    setText(
        "englishQuizNumber",
        "Question " +
        (englishIndex + 1) +
        " / " +
        englishQuestions.length
    );


    setText(
        "englishQuizQuestion",
        question.q
    );


    const answers =
        document.getElementById(
            "englishQuizAnswers"
        );


    if (!answers)
        return;


    answers.innerHTML = "";


    question.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                answer;


            button.onclick =
                () => {

                    if (
                        index ===
                        question.correct
                    ) {

                        englishScore++;

                        setText(
                            "englishQuizResult",
                            "Correct! ✅"
                        );

                    } else {

                        setText(
                            "englishQuizResult",
                            "Wrong answer ❌"
                        );
                    }

                };


            answers.appendChild(button);

        }
    );
}


function nextEnglishQuizQuestion() {

    englishIndex++;


    if (
        englishIndex >=
        englishQuestions.length
    ) {

        const game =
            document.getElementById(
                "englishQuizGame"
            );

        const finished =
            document.getElementById(
                "englishQuizFinished"
            );


        if (game)
            game.classList.add("hidden");

        if (finished)
            finished.classList.remove("hidden");


        setText(
            "englishFinalScore",
            "Your Score: " +
            englishScore +
            " / " +
            englishQuestions.length
        );


        return;
    }


    showEnglishQuestion();
}


window.nextEnglishQuizQuestion =
    nextEnglishQuizQuestion;


function returnToQuizzes() {

    showSection("quiz");
}


window.returnToQuizzes =
    returnToQuizzes;


// ==========================================================
// ENGLISH LEARNING
// ==========================================================

function startEnglishAssessment() {

    alert(
        "🇬🇧 English Level Test started!"
    );
}


window.startEnglishAssessment =
    startEnglishAssessment;


function startDailyEnglishTask() {

    const message =
        document.getElementById(
            "dailyTaskMessage"
        );


    if (message) {

        message.textContent =
            "Today's task: Learn 5 new English words and use them in sentences. 📚";

    }
}


window.startDailyEnglishTask =
    startDailyEnglishTask;


function nextEnglishAssessment() {

    alert(
        "Next question!"
    );
}


window.nextEnglishAssessment =
    nextEnglishAssessment;


function completeEnglishLesson() {

    const message =
        document.getElementById(
            "englishLessonMessage"
        );


    if (message) {

        message.textContent =
            "Lesson completed successfully! ✅";
    }
}


window.completeEnglishLesson =
    completeEnglishLesson;


// ==========================================================
// CERTIFICATE
// ==========================================================

function generateCertificate() {

    if (!currentUser) {

        alert(
            "Please login first."
        );

        return;
    }


    setText(
        "certificateStudentName",
        currentUser.displayName ||
        currentUser.email
    );


    setText(
        "certificateCourseName",
        selectedCourse ||
        "Programming Course"
    );


    setText(
        "certificateLanguage",
        selectedCourse ||
        "Programming"
    );


    setText(
        "certificateScore",
        "100%"
    );


    setText(
        "certificateAward",
        "Gold"
    );


    setText(
        "certificateDate",
        new Date().toLocaleDateString()
    );


    const area =
        document.getElementById(
            "certificateArea"
        );


    if (area)
        area.classList.remove("hidden");
}


window.generateCertificate =
    generateCertificate;


function printCertificate() {

    window.print();
}


window.printCertificate =
    printCertificate;


// ==========================================================
// HELPERS
// ==========================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================================
// INITIAL SETUP
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateReferralCode();

        loadTypingHistory();

        console.log(
            "🚀 SkillUp script loaded successfully!"
        );

    }
);


// ==========================================================
// DEBUG
// ==========================================================

console.log(
    "🔥 SkillUp Firebase initialized"
);

console.log(
    "📧 Auth system ready"
);