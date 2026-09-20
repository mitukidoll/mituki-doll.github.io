let operators = [];

const table = document.getElementById("operatorTable");

load();

async function load() {

    const response = await fetch("./operators.json");
    operators = await response.json();

    createFilters();
    applyDefaultSort();
    renderTable();

}

function applyDefaultSort() {
    document.getElementById("sortKey").value = "rarity";
    document.getElementById("sortOrder").value = "desc";
}

function isMeaningfulValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
}

function uniqueFromList(list, key) {

    const set = new Set();

    list.forEach(op => {

        const values = Array.isArray(op[key]) ? op[key] : [op[key]];

        values.forEach(v => {
            if (isMeaningfulValue(v)) {
                set.add(v);
            }
        });

    });

    return [...set].sort();

}

function unique(key) {
    return uniqueFromList(operators, key);
}

function fillSelect(id, values, preserveValue = true) {

    const select = document.getElementById(id);
    const currentValue = preserveValue ? select.value : "";

    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "指定なし";
    select.appendChild(defaultOption);

    values.filter(isMeaningfulValue).forEach(v => {

        const option = document.createElement("option");

        option.value = v;
        option.textContent = v;

        select.appendChild(option);

    });

    if (preserveValue && values.includes(currentValue)) {
        select.value = currentValue;
    } else {
        select.value = "";
    }

}

function createFilters() {

    fillSelect("filterRarity",
        [...new Set(operators.map(o => o.rarity))]
            .sort((a,b)=>a-b)
            .map(r=>"★".repeat(r)));

    fillSelect("filterRace", unique("race"));

    fillSelect("filterCountry", unique("country"));

    fillSelect("filterClass", unique("class"));

    fillSelect("filterJob", unique("job"));

    fillSelect("filterFaction", unique("factions"));

    document
        .querySelectorAll("select")
        .forEach(e => e.addEventListener("change", renderTable));

    document.getElementById("resetFilters").addEventListener("click", resetFilters);

}

function resetFilters() {

    document.getElementById("sortKey").value = "rarity";
    document.getElementById("sortOrder").value = "desc";
    document.getElementById("filterRarity").value = "";
    document.getElementById("filterRace").value = "";
    document.getElementById("filterCountry").value = "";
    document.getElementById("filterClass").value = "";
    document.getElementById("filterJob").value = "";
    document.getElementById("filterFaction").value = "";

    renderTable();

}

function renderTable() {

    table.innerHTML = "";

    let list = [...operators];

    const rarity = document.getElementById("filterRarity").value;

    const race = document.getElementById("filterRace").value;

    const country = document.getElementById("filterCountry").value;

    const jobClass = document.getElementById("filterClass").value;

    const job = document.getElementById("filterJob").value;

    const faction = document.getElementById("filterFaction").value;

    list = list.filter(op => {

        if (rarity && "★".repeat(op.rarity) !== rarity) return false;

        if (race && op.race !== race) return false;

        if (country && op.country !== country) return false;

        if (jobClass && op.class !== jobClass) return false;

        if (faction && !op.factions.includes(faction)) return false;

        return true;

    });

    const availableJobs = uniqueFromList(list, "job");
    const previousJob = document.getElementById("filterJob").value;
    fillSelect("filterJob", availableJobs, false);

    if (previousJob && availableJobs.includes(previousJob)) {
        document.getElementById("filterJob").value = previousJob;
    }

    list = list.filter(op => {

        if (document.getElementById("filterJob").value && op.job !== document.getElementById("filterJob").value) return false;

        return true;

    });

    const key = document.getElementById("sortKey").value;

    const order = document.getElementById("sortOrder").value;

    list.sort((a,b)=>{

        let x=a[key];
        let y=b[key];

        if(typeof x==="string"){

            return x.localeCompare(y,"ja");

        }

        return x-y;

    });

    if(order==="desc") list.reverse();

    list.forEach(op=>{

        const tr=document.createElement("tr");

        tr.innerHTML=`

        <td>${op.name}</td>

        <td>${"★".repeat(op.rarity)}</td>

        <td>${op.race}</td>

        <td>${op.country}</td>

        <td>${op.class}</td>

        <td>${op.job}</td>

        <td>${op.cost}</td>

        <td>${op.factions.join("<br>")}</td>

        `;

        table.appendChild(tr);

    });

}