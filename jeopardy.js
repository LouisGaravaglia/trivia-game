// =============================================================== MAIN FUNCTION ===============================================================


/**
 * Main function which when called will call 5 other functions in
 * order to make a call to the API and generate HTML.
 * 
 * @param {number} height Number of rows of Jeopardy questions.
 * @param {number} width  Number of columns of Jeopardy questions.
 * @returns {void}        Returns nothing.
 */
async function main(height, width) {

    const categories = await getCategories(100);

    const {
        selectCats,
        titles
    } = await getSelects(categories, width);

    const board = await getClues(selectCats, height, width);

    //calling makeHtmlBoard() to populate the correct number of Jeopardy questions/answers/money value to the assigned width and height.
    makeHtmlBoard(height, width, board, titles);

    //calling hideLoadingAndShowGame() to remove the "JEOPARDY" loding HTML Elment, and show game board after the API has responded.
    hideLoadingAndShowGame();

}


main(5, 6);


// =============================================================== CLICK EVENTS ===============================================================


/**
 * Global variable to hold value of Div with a class of "card-container", in order to add a click event.
 * 
 * @type {HTML Element} Container that holds all of the questions/answer data cells, that we need to listen for the user clicks.
 */
const cardContainer = document.querySelector(".card-container");

/**
 * Event listener which calls the cardContainerClick() function
 * in order to pass the money & minifiedAnswer values to HTML elements
 * to be called upon at a later time.
 * 
 * @event {click} cardContainer Click event on the cardContainer.
 */
cardContainer.addEventListener("click", (e) => {

    const {
        money,
        minifiedAnswer
    } = cardContainerClick(e);

    $("#hidden-answer").val(minifiedAnswer);
    $("#hidden-money").val(money);

})


/**
 * Uses the event that was clicked in order to get a hold
 * of several DOM elements in order to pass them to other functions.
 * 
 * @param {HTML Element} e Event that was clicked.
 * @returns {void}         Returns nothing.
 */
function cardContainerClick(e) {

    let money;
    let question;
    let answer;

    if (e.target.classList.contains("title-box")) return;

    //Conditional to check to see if the event clicked was the text displaying the money amount / otherwise it's the div.
    if (e.target.localName === "p") {

        money = e.target.parentElement;
        question = e.target.parentElement.parentElement.children[1];
        answer = e.target.parentElement.parentElement.lastChild;

    } else {

        money = e.target;
        question = e.target.parentElement.children[1];
        answer = e.target.parentElement.lastChild;

    }

    money.classList.add("flip");
    question.classList.toggle("flip");

    clockTicking(10, question, answer);

    const htmlStrippedAnswer = answer.innerText.replace(/(<([^>]+)>)/ig, "");
    const minifiedAnswer = htmlStrippedAnswer.replace(/[^A-Za-z0-9]/g, '');

    console.log(minifiedAnswer);

    return {
        money: money,
        minifiedAnswer: minifiedAnswer,
    };

}


/**
 * Global variable to hold value of the button with an ID of "button-addon2", in order to add a click event.
 *
 * @type {HTML Element} Submit button that the user clicks to submit their answer.
 */
const submitBtn = document.querySelector("#button-addon2");


/** 
 * Click event on submitBtn in order to get ahold of the answer that the user typed into the input.
 * 
 * @event {click} submitBtn Event on the submitBtn which is needed to pass the value of the user's answer.
 */
submitBtn.addEventListener("click", () => {

    const typeField = document.querySelector(".form-control");
    const guessFull = _.toUpper(typeField.value);
    const guess = guessFull.replace(/[^A-Za-z0-9]/g, '');
    const moneyAmount = checkingAnswer(guess);

    if (moneyAmount == undefined) {

        typeField.value = "";

        $("#stop-timer").val(true);

    } else {

        $("#stop-timer").val(true);

        ifCorrect(moneyAmount);

        typeField.value = "";
    }

});


