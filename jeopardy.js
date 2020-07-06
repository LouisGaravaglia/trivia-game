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





async function setUp() {

   const categories = await getCategories(100);
   const selectCats = await getSelects(categories);
   const titles = await getClues(selectCats);

   console.log(titles);
   

}

setUp();

async function getClues(selectCats) {
    const titles = [];
    // console.log(selectCats[1][1]);
    
       for (let i = 0; i < 6; i++) {

        for (let j = 0; j < 5; j++) {
            // titles.push(selectCats[i][j].category.title)
            // titles.push(selectCats[i][j].answer)
            // titles.push(selectCats[i][j].question)
            titles.push({title: selectCats[i][j].category.title, question: selectCats[i][j].question, answer: selectCats[i][j].answer })
            

        }


    }

    return titles;
    
    
}


async function getSelects(categories) {
    const selectCats = [];
    for (let i = 0; i < 6; i++) {
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
    // const res2 = await axios.get("https://jservice.io/api/clues", {
    //     params: {
    //         category: 5412
    //     }
    // });

    const list = res.data

    
    for (const item of list) {
        categories.push({
            id: item.id,
            title: item.title
        });

    }

    return categories;



    // for (let i = 0; i < 6; i++) {
    //     let randomNum = Math.floor(Math.random() * 100);
    //     const res = await axios.get("https://jservice.io/api/clues", {
    //         params: {
    //             category: categories[randomNum].id
    //         }
    //     });
    //     selectCats.push(res.data);

    // }


    // for (let i = 0; i < 7; i++) {

    //     for (let j = 0; j < 5; j++) {
    //         console.log(selectCats[i][j].category.title);
    //         titles.push(selectCats[i][j].category.title)

    //     }


    // }


};








// async function getClues() {

//     console.log(categories);


//     let randomNum = Math.floor(Math.random() * 100);
//     console.log(categories[3].title);
//     console.log(categories[3].id);
//     for (let i = 0; i < 7; i++) {
//         // const res = await axios.get("https://jservice.io/api/clues", { params: { category: categories[randomNum].id } });
//         // selectCats.push(res);
//         // console.log(categories[randomNum]);


//     }
// // console.log(selectCats);



// }

// // getClues();






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