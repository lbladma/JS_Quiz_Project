//	Assignment/Homework-3: Code Quiz
//	Author: Taoufik Ammi
//	Date: 07/07/2021 
//	Course: UNC Coding BootCamp
// Javascript File


// Arrays Settings Section.  
// Objects Settings Section 
// Functions Settings Section 

// question1 function Settings Section. 
let questions = [{
    "question": "Which symbol is used for comments in Javascript?",
    "answers": [{
            "textContent": "=",
            isCorrect: false
        },
        {
            "textContent": ">>",
            isCorrect: false
        },
        {
            "textContent": "?",
            isCorrect: false
        },
        {
            "textContent": "//",
            isCorrect: true
        }
    ]
},
// question2 function Settings Section. 
{
    "question": "Which company developed JavaScript?",
    "answers": [{
            "textContent": "Microsoft",
            isCorrect: false
        },
        {
            "textContent": "Amazon",
            isCorrect: false
        },
        {
            "textContent": "Netscape",
            isCorrect: true
        },
        {
            "textContent": "Apple",
            isCorrect: false
        },

    ]
},
// question3 function Settings Section. 
{
    "question": " It is possible to break JavaScript Code into several lines",
    "answers": [{
            "textContent": "True",
            isCorrect: true
        },
        {
            "textContent": "False",
            isCorrect: false
        }
    ]
},
// question4 function Settings Section. 
{
    "question": "What does NULL refer to in Javascript",
    "answers": [{
            "textContent": "A function",
            isCorrect: false
        },
        {
            "textContent": " A string",
            isCorrect: false
        },
        {
            "textContent": "No object or no value",
            isCorrect: true
        },
        {
            "textContent": "Syntacx error",
            isCorrect: false
        }
    ]
},
// question4 function Settings Section. 
{
    "question": "What is the use of a Typeof operator in Javascript",
    "answers": [{
            "textContent": "'Typeof' is an operator used to return a string description of the type of a variable",
            isCorrect: true
        },
        {
            "textContent": "'Typeof' is an operator used to return an array description of the type of a variable",
            isCorrect: false
        },
        {
            "textContent": "'Typeof' is an operator used to return a function",
            isCorrect: false
        },
        {
            "textContent": "'Typeof' is an operator used to return a print result",
            isCorrect: false
        }
    ]
}
];

//get DOM element objects Settings Section. 
var startButton = document.querySelector(".button");
var question = document.querySelector(".question");
var questionContainer = document.querySelector(".question-container");
var answers = document.querySelectorAll(".user-choice");
var score = document.querySelector(".time-score");
var finalScore = document.querySelector(".final-score");
var gameOverContainer = document.querySelector(".game-over-container");
var scoreContainer = document.querySelector(".score-container");
var userFeedback = document.querySelector(".user-feedback");
var givenAnswers = document.querySelector(".given-answers");
var initialEntry = document.querySelector(".initial-entry");
var submitButton = document.querySelector(".button-submit");
var userEntry = document.querySelector(".user-entry");
var highScoreBoard = document.querySelector(".high-scores");
var clearScoreButton = document.querySelector(".clear-scores");
var restartQuizButton = document.querySelector(".restart-quiz");


// Game Variables Settings Section
var timeScore = 60;
var answerWaitTime = 1000;
var scoreBoardSave = {
score: "",
initials: ""
};

// Random array for question display Settings Section
var randomOrder = getRandomIntArray(0, questions.length);

// Event listeners to each answer element
for (let i = 0; i < answers.length; i++) {
answers[i].addEventListener("click", function() {
    
    userFeedback.classList.remove('hide-element');
    
    var isCorrect = answers[i].getAttribute("data-boolean");
    
    var isCorrectBool = (isCorrect.toLowerCase() === 'true')
    if (isCorrectBool) {
        userFeedback.innerHTML = "Correct";
    } else {
        timeScore = timeScore - 10;
        userFeedback.innerHTML = "Incorrect";
    }
    givenAnswers.classList.add('hide-element');
  
    setTimeout(function() {
        userFeedback.classList.add('hide-element');
        givenAnswers.classList.remove('hide-element');
        getNextQuestionOrEnd();
    }, answerWaitTime);
});
}