/**
 * checkingAnswer() function checks the value of guess against the correctAnswer
 * in order to determine if the user guess correctly or not. 
 * 
 * @param {string} guess Answer from the user.
 * @returns {number}     Returns the money amount that is associated with that question.
 */
function checkingAnswer(guess) {

    const answer = $("#hidden-answer").val();
    const correctAnswer = _.toUpper(answer);
    const money = $("#hidden-money").val();
    const moneySlice = money.innerText.slice(1);
    const moneyAmount = parseInt(moneySlice);
    
    if (guess === correctAnswer) { 

        const correctContainer = document.querySelector(".correct-container");
        const body = document.querySelector("body");
        const noClickContainer = document.createElement("div");

        noClickContainer.classList.add("no-clicking-container");
        body.append(noClickContainer);

        correctContainer.classList.toggle("flip");

        setTimeout(() => {

            correctContainer.classList.toggle("flip");
            noClickContainer.classList.toggle("flip");

        }, 1500);

        return moneyAmount

    } else {

        const wrongContainer = document.querySelector(".wrong-container");
        const body = document.querySelector("body");
        const noClickContainer = document.createElement("div");

        noClickContainer.classList.add("no-clicking-container");
        body.append(noClickContainer);

        wrongContainer.classList.toggle("flip");

        setTimeout(() => {

            wrongContainer.classList.toggle("flip");
            noClickContainer.classList.toggle("flip");

        }, 1500);

        return undefined;

    }

}


/**
 * ifCorrect() function adds the Money value for the question answered to the existing score
 * in sessionStorage, as sets the score in sessionStorage in order to retreive it to add up next time.
 * 
 * @param {number} moneyAmount Money value for question parsed as an integer in order to add up Score.
 * @returns {void}             Returns nothing.
 */
const ifCorrect = (moneyAmount) => {

    const displayScore = document.querySelector(".score");
    const getScore = sessionStorage.getItem("score");
    let score = parseInt(getScore);

    if (!score) score = 0;

    score += moneyAmount;

    displayScore.innerText = `SCORE: $${score}`

    sessionStorage.setItem("score", `${score}`);

}


/**
 * Global variable to hold the value of the Div with a class of "reset".
 * 
 * @type {HTML Element} Reset button that the user clicks to reset the game board.
 */
const reset = document.querySelector(".reset");


/** 
 * Click event that will clear the state and reset the gameboard when the reset button is clicked.
 * 
 * @event {click} reset Click event on the reset button in order to clear state.
 */
reset.addEventListener("click", () => {

    const loadingContainer = document.querySelector(".loading-container");
    const inputContainer = document.querySelector(".input-group");
    const scoreContainer = document.querySelector(".score-container");
    const resetContainer = document.querySelector(".reset-container");
    const gameBoard = document.querySelector("#board");

    gameBoard.innerHTML = "";

    inputContainer.classList.toggle("flip");
    scoreContainer.classList.toggle("flip");
    resetContainer.classList.toggle("flip");

    loadingContainer.classList.toggle("flip");

    sessionStorage.setItem("score", `000`);

    $("#stop-timer").val(true);

    main(5, 6);

})


// =============================================================== API CALL FUNCTIONS & SETTING UP GAME BOARD ===============================================================


/**
 * getCategories() function makes a call to the API and pushes sorted data into an array to then
 * be used by getSelects() function.
 * 
 * @param {number} num  Number value to determine how many categories to retrieve from the API.
 * @returns {array}     Returns an array of the categories parsed from the API data.
 */
async function getCategories(num) {

    const categories = [];
    const res = await axios.get("https://jservice.io/api/categories", {
        params: {
            count: num
        }
    });
    const list = res.data

    for (const item of list) {

        categories.push({
            id: item.id,
            title: item.title
        });

    }

    return categories;

};


/**
 * getSelects() function makes a call to the API in order to collect a random number of catergories of Jeopardy questions
 * based off the width chosen, and the randomNum selected. We'll then push this info into two different arrays 
 * to then use with getClues(), makeHtmlBoard(), and topRow()
 * 
 * @param {*} categories    Array of objects that contain categories to choose from for questions.
 * @param {*} width         Number of columns of Jeopardy questions.
 * @returns {object}        Returns an object with a widdled down list of catergories based of the width, and their titles.
 */
async function getSelects(categories, width) {

    const selectCats = [];
    const titles = [];

    for (let i = 0; i < width; i++) {

        const randomNum = Math.floor(Math.random() * 100);

        //Randomly pick a category from 100 choices from the return value of the API.
        const res = await axios.get("https://jservice.io/api/clues", {
            params: {
                category: categories[randomNum].id
            }
        });

        //Push that category to selectCats.
        selectCats.push(res.data);

    }

    //Loop over the selectCats array to get a hold of the title of each category and push to it's own array.
    for (let i = 0; i < width; i++) {
        titles.push(selectCats[i][0].category.title)
    }

    //Return selectCats and titles to use in getClues() and makeHtmlBoard().
    return {
        selectCats: selectCats,
        titles: titles
    };

}


/**
 * getClues() function creates a 2D array called board in order to then populate with the caterogry, question,
 * and answer to then return and be used to populate HTML Elements with.
 * 
 * @param {array} selectCats    Array for the appropriate number of categories, which will then be deconstructed.
 * @param {number} height       Number of rows of Jeopardy questions.
 * @param {number} width        Number of columns of Jeopardy questions.
 * @returns {array}             2D array containing question/answer/categories for each card.
 */
async function getClues(selectCats, height, width) {

    //board is set to a array with the length of height.
    const board = new Array(height);

    //Loop to create a 2D array with an array with length of width for reach index of the board array.
    for (let i = 0; i < height; i++) {
        board[i] = new Array(width);
    }

    //Loop to set the value of each index of the 2D array with a category title, question, and answer.
    for (let j = 0; j < width; j++) {
        for (let k = 0; k < height; k++) {
            board[k][j] = {
                title: selectCats[j][k].category.title,
                question: selectCats[j][k].question,
                answer: selectCats[j][k].answer
            };
        }
    }

    //Returning the board to be used in makeHtmlBoard().
    return board;

};


/**
 * makeHtmlBoard() function created several HTML Table rows and data cells in order to the populate
 * with the questions, answers, and category titles.
 * 
 * @param {number} height  Number of rows of Jeopardy questions.
 * @param {number} width   Number of columns of Jeopardy questions.
 * @param {array} board    2D array containing question/answer/categories for each card.
 * @param {array} titles   Array holding just the categories for each column.
 * @returns {HTML Element} Returns the HTML table populated with all questions/answers/categories.
 */
