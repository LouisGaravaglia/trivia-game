// categories is the main data structure for the app; it looks like this:


//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]





async function setUp(height, width) {
    const HEIGHT = height;
    const WIDTH = width

    const categories = await getCategories(100);
    const selectCats = await getSelects(categories, WIDTH);
    const board = await getClues(selectCats, HEIGHT, WIDTH);
    const htmlBoard = await makeHtmlBoard(HEIGHT, WIDTH, board);

    listening(htmlBoard, HEIGHT);




}

setUp(5, 6);

// function listening(htmlBoard, width) {
//     const WIDTH = width

//     console.log(htmlBoard.children[1].children[1].firstChild);

//     for (let i = 0; i < WIDTH; i++) {

//         console.log(htmlBoard.children[i+1].children[i].firstChild.innerText);
//         console.log(htmlBoard.children[i+1].children[i].lastChild.innerText);

//     }


// }



function listening(htmlBoard, height, width) {
    const cards = document.querySelectorAll(".card-front");
    // const HEIGHT = height
    // const WIDTH = width;
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            let question;
            let answer;
            if (e.target.dataset.name === "H3") {
                console.log("hit an H3");
                question = e.target.parentElement;
                answer = e.target.parentElement.parentElement.lastChild.firstChild;
            } else {
                question = e.target;
                console.log("hit a card front div");
                answer = e.target.parentElement.lastChild.firstChild;
            }

            if (!question.classList.contains("flip")) question.classList.add("flip");
            if (answer.classList.contains("flip")) answer.classList.remove("flip");

        })
    })



    // for (let i = 1; i <= HEIGHT; i++) {

    //     console.log(htmlBoard.children[i].children);

    //     for (let j = 0; j <= WIDTH; j++) {

    //         console.log(htmlBoard.children[i].children[0]);

    //     }

    // }


}




function makeHtmlBoard(height, width, board) {
    const HEIGHT = height;
    const WIDTH = width;
    const BOARD = board;
    const htmlBoard = document.querySelector("#board");
    const top = document.createElement("tr");

    top.setAttribute("id", "column-top");

    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }

    htmlBoard.append(top);

    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");

        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.classList.add("card-box");

            const front = document.createElement("div");
            front.setAttribute("data-key", `${y}-${x}`)
            front.classList.add("card-front");
            const frontH3 = document.createElement("h3");
            frontH3.setAttribute("data-name", "H3")
            frontH3.innerText = BOARD[y][x].question;

            const back = document.createElement("div");
            back.classList.add("card-back");
            const backP = document.createElement("p");
            backP.innerText = BOARD[y][x].answer;
            backP.classList.add("flip");

            front.append(frontH3);
            back.append(backP)
            cell.append(front);
            cell.append(back)
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
    return selectCats;
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