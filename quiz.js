//An array of multiple choice questions/answers objects, this would come from a DB or API typically
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

//get DOM element objects needed
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


// Game Variables
var timeScore = 60;
var answerWaitTime = 1000;
var scoreBoardSave = {
score: "",
initials: ""
};

//get random array for question display
var randomOrder = getRandomIntArray(0, questions.length);

//add event listeners to each answer element
for (let i = 0; i < answers.length; i++) {
answers[i].addEventListener("click", function() {
    //show feedback
    userFeedback.classList.remove('hide-element');
    //get whether correct
    var isCorrect = answers[i].getAttribute("data-boolean");
    //convert string to boolean
    var isCorrectBool = (isCorrect.toLowerCase() === 'true')
    if (isCorrectBool) {
        userFeedback.innerHTML = "Correct";
    } else {
        timeScore = timeScore - 10;
        userFeedback.innerHTML = "Incorrect";
    }
    givenAnswers.classList.add('hide-element');
    //add timeout so user can see answer feedback
    setTimeout(function() {
        userFeedback.classList.add('hide-element');
        givenAnswers.classList.remove('hide-element');
        getNextQuestionOrEnd();
    }, answerWaitTime);
});
}

//start quiz button event listener
startButton.addEventListener("click", function() {
//hide quiz button, show quiz container HTML
startButton.classList.add('hide-element');
questionContainer.classList.remove('hide-element');
//start score/timer
scoreTimerCountdown();
//execute the quiz in random order
getNextQuestionOrEnd();
});

//submit initials/score button
submitButton.addEventListener("click", function() {
//save final score to game (if not grab final-score timer value)
scoreBoardSave.score = finalScore.innerHTML;
//save initials
scoreBoardSave.initials = initialEntry.value;
//save to local storage
addLocalStorageEntry(scoreBoardSave);
//render on score card
generateTable();
//hide input fields
userEntry.classList.add('hide-element');
finalScore.parentElement.classList.add('hide-element');
});

//clear local storage entry
clearScoreButton.addEventListener("click", function() {
existingEntries = [];
localStorage.setItem("allScoreEntries", JSON.stringify(existingEntries));
generateTable();
});

//restart game
restartQuizButton.addEventListener("click", function() {
window.open("index.html");
});

//generate populated table
function generateTable() {
//clear current render
highScoreBoard.innerHTML = "<tr><th>Initials</th><th>Score</th></tr>";
//get parsed array of score objects
var allSavedScores = JSON.parse(localStorage.getItem("allScoreEntries"));
//generate each score
for (let i = 0; i < allSavedScores.length; i++) {
    const element = allSavedScores[i];
    highScoreBoard.innerHTML += "<tr><td>" + element.initials + "</td><td>" + element.score + "</td></tr>";
}
}

//pull array from local storage and add object entries to it
//https://stackoverflow.com/questions/19635077/adding-objects-to-array-in-localstorage
function addLocalStorageEntry(scoreBoardObject) {
// Parse any JSON previously stored in allEntries
var existingEntries = JSON.parse(localStorage.getItem("allScoreEntries"));
if (existingEntries == null) {
    existingEntries = [];
}
localStorage.setItem("userEntry", JSON.stringify(scoreBoardObject));
//add object to array
existingEntries.push(scoreBoardObject);
//sort array before adding to local storage - https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
existingEntries.sort(function(b, a) {
    return parseFloat(a.score) - parseFloat(b.score);
});
// Save allEntries back to local storage
localStorage.setItem("allScoreEntries", JSON.stringify(existingEntries));
};

//Get an array of random unique integers between min and max
function getRandomIntArray(min, max) {
var returnSet = new Set();
//There may be a more efficient way to do this as it will run potentially more than max variable times
while (returnSet.size < max) {
    var randomInt = Math.floor(Math.random() * (max - min) + min);
    returnSet.add(randomInt);
};
return Array.from(returnSet);
}

//Countdown Timer
function scoreTimerCountdown() {
//set score 1st for better responsiveness then initiate countdown
score.innerHTML = timeScore;
var countDown = setInterval(function() {
    timeScore--;
    score.innerHTML = timeScore;
    if (timeScore <= 0) {
        //setInterval() method returns an ID which can be used by the clearInterval() method to stop the interval.
        clearInterval(countDown);
        getNextQuestionOrEnd();
    }
}, 1000);
}

function getNextQuestionOrEnd() {
//check if there are remaining random array values
if (randomOrder.length !== 0 && timeScore > 0) {
    //get last item and remove it from array
    var randomSelected = parseInt(randomOrder.pop());
    //add question to DOM
    question.innerHTML = questions[randomSelected].question;
    for (let i = 0; i < answers.length; i++) {
        //if there are more answers than HTML elements to use them, hide the HTML element and don't populate anything
        if (typeof questions[randomSelected].answers[i] === 'undefined') {
            answers[i].parentElement.classList.add('hide-element');
        } else {
            answers[i].innerHTML = questions[randomSelected].answers[i].textContent;
            answers[i].setAttribute("data-boolean", questions[randomSelected].answers[i].isCorrect);
            answers[i].parentElement.classList.remove('hide-element');
        }
    }
} else { //else there are no more questions
    //if the final score goes below zero set to zero
    if (timeScore < 0) {
        timeScore = 0;
    }
    // show game over screen and set final score
    finalScore.innerHTML = timeScore;
    questionContainer.classList.add('hide-element');
    scoreContainer.classList.add('hide-element');
    gameOverContainer.classList.remove('hide-element');
    generateTable();
}
}