async function setUp(height, width) {
    const HEIGHT = height;
    const WIDTH = width
    const TIME_LIMIT = 10;

    const categories = await getCategories(100);
    const {
        selectCats,
        titles
    } = await getSelects(categories, WIDTH);
    const board = await getClues(selectCats, HEIGHT, WIDTH);
    const htmlBoard = await makeHtmlBoard(HEIGHT, WIDTH, board, titles);
    listening(TIME_LIMIT);



}

setUp(5, 6);




function listening(TIME_LIMIT) {
    const cards = document.querySelectorAll(".money-amount");
    const cardContainer = document.querySelector(".card-container");

    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            let money;
            let question;
            let passingQuestion;
            let answer;

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

            console.log(money);

            money.classList.add("flip");
            question.classList.toggle("flip");

            const submitBtn = $("#button-addon2");

            submitEvent(submitBtn, answer, money);
            clockTicking(TIME_LIMIT, answer, money);
            setTimeout(() => {

                question.classList.toggle("flip");
                answer.classList.remove("flip");
            }, 9000);

            return {
                money: money,
                answer: answer,
                submitBtn: submitBtn
            };
        })
    })
}






function checkingAnswer(guess, answer, money) {
    correctAnswer = _.toUpper(answer.innerText);
    money = money.innerText.slice(1);
    moneyAmount = parseInt(money);

    sessionStorage.setItem("answer", `${correctAnswer}`);
    const retrievedAnswer = sessionStorage.getItem("answer");

    sessionStorage.setItem("guess", `${guess}`);
    const retrievedGuess = sessionStorage.getItem("guess");

    if (retrievedGuess === retrievedAnswer ) {
        console.log("this is RIGHT answer");
        console.log(`right guess: ${retrievedGuess}`);
        console.log(`right answer: ${retrievedAnswer}`);
        // console.log(`this is right answerArray[0]: ${retrievedAnswer }`);
        // console.log(`this is right answerArray[1]: ${answerArray[1]}`);


        return moneyAmount

    } else {
        console.log("this is WRONG answer");
        console.log(`wrong guess: ${retrievedGuess}`);
        console.log(`wrong answer: ${retrievedAnswer }`);
        // console.log(`this is wrong answerArray: ${answerArray[0]}`);
        // console.log(`this is wrong answerArray[1]: ${answerArray[1]}`);

        return undefined;
    }

}

const ifCorrect = (addScore) => {
    const displayScore = document.querySelector(".score");
    const getScore = sessionStorage.getItem("score");
    let score = parseInt(getScore);

    console.log(`this is the score before adding: ${score}`);

    if (!score) score = 0;
    score += addScore;


    displayScore.innerText = `SCORE:$${score}`
    sessionStorage.setItem("score", `${score}`);
}


function clockTicking(TIME_LIMIT, answer, money) {
    const body = document.querySelector("body");
    let timePassed = 0;


    const clockContainer = document.createElement("div");
    clockContainer.classList.add("clock-container");

    const clockBox = document.createElement("div");
    clockBox.classList.add("clock-box");

    const clock = document.createElement("h1");
    clock.classList.add("danger", "clock");
    clock.innerText = `00:0${TIME_LIMIT}`;

    clockBox.append(clock);
    clockContainer.append(clockBox);
    body.append(clockContainer);



    console.log(answer.innerText);





    let timer = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;

        clock.innerText = `00:0${timeLeft}`;

        if (timeLeft === 0) {

            ///////////////////////////ADD TIMES UP! RESPONSE
            clearInterval(timer);
            clockContainer.classList.add("flip");
        }
    }, 1000);
}





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






// const submitBtn = $("#button-addon2");

// submitEvent(submitBtn, guess);

const submitEvent = (submitBtn, answer, money) => {

    submitBtn.on("click", () => {

        const typeField = document.querySelector(".form-control");
        guess = _.toUpper(typeField.value);

        addScore = checkingAnswer(guess, answer, money);
        console.log(`this is the addScore value: ${addScore}`);

        if (addScore == undefined) {
            console.log("I'M only returning");
            typeField.value = "";

            return;
        } else {
            console.log("I'M running ifCorrect func");
            typeField.value = "";

            ifCorrect(addScore);
        }

    });
};






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





/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO