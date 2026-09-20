let operators = [];
let answer = null;

const DEBUG = false;
const DEBUG_ANSWER = "ハロルド";
const DEBUG_RANDOM = "ヴァンデラ";

document
    .getElementById("guessButton")
    .addEventListener("click", guess);

document
    .getElementById("nextButton")
    .addEventListener("click", nextGame);
const input = document.getElementById("operatorInput");

document
    .getElementById("giveUpButton")
    .addEventListener("click", giveUp);

document
    .getElementById("resetButton")
    .addEventListener("click", nextGame);

document
    .getElementById("helpButton")
    .addEventListener("click", () => {
        alert(
            "オペレーターの名前を入力して、Enterキーまたは「guess」ボタンを押してください。\n" +
            "正解を知りたい場合は「ギブアップ」ボタンを押してください。\n\n"+
            "一部オペレーターの扱いについて：\n"+
            "・情報は白wikiの内容を基にしています。\n"+
            "・統合戦略のみで登場するオペレータなどを含みます。n"+
            "・種族が複数あるオペレーターは、完全一致でないと正解扱いになりません。\n"+
            "例）種族が「コータス/キメラ」のオペレーターと、「コータス」のオペレーターを比較すると、不一致扱いになります。\n"+
            "・「製造元」は「出身地」として扱います。\n"+
            "・一部オペレーターの種族はプロファイルにないため、空白になります。\n"+
            "・陣営として扱うのは、各オペレーター個別ページで記載のある陣営および副陣営のみです。親組織の陣営は記載のない限り考慮しません。\n"+
            "例）陣営が「行動予備隊A1」のオペレーターは「ロドスアイランド」陣営として扱いません。\n"+
            "・陣営と副陣営に序列、区別はつけていません。\n"+
            "・職分が不一致で職業が一致している場合、部分一致扱いになります。\n"
        );
    });

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        guess();
    }
});

let gameOver = false;



function compareValue(value, answerValue) {
    return value === answerValue ? "correct" : "wrong";
}

function compareNumber(value, answerValue) {
    if (value === answerValue) {
        return "correct";
    }
    return "wrong";
}

function compareClass(operator, answer) {
    return operator.class === answer.class
        ? "correct"
        : "wrong";
}


function compareJob(operator, answer) {

    // 職分まで一致
    if (operator.job === answer.job) {
        return "correct";
    }

    // 職業だけ一致
    if (operator.class === answer.class) {
        return "partial";
    }

    // 全く違う
    return "wrong";
}

function compareFactions(guess, answer) {
    const answerSet = new Set(answer.factions);

    // 完全一致
    if (
        guess.factions.length === answer.factions.length &&
        guess.factions.every(f => answerSet.has(f))
    ) {
        return "correct";
    }

    // 部分一致
    if (guess.factions.some(f => answerSet.has(f))) {
        return "partial";
    }

    // 不一致
    return "wrong";
}

function createCell(row, text, className = "") {

    const td = document.createElement("td");

    td.innerHTML = text;

    if (className) {
        td.classList.add(className);
    }

    row.appendChild(td);
}

function addHistory(operator) {
    document.getElementById("operatorInput").value = "";

    const table = document.getElementById("historyTable");
    const row = document.createElement("tr");

    createCell(row, operator.name);

    let rarityText = "★".repeat(operator.rarity);

    if (operator.rarity < answer.rarity) {
        rarityText += " ▲";
    } else if (operator.rarity > answer.rarity) {
        rarityText += " ▼";
    }

    createCell(
        row,
        rarityText,
        compareNumber(operator.rarity, answer.rarity)
    );

    createCell(
        row,
        operator.race,
        compareValue(operator.race, answer.race)
    );

    createCell(
        row,
        operator.country,
        compareValue(operator.country, answer.country)
    );

    createCell(
        row,
        operator.job,
        compareJob(operator, answer)
    );

    createCell(
        row,
        operator.class,
        compareClass(operator, answer)
    );  

    let costText = operator.cost.toString();

    if (operator.cost < answer.cost) {
        costText += " ▲";
    } else if (operator.cost > answer.cost) {
        costText += " ▼";
    }

    createCell(
        row,
        costText,
        compareNumber(operator.cost, answer.cost)
    );

    table.insertBefore(row, table.firstChild);

        createCell(
        row,
        operator.factions.join("<br>"),
        compareFactions(operator, answer)
    );  
}

function clearGame() {

    document.getElementById("answerName").textContent = answer.name;

    document.getElementById("clearArea").hidden = false;

    document.getElementById("guessButton").disabled = true;
    document.getElementById("giveUpButton").disabled = true;
    document.getElementById("operatorInput").disabled = true;   

}

function guess() {

    if (gameOver) return;

    const input = document.getElementById("operatorInput").value.trim();

    const guessedOperator = operators.find(op => op.name === input);

    if (!guessedOperator) {
        alert("そのオペレーターは存在しません。");
        return;
    }

    // 履歴に追加
    addHistory(guessedOperator);

    if (guessedOperator.id === answer.id) {
        gameOver = true;
        clearGame();
    }

}

function chooseAnswer() {
    if (DEBUG) {
        answer = operators.find(op => op.name === DEBUG_ANSWER);
    } else {
        answer = operators[Math.floor(Math.random() * operators.length)];
    }
}

function getRandomOperator() {
    if (DEBUG) {
        return operators.find(op => op.name === DEBUG_RANDOM);
    } else {
        return operators[Math.floor(Math.random() * operators.length)];
    }
}

function autoGuessRandom() {
    const randomOperator = getRandomOperator();
    addHistory(randomOperator);

    if (randomOperator.id === answer.id) {
        nextGame();
    }
}

async function loadOperators() {
    try {
        const response = await fetch("./operators.json");

        if (!response.ok) {
            throw new Error("operators.jsonの読み込みに失敗しました");
        }

        operators = await response.json();

        const datalist = document.getElementById("operatorList");

        operators.forEach(operator => {
            const option = document.createElement("option");
            option.value = operator.name;
            datalist.appendChild(option);
        });

        chooseAnswer();
        autoGuessRandom();

    } catch (error) {
        console.error(error);
    }
}

function nextGame() {

    gameOver = false;
        
    document.getElementById("guessButton").disabled = false;
    document.getElementById("giveUpButton").disabled = false;
    document.getElementById("operatorInput").disabled = false;  

    // タイトルを元に戻す
    document.querySelector("#clearArea h2").textContent = "正解！";

    // 履歴を消す
    document.getElementById("historyTable").innerHTML = "";

    // 入力欄を空にする
    document.getElementById("operatorInput").value = "";

    // クリア画面を隠す
    document.getElementById("clearArea").hidden = true;

    // 新しい正解を決める
    chooseAnswer();
    autoGuessRandom();

}

function giveUp() {
    if(gameOver == true){
        return;
    }

    document.getElementById("guessButton").disabled = true;
    document.getElementById("giveUpButton").disabled = true;
    document.getElementById("operatorInput").disabled = true;   

    // タイトルを変更
    document.querySelector("#clearArea h2").textContent = "ギブアップ！";

    // 正解名を表示
    document.getElementById("answerName").textContent = answer.name;

    // 正解を履歴に追加
    addHistory(answer);

    // 表示
    document.getElementById("clearArea").hidden = false;

    gameOver = true;


}

loadOperators();