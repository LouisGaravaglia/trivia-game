
// =============================================================== MAIN FUNCTION ===============================================================

/**
 * Main function which when called will call 5 other functions in
 * order to make a call to the API and generate HTML.
 * 
 * @param {number} height Number of rows of Jeopardy questions.
 * @param {number} width  Number of columns of Jeopardy questions.
 * @returns {void}        Returns nothing.
 */
async function setUp(height, width) {
    // const HEIGHT = height;
    // const WIDTH = width


    const categories = await getCategories(100);
    const {
        selectCats,
        titles
    } = await getSelects(categories, width);
    const board = await getClues(selectCats, height, width);
    makeHtmlBoard(height, width, board, titles);
    removeLoading();
}

setUp(5, 6);

// =============================================================== CLICK EVENTS ===============================================================


/**
 * @type {HTML Element} Container that holds all of the questions/answer data cells, that we need to listen for the user clicks.
 */
const cardContainer = document.querySelector(".card-container");



/**
 * Event listener which calls the cardContainerClick() function
 * in order to pass the money & testingAnswer values to HTML elements
 * to be called upon at a later time.
 */
cardContainer.addEventListener("click", (e) => {
    let {
        money,
        testingAnswer
    } = cardContainerClick(e);

    $("#hidden-answer").val(testingAnswer);
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

    if (e.target.classList.contains("title-box")) return;

    if (e.target.localName === "p") {
        money = e.target.parentElement;
        question = e.target.parentElement.parentElement.children[1];
        passingQuestion = question.innerText;
        answer = e.target.parentElement.parentElement.lastChild;
    } else {
        money = e.target;
        question = e.target.parentElement.children[1];
        passingQuestion = question.innerText;
        answer = e.target.parentElement.lastChild;
    }


    let answerFull = answer.innerText;
    let testingAnswer = answerFull.replace(/[^A-Za-z0-9]/g, '');

    money.classList.add("flip");
    question.classList.toggle("flip");


    clockTicking(10, question, answer);

    return {
        money: money,
        testingAnswer: testingAnswer,
    };
}


/**
 * @type {HTML Element} Submit button that the user clicks to submit their answer.
 */
const submitBtn = document.querySelector("#button-addon2");



/** 
 * @type {Event Listener} Click event on the submitBtn which is needed to pass the value of the user's answer.
 */
submitBtn.addEventListener("click", () => {

    const typeField = document.querySelector(".form-control");
    let guessFull = _.toUpper(typeField.value);
    let guess = guessFull.replace(/[^A-Za-z0-9]/g, '');

    let addScore = checkingAnswer(guess);

    if (addScore == undefined) {
        typeField.value = "";
        $("#stop-timer").val(true);

    } else {
        $("#stop-timer").val(true);

        ifCorrect(addScore);
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
    let answer = $("#hidden-answer").val();
    let correctAnswer = _.toUpper(answer);
    let money = $("#hidden-money").val();
    let moneySlice = money.innerText.slice(1);
    let moneyAmount = parseInt(moneySlice);

    if (guess === correctAnswer) {
        const correctContainer = document.querySelector(".correct-container");
        correctContainer.classList.toggle("flip");
        setTimeout(() => {
            correctContainer.classList.toggle("flip");
        }, 1500);
        return moneyAmount


    } else {
        const wrongContainer = document.querySelector(".wrong-container");
        wrongContainer.classList.toggle("flip");
        setTimeout(() => {
            wrongContainer.classList.toggle("flip");
        }, 1500);
        return undefined;
    }
}


/**
 * ifCorrect() function adds the Money value for the question answered to the existing score
 * in sessionStorage, as sets the score in sessionStorage in order to retreive it to add up next time.
 * 
 * @param {number} addScore Money value for question parsed as an integer in order to add up Score.
 * @returns {void}          Returns nothing.
 */
const ifCorrect = (addScore) => {
    const displayScore = document.querySelector(".score");
    const getScore = sessionStorage.getItem("score");
    let score = parseInt(getScore);

    if (!score) score = 0;
    score += addScore;

    displayScore.innerText = `SCORE: $${score}`
    sessionStorage.setItem("score", `${score}`);
}



// =============================================================== DOM ELEMENT FUNCTIONS ===============================================================



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
    const WIDTH = width;
    for (let i = 0; i < WIDTH; i++) {
        let randomNum = Math.floor(Math.random() * 100);
        const res = await axios.get("https://jservice.io/api/clues", {
            params: {
                category: categories[randomNum].id
            }
        });
        selectCats.push(res.data);

    }

    for (let i = 0; i < WIDTH; i++) {
        titles.push(selectCats[i][0].category.title)
    }

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
 * @param {number} HEIGHT       Number of rows of Jeopardy questions.
 * @param {number} WIDTH        Number of columns of Jeopardy questions.
 * @returns {array}             2D array containing question/answer/categories for each card.
 */
async function getClues(selectCats, HEIGHT, WIDTH) {
    const board = new Array(HEIGHT);
    for (let i = 0; i < HEIGHT; i++) {
        board[i] = new Array(WIDTH);
    }

    for (let j = 0; j < WIDTH; j++) {
        for (let k = 0; k < HEIGHT; k++) {
            board[k][j] = {
                title: selectCats[j][k].category.title,
                question: selectCats[j][k].question,
                answer: selectCats[j][k].answer
            };
        }
    }
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
    const HEIGHT = height;
    const WIDTH = width;
    const BOARD = board;
    const htmlBoard = document.querySelector("#board");

    const top = makeTopRow(WIDTH, titles);
    htmlBoard.append(top);

    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");

        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.classList.add("card-box");

            const moneyDiv = document.createElement("div");
            moneyDiv.setAttribute("data-name", "MONEY")
            moneyDiv.classList.add("money-amount");

            const moneyText = document.createElement("p");
            moneyText.innerText = `$${(y+1)*2}00`;

            const questionDiv = document.createElement("div");
            questionDiv.setAttribute("data-key", `${y}-${x}`)
            questionDiv.classList.add("card-front");
            questionDiv.classList.add("flip");

            const questionText = document.createElement("p");
            questionText.setAttribute("data-name", "P")
            questionText.innerText = _.toUpper(BOARD[y][x].question);

            const answerDiv = document.createElement("div");
            answerDiv.classList.add("card-back");
            answerDiv.classList.add("flip");

            const answerText = document.createElement("p");
            answerText.innerText = _.toUpper(BOARD[y][x].answer);

            moneyDiv.append(moneyText);
            questionDiv.append(questionText);
            answerDiv.append(answerText);
            cell.append(moneyDiv);
            cell.append(questionDiv);
            cell.append(answerDiv)
            row.append(cell);
        }

        htmlBoard.append(row);
    }
    return htmlBoard;
}

/**
 * makeTopRow() function creates an Table Row HTML Element to store
 * the title values and display them.
 * 
 * @param {number} WIDTH    Number of columns of Jeopardy questions.
 * @param {array} titles    Array that holds the category of the Jeopardy question.
 * @returns {HTML Element}  Displays the Table Row above the questions.
 */
function makeTopRow(WIDTH, titles) {
    const topRow = document.createElement("tr");

    topRow.setAttribute("id", "column-top");

    for (let x = 0; x < WIDTH; x++) {
        const titleCell = document.createElement("td");
        titleCell.setAttribute("id", x);

        const titleBox = document.createElement("div");
        titleBox.classList.add("title-box");

        const title = document.createElement("p");
        title.innerText = _.toUpper(titles[x]);

        titleBox.append(title);
        titleCell.append(titleBox);
        topRow.append(titleCell);
    }
    return topRow;
}



/**
 * removeLoading() removeds the loading "JEOPARDY" HTML element, since it's purpose is
 * mainly to function as a placeholder until the API call has returned.
 * 
 * @returns {void}  Returns nothing.
 */
function removeLoading() {
    const loadingContainer = document.querySelector(".loading-container");
    const inputContainer = document.querySelector(".input-group");
    const scoreContainer = document.querySelector(".score-container");
    const resetContainer = document.querySelector(".reset-container");
    loadingContainer.classList.toggle("flip");
    inputContainer.classList.toggle("flip");
    scoreContainer.classList.toggle("flip");
    resetContainer.classList.toggle("flip");
    sessionStorage.setItem("score", `000`);
}

const reset = document.querySelector(".reset");
reset.addEventListener("click", () => {
    window.location.reload(false);
})





// =============================================================== CLOCK TICKING FUNCTION ===============================================================





/**
 * clockTicking() function gets a hold of several DOM elements in order
 * to manipulate them by timerInterval() to create a ticking clock.
 * 
 * @param {number} TIME_LIMIT Number value to start the clock ticking from.
 * @param {string} question   String value of the question that was clicked by user.
 * @param {string} answer     String value of the answer to the question that was clicked by user.
 * @returns {void}            Returns nothing.
 */
function clockTicking(TIME_LIMIT, question, answer) {
    const body = document.querySelector("body");

    const clockContainer = document.createElement("div");
    clockContainer.classList.add("clock-container");

    const clockBox = document.createElement("div");
    clockBox.classList.add("clock-box");

    const clock = document.createElement("h1");
    clock.classList.add("danger", "clock");
    clock.innerText = `00:${TIME_LIMIT}`;

    clockBox.append(clock);
    clockContainer.append(clockBox);
    body.append(clockContainer);


    timerInterval(TIME_LIMIT, clock, clockContainer, question, answer);
}


/**
 * timerInterval() function uses a setInterval of 1000 miliseconds to update the innerText
 * of the clock HTML element in order to create a ticking clock for the user to race against.
 * 
 * @param {number} TIME_LIMIT            Number value to start the clock ticking from.
 * @param {HTML Element} clock           HTML Element that holds the innerText of the TIME_LIMIT value.
 * @param {HTML Element} clockContainer  HTML Element that holds the clock element.
 * @param {string} question              String value of the question that was clicked by user.
 * @param {string} answer                String value of the answer to the question that was clicked by user.
 * @returns {void}
 */
function timerInterval(TIME_LIMIT, clock, clockContainer, question, answer) {
    let timePassed = 0;
    $("#stop-timer").val(false);

    let timer = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;

        clock.innerText = `00:0${timeLeft}`;

        if ($("#stop-timer").val()) {
            clearInterval(timer);
            clockContainer.classList.add("flip");
            question.classList.toggle("flip");
            answer.classList.remove("flip");
        }

        if (timeLeft === 0) {
            const timesUpContainer = document.querySelector(".times-up-container");
            timesUpContainer.classList.toggle("flip");
            setTimeout(() => {
                timesUpContainer.classList.toggle("flip");
            }, 1500);

            clearInterval(timer);
            clockContainer.classList.add("flip");
            question.classList.toggle("flip");
            answer.classList.remove("flip");
        }
    }, 1000);
}