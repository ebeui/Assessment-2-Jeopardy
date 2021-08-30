setupAndStart();

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

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const categoryRes = await axios.get(
        "http://jservice.io/api/categories?count=100"
    );
    console.log(categoryRes);

    const categoryIDs = categoryRes.data.map(function (categoryObj) {
        return categoryObj.id;
    });
    console.log(categoryIDs);

    let dataArr = [];

    for (let i = 0; i < 6; i++) {
        let catID = categoryIDs[Math.floor(Math.random() * categoryIDs.length)];

        let category = await getCategory(catID);
        let clues = category.data.clues.map(function (clue) {
            return {
                answer: clue.answer,
                question: clue.question,
                value: clue.value,
                showing: null,
            };
        });
        dataArr.push({
            title: category.data.title,
            clues: clues,
        });
    }
    categories = dataArr;
    return dataArr;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catID) {
    const resTitle = await axios.get(
        `http://jservice.io/api/category?id=${catID}`
    );
    return resTitle;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    let catIds = await getCategoryIds();
    console.log(catIds);

    const body = document.getElementsByTagName("body")[0];

    const table = document.createElement("table");
    table.setAttribute("id", "table");

    const tableHead = document.createElement("thead");
    tableHead.setAttribute("id", "table-head");

    const tableBody = document.createElement("tbody");
    tableBody.setAttribute("id", "table-body");

    for (let i = 0; i < 6; i++) {
        let headCell = document.createElement("th");
        let headCellText = document.createTextNode(catIds[i].title);

        headCell.appendChild(headCellText);
        tableHead.appendChild(headCell);

        table.appendChild(tableHead);
        table.appendChild(tableBody);
        body.appendChild(table);
    }

    for (let y = 0; y < 5; y++) {
        let row = document.createElement("tr");

        for (let x = 0; x <= 5; x++) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode("?");
            cell.setAttribute("id", `${y}-${x}`);

            cell.addEventListener("click", handleClick);

            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    console.log(evt.target);

    let id = evt.target.id;

    let clueId = id.split("-")[0];
    let catId = id.split("-")[1];

    console.log(clueId);
    console.log(catId);

    let clue = categories[catId].clues[clueId];
    console.log(clue);
    // let cellText = document.createTextNode("?");

    let phrase;

    if (!clue.showing) {
        phrase = clue.question;
        clue.showing = "question";
    } else if (clue.showing === "question") {
        phrase = clue.answer;
        clue.showing = "answer";
    } else {
        return;
    }
    document.getElementById(id).innerText = phrase;
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    if (document.getElementById("table") != null) {
        document.getElementById("table").remove();
    }
}

/** Remove the loading spinner and update the button used to fetch data. */

// function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    /** On click of start / restart button, set up game. */

    // TODO

    let startBtn = document.createElement("button");
    startBtn.id = "startBtn";
    startBtn.classList.add("vertical-center");
    startBtn.innerHTML = "Start game";

    document.body.appendChild(startBtn);

    startBtn.addEventListener("click", function () {
        showLoadingView();
        fillTable();
    });

    /** On page load, add event handler for clicking clues */

    // TODO
}