async function makeHtmlBoard(height, width, board, titles) {

    //Get a hold of the table with an ID of "#board".
    const htmlBoard = document.querySelector("#board");

    //Call makeTopRow() to populate the top row of the game board with the category titles.
    const top = makeTopRow(width, titles);

    //Add the top row to the table htmlBoard.
    htmlBoard.append(top);

    //Run a loop to assign a table row element to each index of height.
    for (let y = 0; y < height; y++) {
        const row = document.createElement("tr");

        //Run a loop to assign table data cells to each value in the 2D array.
        for (let x = 0; x < width; x++) {

            //Create the data cell and add the class of ".card-box".
            const cell = document.createElement("td");
            cell.classList.add("card-box");

            //Create a div to contain how much money that question is worth and a data-name attribute to keep track.
            const moneyDiv = document.createElement("div");
            moneyDiv.setAttribute("data-name", "MONEY")
            moneyDiv.classList.add("money-amount");

            //Create a paragraph element with its innerText to be incrementing values by $200, starting at $200, from the the top.
            const moneyText = document.createElement("p");
            moneyText.innerText = `$${(y+1)*2}00`;

            //Create a div to contain a unique data-key and a class list of ".flip" to start it out as disply: none.
            const questionDiv = document.createElement("div");
            questionDiv.setAttribute("data-key", `${y}-${x}`)
            questionDiv.classList.add("card-front");
            questionDiv.classList.add("flip");

            //Create a paragraph element to contain the appropriate question from the category.
            const questionText = document.createElement("p");
            questionText.setAttribute("data-name", "P")
            const capitalizedQuestion = _.toUpper(board[y][x].question);
            questionText.innerText = capitalizedQuestion.replace(/(<([^>]+)>)/ig, "");

            //Create a div to hold the answer and a class list of ".flip" to start it out as disply: none.
            const answerDiv = document.createElement("div");
            answerDiv.classList.add("card-back");
            answerDiv.classList.add("flip");

            //Create a paragraph element whose innerText is set to the appropriate answer from the category.
            const answerText = document.createElement("p");
            const capitalizedAnswer = _.toUpper(board[y][x].answer);
            answerText.innerText = capitalizedAnswer.replace(/(<([^>]+)>)/ig, "");

            //Append elements to their parent divs, then append divs to the data cell, then append data cell to the row. (Repeat width x height times)
            moneyDiv.append(moneyText);
            questionDiv.append(questionText);
            answerDiv.append(answerText);
            cell.append(moneyDiv);
            cell.append(questionDiv);
            cell.append(answerDiv)
            row.append(cell);
        }

        //Append the row to the htmlBoard (Repeat height times)
        htmlBoard.append(row);
    }

}


/**
 * makeTopRow() function creates an Table Row HTML Element to store
 * the title values and display them.
 * 
 * @param {number} width    Number of columns of Jeopardy questions.
 * @param {array} titles    Array that holds the category of the Jeopardy question.
 * @returns {HTML Element}  Displays the Table Row above the questions.
 */
function makeTopRow(width, titles) {

    //Create a table row element to add category titles.
    const topRow = document.createElement("tr");

    //Add attribute of id to "column-top".
    topRow.setAttribute("id", "column-top");

    //Loop of the width of the row to a table data cell.
    for (let x = 0; x < width; x++) {
        const titleCell = document.createElement("td");
        titleCell.setAttribute("id", x);

        //Create a div to hold the title paragraph element.
        const titleBox = document.createElement("div");
        titleBox.classList.add("title-box");

        //Create a paragraph elmenet to hold the capitalized title.
        const title = document.createElement("p");
        title.innerText = _.toUpper(titles[x]);

        //Append the title to its parent div, then the div to the topRow.
        titleBox.append(title);
        titleCell.append(titleBox);
        topRow.append(titleCell);
    }

    //Return topRow to be used in makeHtmlBoard().
    return topRow;

}


/**
 * hideLoadingAndShowGame() removeds the loading "JEOPARDY" HTML element, since it's purpose is
 * mainly to function as a placeholder until the API call has returned.
 * 
 * @returns {void}  Returns nothing.
 */
function hideLoadingAndShowGame() {

    //Create a variable for the container that holds the "JEOPARDY" text to show when loading API content.
    const loadingContainer = document.querySelector(".loading-container");

    //Create a variable for the input where the user enters their guess.
    const inputContainer = document.querySelector(".input-group");

    //Create a variable for the container that holds the score value.
    const scoreContainer = document.querySelector(".score-container");

    //Create a variable for the container that holds the reset button.
    const resetContainer = document.querySelector(".reset-container");

    //Toggle the flip class on to hide the loading "JEOPARDY" text.
    loadingContainer.classList.toggle("flip");

    //Toggle the flip class off on these rest to reveal them.
    inputContainer.classList.toggle("flip");
    scoreContainer.classList.toggle("flip");
    resetContainer.classList.toggle("flip");

    //Set the score to "000" to start the game off.
    sessionStorage.setItem("score", `000`);

}


