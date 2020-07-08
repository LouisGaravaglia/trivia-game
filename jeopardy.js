

async function setUp(height, width) {
    const HEIGHT = height;
    const WIDTH = width
    const TIME_LIMIT = 5;

    const categories = await getCategories(100);
    const {selectCats, titles} = await getSelects(categories, WIDTH);
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
            console.log(e);
            if (e.target.localName === "h1") {
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

            money.classList.add("flip");
            question.classList.toggle("flip");
            clockTicking(TIME_LIMIT);
            setTimeout(() => {

                question.classList.toggle("flip");
                answer.classList.remove("flip");
            }, 5000);
        })
    })
}



function typeAnswerInput(clockBox) {
    const typeField = document.querySelector(".type-answer");
}



function clockTicking(TIME_LIMIT) {
    const body = document.querySelector("body");
    let timePassed = 0;

    const clockContainer = document.createElement("div");
    clockContainer.classList.add("clock-container");

    const clockBox = document.createElement("div");
    clockBox.classList.add("clock-box");

    const clock = document.createElement("h1");
    clock.classList.add("starting", "clock");
    clock.innerText = `00:0${TIME_LIMIT}`;

    
    
    clockBox.append(clock);
    clockContainer.append(clockBox);
    body.append(clockContainer);

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



function makeTopRow(WIDTH, titles){
    const topRow = document.createElement("tr");

    topRow.setAttribute("id", "column-top");

    // console.log(titles);
    console.log(titles);

    for (let x = 0; x < WIDTH; x++) {
        const titleCell = document.createElement("td");
        titleCell.setAttribute("id", x);

        const titleBox = document.createElement("div");
        titleBox.classList.add("title-box");

        const title = document.createElement("p");
        title.innerText = titles[x];

        titleBox.append(title);
        titleCell.append(titleBox);
        topRow.append(titleCell);
    }

    return topRow;
}





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
            questionText.innerText = BOARD[y][x].question;

            const answerDiv = document.createElement("div");
            answerDiv.classList.add("card-back");
            answerDiv.classList.add("flip");

            const answerText = document.createElement("p");
            answerText.innerText = BOARD[y][x].answer;

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

    return {selectCats: selectCats, titles: titles};
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