// Keep question info in external file
import { questionArray } from "./questions.js"

// User score, timer remaining, and correct answer
let score = 0;
let timeRemaining = 0;
let correctIndex = null;

// References to elements on the page
var timeEl = document.querySelector(".timer");
var descriptionEl = document.getElementById("description");
var choicesEl = document.getElementById("choices");
var choiceDescriptionEl = document.getElementById("choiceDescription");
var quizEl = document.getElementById("quiz");
var startButtonEl = document.getElementById("startButton");

// References to timer and array of questions
var countdown = null;
var questionsToAsk = [];

// Function called when View Highscores is clicked
function showHighScores() {

    // Remove any text and set up the container display
    choiceDescriptionEl.textContent = "";
    choiceDescriptionEl.setAttribute("style", "flex-direction: column;");
    startButtonEl.style.display = "none";

    // If user was in a quiz, stop the timer and quiz
    timeRemaining = 0;
    updateTimer();

    // Remove any remaining save game elements that could be remaining
    while (document.getElementById("saveGameDiv")) {
        quizEl.removeChild(document.getElementById("saveGameDiv"));
    }

    // Hide highscore link and timer when viewing the highscores
    timeEl.setAttribute("style", "display: none");
    document.getElementById("highscore-link").setAttribute("style", "display: none");

    // Get the highscores from Localstoarge
    var highscores = JSON.parse(localStorage.getItem("highscores"));

    // If no highscores exist, create a new empty array for them
    if (!highscores) {
        highscores = [];
    }

    // Sort the highscores by score
    highscores.sort((a, b) => b.userScore - a.userScore);

    // Render each highscore object as an element
    highscores.forEach((highscore, index) => {
        var highscoreEl = document.createElement("h4");
        highscoreEl.textContent = `${(index + 1)}. ${highscore.userInitials}: ${highscore.userScore} points.`;
        highscoreEl.setAttribute("style", "background-color: #999999; padding: 10px; margin: 10px 0px 0px 5px; width: 100%;");
        choiceDescriptionEl.style.width = "100%";
        choiceDescriptionEl.appendChild(highscoreEl);
    })

    // Remove older element, add new list of highscore elements
    choicesEl.removeChild(choicesEl.firstChild);
    choicesEl.appendChild(choiceDescriptionEl);

    // Set title text
    descriptionEl.innerText = "Highscores";

    // Create interactive buttons to go back and clear highscores
    createHighscoreButtons();

}

// Create the highscore page buttons for going back and clearing scores
function createHighscoreButtons() {

    // Create parent element to hold buttons
    var menuDiv = document.createElement("div");
    menuDiv.style.display = "flex";
    menuDiv.style.justifyContent = "center";
    menuDiv.setAttribute("style", "margin: 50px;");

    // Create 'go back' button
    var goBackButtonEl = createBackButton(menuDiv);

    // Create 'clear scores' button
    var clearHighscoresButtonEl = createClearScoresButton();

    // Add buttons to parent element
    menuDiv.appendChild(goBackButtonEl);
    menuDiv.appendChild(clearHighscoresButtonEl);

    // Add parent element to main element
    quizEl.appendChild(menuDiv);
}

// Function to create 'go back' button
function createBackButton(parentDiv) {
    // Create 'go back' button
    var goBackButtonEl = document.createElement("button");
    goBackButtonEl.textContent = "Go Back";
    goBackButtonEl.addEventListener("click", function () {

        // On going back, reset elements to the homepage
        choiceDescriptionEl.innerHTML = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!";
        descriptionEl.innerHTML = "Coding Quiz Challenge";

        // Remove no-longer relevant elements
        quizEl.removeChild(parentDiv);

        // Show elements that had been previously 'hidden'
        startButtonEl.style.display = "flex";
        document.getElementById("highscore-link").setAttribute("style", "display: flex");
        timeEl.setAttribute("style", "display: flex");

    });

    return goBackButtonEl;
}

// Function to create 'clear scores' button
function createClearScoresButton() {

    // Create 'clear scores' button
    var clearHighscoresButtonEl = document.createElement("button");
    clearHighscoresButtonEl.textContent = "Clear highscores";
    clearHighscoresButtonEl.addEventListener("click", function () {

        // Clear localstorage of highscores
        localStorage.clear("highscores");

        // Re-render empty highscore list
        choiceDescriptionEl.innerHTML = "";
    });

    return clearHighscoresButtonEl;
}

// Function to start playing the quiz
function playQuiz() {

    // Hide start button
    startButtonEl.style.display = "none";

    // Start timer with a number of seconds
    startClock(60);

    // Reset questions to all be valid to ask by copying external array
    questionsToAsk = [...questionArray];

    // Show the first question
    showQuestion();
}

// Function for starting the timer, called on start of a new quiz
function startClock(duractionInSeconds) {

    // Timer function, updating once per second
    timeRemaining = duractionInSeconds;
    countdown = setInterval(function () {
        if (timeRemaining > 1) {
            updateTimer();
            timeRemaining--;
        } else if (timeRemaining === 1) {
            updateTimer();
            timeRemaining--;
        } else {
            timeEl.textContent = "Time is up";
            stopGame();
            clearInterval(countdown);
        }
    }, 1000);
}