// =============================================================== CLOCK TICKING FUNCTION ===============================================================


/**
 * clockTicking() function gets a hold of several DOM elements in order
 * to manipulate them by timerInterval() to create a ticking clock.
 * 
 * @param {number} timeLimit  Number value to start the clock ticking from.
 * @param {string} question   String value of the question that was clicked by user.
 * @param {string} answer     String value of the answer to the question that was clicked by user.
 * @returns {void}            Returns nothing.
 */
function clockTicking(timeLimit, question, answer) {

    //Get a hold of the body.
    const body = document.querySelector("body");

    //Create a container div to contain the clock box.
    const clockContainer = document.createElement("div");
    clockContainer.classList.add("clock-container");

    //Create a box div to contain the h1 clock
    const clockBox = document.createElement("div");
    clockBox.classList.add("clock-box");

    //Create a h1 element to hold the countdown clock.
    const clock = document.createElement("h1");
    clock.classList.add("danger", "clock");
    clock.innerText = `00:${timeLimit}`;

    //Append the clock container and its children to the body.
    clockBox.append(clock);
    clockContainer.append(clockBox);
    body.append(clockContainer);

    //Call timerInterval() to start the clock countdown.
    timerInterval(timeLimit, clock, clockContainer, question, answer);

}


/**
 * timerInterval() function uses a setInterval of 1000 miliseconds to update the innerText
 * of the clock HTML element in order to create a ticking clock for the user to race against.
 * 
 * @param {number} timeLimit             Number value to start the clock ticking from.
 * @param {HTML Element} clock           HTML Element that holds the innerText of the timeLimit value.
 * @param {HTML Element} clockContainer  HTML Element that holds the clock element.
 * @param {string} question              String value of the question that was clicked by user.
 * @param {string} answer                String value of the answer to the question that was clicked by user.
 * @returns {void}
 */
function timerInterval(timeLimit, clock, clockContainer, question, answer) {

    //Initialize timePassed to be set to 0.
    let timePassed = 0;
    let timeLeft;

    //Initialize the value of "#stop-timer" to false so that the count down continues.
    $("#stop-timer").val(false);

    //Establish and run the timer every second.
    let timer = setInterval(() => {

        //Use timePassed to keep track of how much time has passed.
        timePassed = timePassed += 1;

        //Subtrack timePassed by the designated timeLimit to get timeLeft.
        timeLeft = timeLimit - timePassed;

        //Display timeLeft as the clock's element innerText.
        clock.innerText = `00:0${timeLeft}`;

        //Condtional to see if "#stop-timer" value is set to "true", if so stop the timer and hide the question and show the answer.
        if ($("#stop-timer").val()) {
            clearInterval(timer);
            clockContainer.classList.add("flip");
            question.classList.toggle("flip");
            answer.classList.remove("flip");
        }

        //If the timer has run out of time.
        if (timeLeft === 0) {

            //Display the "TIME'S UP" container, then remove it after a second and half.
            const timesUpContainer = document.querySelector(".times-up-container");

            //Get a hold of the body.
            const body = document.querySelector("body");

            //Create a container to block the user from cliking any DOM elements.
            const noClickContainer = document.createElement("div");
            noClickContainer.classList.add("no-clicking-container");

            //Append the noClickContainer to the body.
            body.append(noClickContainer);

            //Display the "TIME'S UP" container, then remove it after a second and half.
            timesUpContainer.classList.toggle("flip");

            //Remove the "TIME'S UP" alert and the no cliking div after a second and half.
            setTimeout(() => {
                timesUpContainer.classList.toggle("flip");
                noClickContainer.classList.toggle("flip");
            }, 1500);

            //Clear the timer, hide the question, and show the answer.
            clearInterval(timer);
            clockContainer.classList.add("flip");
            question.classList.toggle("flip");
            answer.classList.remove("flip");
        }
    }, 1000);

}