// Start quiz button event listener Settings Section.
startButton.addEventListener("click", function() {
// Hide quiz button, show quiz container HTML Settings Section.
startButton.classList.add('hide-element');
questionContainer.classList.remove('hide-element');
// Start score/timer Settings Section.
scoreTimerCountdown();
// Execute the quiz in random order Settings Section.
getNextQuestionOrEnd();
});

// Submit initials and score button Settings Section.
submitButton.addEventListener("click", function() {
//  final score to game Settings Section. 
scoreBoardSave.score = finalScore.innerHTML;
//  Initials Settings Section.
scoreBoardSave.initials = initialEntry.value;
// Save score to local storage Settings Section.
addLocalStorageEntry(scoreBoardSave);

generateTable();

userEntry.classList.add('hide-element');
finalScore.parentElement.classList.add('hide-element');
});

// local storage entry to be cleared Settings Section. 
clearScoreButton.addEventListener("click", function() {
existingEntries = [];
localStorage.setItem("allScoreEntries", JSON.stringify(existingEntries));
generateTable();
});

// game restart Settings Section.
restartQuizButton.addEventListener("click", function() {
window.open("index.html");
});

// populated table Settings Section.
function generateTable() {
highScoreBoard.innerHTML = "<tr><th>Initials</th><th>Score</th></tr>";

var allSavedScores = JSON.parse(localStorage.getItem("allScoreEntries"));

for (let i = 0; i < allSavedScores.length; i++) {
    const element = allSavedScores[i];
    highScoreBoard.innerHTML += "<tr><td>" + element.initials + "</td><td>" + element.score + "</td></tr>";
}
}

// array pull from local storage Settings Section


function addLocalStorageEntry(scoreBoardObject) {
// JSON Parsed and previously stored in allEntries
var existingEntries = JSON.parse(localStorage.getItem("allScoreEntries"));
if (existingEntries == null) {
    existingEntries = [];
}
localStorage.setItem("userEntry", JSON.stringify(scoreBoardObject));

existingEntries.push(scoreBoardObject);

existingEntries.sort(function(b, a) {
    return parseFloat(a.score) - parseFloat(b.score);
});

localStorage.setItem("allScoreEntries", JSON.stringify(existingEntries));
};


function getRandomIntArray(min, max) {
var returnSet = new Set();

while (returnSet.size < max) {
    var randomInt = Math.floor(Math.random() * (max - min) + min);
    returnSet.add(randomInt);
};
return Array.from(returnSet);
}

// Timer Settings Section.
function scoreTimerCountdown() {

score.innerHTML = timeScore;
var countDown = setInterval(function() {
    timeScore--;
    score.innerHTML = timeScore;
    if (timeScore <= 0) {
       
        clearInterval(countDown);
        getNextQuestionOrEnd();
    }
}, 1000);
}
//Next question function Settings Section.
function getNextQuestionOrEnd() {

if (randomOrder.length !== 0 && timeScore > 0) {
    
    var randomSelected = parseInt(randomOrder.pop());
    
    question.innerHTML = questions[randomSelected].question;
    for (let i = 0; i < answers.length; i++) {
       
        if (typeof questions[randomSelected].answers[i] === 'undefined') {
            answers[i].parentElement.classList.add('hide-element');
        } else {
            answers[i].innerHTML = questions[randomSelected].answers[i].textContent;
            answers[i].setAttribute("data-boolean", questions[randomSelected].answers[i].isCorrect);
            answers[i].parentElement.classList.remove('hide-element');
        }
    }
} else { 
    if (timeScore < 0) {
        timeScore = 0;
    }
    // Final Score Settings Section. 
    finalScore.innerHTML = timeScore;
    questionContainer.classList.add('hide-element');
    scoreContainer.classList.add('hide-element');
    gameOverContainer.classList.remove('hide-element');
    generateTable();
}
}