// Update the quiz timer, flash red if a wrong answer takes off 10 seconds.
function updateTimer(wrongAnswer = false) {

    // If time's up, stop the timer, render a message, and stop the quiz.
    if (timeRemaining === 0) {
        clearInterval(countdown);
        timeEl.textContent = `Time is up.`;
        stopGame();
        return;
    }

    // If quiz is still running, render new time
    timeEl.textContent = `${timeRemaining} seconds remaing`;

    // If user answered incorrectly, flash red for a second
    if (wrongAnswer) {
        timeEl.setAttribute("style", "color: red;");
    } else {
        timeEl.setAttribute("style", "color: black;");
    }
}

// Get a random question and remove it from the future question pool
function getQuestion() {

    // Get a random question from the questions array
    var randomIndex = Math.floor(Math.random() * questionsToAsk.length)
    var randomQuestion = questionsToAsk[randomIndex];

    // Delete the question that's being asked
    questionsToAsk.splice(randomIndex, 1);

    // Return the randomly chosen question
    return randomQuestion;
}

// Show a question on the screen
function showQuestion() {

    // Get a random question from an imported array
    var randomQuestion = getQuestion();

    // If there are no more questions, end the game
    if (randomQuestion === undefined) {
        stopGame();
        return;
    }

    // Show that random question on screen
    var questionEl = document.getElementById("description");
    questionEl.textContent = randomQuestion.question;

    // Add answers based on the question to the DOM
    var ansEl = document.getElementById("choiceDescription");
    ansEl.textContent = "";

    // Create and render a button answer element for each answer
    randomQuestion.answers.forEach((answer, index) => {
        var ans = document.createElement("button");
        ans.textContent = ((index + 1) + ": " + answer);
        ans.setAttribute("style", "display: block; height: 40px;")
        ans.setAttribute("index", index);
        ansEl.appendChild(ans);
    })

    // Save the correct index of the question to check against later
    correctIndex = randomQuestion.correctAnsIndex;

}

// Update and validate the score
function changeScore(value) {
    score = score + value;
    if (score < 0) {
        score = 0;
    }
}

// Stop the game if time is up or there are no more questions
function stopGame() {

    // Stop the timer
    clearInterval(countdown);

    // Clear html of choices div to display score message
    choicesEl.textContent = "";

    // Display large end game message
    descriptionEl.textContent = "All Done!";

    // Create score message and play again button
    var thanksMessageEl = document.createElement("h3");
    thanksMessageEl.textContent = `Your final score was ${score}.`;

    // Create the elements to handle saving a user's game data
    createSaveGameElements();

    // Render thanks message with user's score
    choicesEl.appendChild(thanksMessageEl);
}

// Dynamically create elements to save a user's game
function createSaveGameElements() {

    // Create parent element
    var saveDivEl = document.createElement("div");
    saveDivEl.className = "saveGameDiv";
    saveDivEl.id = "saveGameDiv";

    // Create instruction element
    var saveMessageEl = document.createElement("h4");
    saveMessageEl.textContent = "Enter Initials:";
    saveMessageEl.setAttribute("style", "margin-right: 10px;");

    // Create text input for user's initials
    var saveNameInputEl = document.createElement("input");
    saveNameInputEl.setAttribute("type", "text");
    saveNameInputEl.setAttribute("style", "margin-right: 10px;");

    // Function to save a user's game
    function saveGame() {

        // Get highscore data from localstorage
        var highscores = JSON.parse(localStorage.getItem("highscores"));

        // If highscores already exists, add an object for the game data
        if (highscores) {
            highscores.push({
                userInitials: saveNameInputEl.value,
                userScore: score
            })

            // If no array exists, create a new one with the game data
        } else {
            highscores = [{
                userInitials: saveNameInputEl.value,
                userScore: score
            }]
        }

        // Set the highscores data back with the newly added entry
        localStorage.setItem("highscores", JSON.stringify(highscores));

        // Reset the score
        score = 0;

        // Make sure there's no more buttons to save another game
        if (saveDivEl) {
            quizEl.removeChild(saveDivEl);
        }

        // Show the highscores of the game
        showHighScores();

    }

    // Create submit button for submitting user's game data
    var saveButtonEl = document.createElement("button");
    saveButtonEl.textContent = "Submit";

    // Set up event-handler 
    saveButtonEl.addEventListener("click", saveGame);

    // Add save elements to parent element
    saveDivEl.appendChild(saveMessageEl);
    saveDivEl.appendChild(saveNameInputEl);
    saveDivEl.appendChild(saveButtonEl);

    // Add parent element to main quiz element
    quizEl.appendChild(saveDivEl);
}

// Sets up event listeners
function init() {

    // Set start button to play the quiz
    document.getElementById("startButton").addEventListener("click", function () {
        playQuiz();
    });

    // Set the 'view highscore' link to show the highscores
    document.getElementById("highscore-link").addEventListener("click", function () {
        showHighScores();
    });

    // Handle answering questions
    document.getElementById("choiceDescription").addEventListener("click", function (event) {

        // Get whichever answer button was selected
        var element = event.target;

        // Make sure element was a button first
        if (element.matches("button")) {

            // If button was the correct answer, increase the score and show the nect question
            if (parseInt(element.getAttribute('index')) === correctIndex) {
                changeScore(1);
                updateTimer();
                showQuestion();

                // If the button was wrong, take off a point, 10 seconds, and show the next question
            } else {
                changeScore(-1);
                if (timeRemaining >= 10) {
                    timeRemaining = timeRemaining - 10;
                } else {
                    timeRemaining = 0;
                }
                updateTimer(true);
                showQuestion();
            }
        }
    });

}

init();
questionsToAsk = [...questionArray];