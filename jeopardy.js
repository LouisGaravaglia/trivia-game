async function setUp(height, width) {
    const HEIGHT = height;
    const WIDTH = width

    const categories = await getCategories(100);
    const {
        selectCats,
        titles
    } = await getSelects(categories, WIDTH);
    const board = await getClues(selectCats, HEIGHT, WIDTH);
    const htmlBoard = await makeHtmlBoard(HEIGHT, WIDTH, board, titles);


}

setUp(5, 6);

function cardContainerClick(e) {
    console.log(e);

    // let money;
    // let question;
    // let passingQuestion;
    // let answer;

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

    // console.log(`money: ${money.innerText}, answer: ${answer.innerText}`);


    let testingAnswer = answer.innerText;
    console.log(`this is me testing the testing answer ${testingAnswer}`)

    money.classList.add("flip");
    question.classList.toggle("flip");


    clockTicking(10, testingAnswer, money);
    setTimeout(() => {

        question.classList.toggle("flip");
        answer.classList.remove("flip");
    }, 9000);

    return {
        money: money,
        testingAnswer: testingAnswer,
    };
}



const cardContainer = document.querySelector(".card-container");
cardContainer.addEventListener("click", (e) => {
    let {
        money,
        testingAnswer
    } = cardContainerClick(e);

    $("#hidden-answer").val(testingAnswer);
    $("#hidden-money").val(money);
})


function checkingAnswer(guess) {
    let answer = $("#hidden-answer").val();
    let correctAnswer = _.toUpper(answer);
    let money = $("#hidden-money").val();
    let moneySlice = money.innerText.slice(1);
    let moneyAmount = parseInt(moneySlice);


    if (guess === correctAnswer) {

        return moneyAmount

    } else {

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


function clockTicking(TIME_LIMIT, testingAnswer, money) {
    const body = document.querySelector("body");

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


    timerInterval(TIME_LIMIT, clock, clockContainer);


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






const submitBtn = document.querySelector("#button-addon2");


submitBtn.addEventListener("click", () => {

    console.log("MADE IT TO SUBMIT BTN CLICK!");

    const typeField = document.querySelector(".form-control");
    let guess = _.toUpper(typeField.value);

    let addScore = checkingAnswer(guess);
    console.log(`this is the addScore value: ${addScore}`);

    if (addScore == undefined) {
        console.log("I'M only returning");
        typeField.value = "";
        $("#stop-timer").val(true);
    
    } else {
        console.log("I'M running ifCorrect func");
        $("#stop-timer").val(true);

        ifCorrect(addScore);
        typeField.value = "";
    }

    

});


function timerInterval(TIME_LIMIT, clock, clockContainer) {
    let timePassed = 0;
    $("#stop-timer").val(false);

    let timer = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;

        clock.innerText = `00:0${timeLeft}`;

        if ($("#stop-timer").val()) clearInterval(timer);

        if (timeLeft === 0) {

            ///////////////////////////ADD TIMES UP! RESPONSE
            clearInterval(timer);
            clockContainer.classList.add("flip");
        }
    }, 1000);
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