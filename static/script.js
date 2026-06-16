let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let dayTasks = JSON.parse(
    localStorage.getItem("dayTasks")
) || {};
let subjectTasks = JSON.parse(
    localStorage.getItem("subjectTasks")
) || {};
function showView(view) {
    const content = document.querySelector(".hero");

    if (view === "calendar") {
    showCalendar();
}

    if (view === "fizyka") {
        content.innerHTML = `
            <h2>Fizyka</h2>
            <p>Lista zadań z fizyki pojawi się tutaj.</p>
        `;
    }

    if (view === "matma") {
        content.innerHTML = `
            <h2>Matma</h2>
            <p>Lista zadań z matematyki pojawi się tutaj.</p>
        `;
    }

    if (view === "calculator") {
        content.innerHTML = `
            <h2>Licznik zadań</h2>
            <input type="number" id="tasks" placeholder="Liczba zadań">
            <input type="number" id="days" placeholder="Liczba dni">
            <button onclick="calculateTasks()">Oblicz</button>
            <p id="result"></p>
        `;
    }

    if (view === "notes") {
    const savedNotes = localStorage.getItem("notes") || "";

    content.innerHTML = `
        <h2>Notatki</h2>

        <textarea
            id="notes-area"
            placeholder="Wpisz swoje notatki..."
            style="width:100%; height:300px; padding:15px;"
        >${savedNotes}</textarea>

        <br><br>

        <button onclick="saveNotes()">
            Zapisz notatki
        </button>

        <p id="save-message"></p>
    `;
}
}

function calculateTasks() {
    const tasks = Number(document.getElementById("tasks").value);
    const days = Number(document.getElementById("days").value);

    const result = Math.ceil(tasks / days);

    document.getElementById("result").textContent =
        `Musisz robić minimum ${result} zadań dziennie.`;
}
function saveNotes() {
    const notes =
        document.getElementById("notes-area").value;

    localStorage.setItem("notes", notes);

    document.getElementById("save-message")
        .textContent = "Notatki zapisane.";
}
function toggleHelp() {
    const modal = document.getElementById("help-modal");
    modal.classList.toggle("hidden");
}
let currentDate = new Date();

function showCalendar() {
    const content = document.querySelector(".hero");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
        "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;

    let calendarHTML = `
        <div class="calendar-header">
            <button onclick="previousMonth()">←</button>
            <h2>${monthNames[month]} ${year}</h2>
            <button onclick="nextMonth()">→</button>
        </div>

        <div class="calendar-grid calendar-days">
            <div>Pon</div>
            <div>Wt</div>
            <div>Śr</div>
            <div>Czw</div>
            <div>Pt</div>
            <div>Sob</div>
            <div>Nd</div>
        </div>

        <div class="calendar-grid">
    `;

    for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateKey = `${year}-${month + 1}-${day}`;

    const today = new Date();

    const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    const hasTasks =
        dayTasks[dateKey] &&
        dayTasks[dateKey].length > 0;

    let dayClass = "calendar-day";

    if (hasTasks) {
        dayClass += " has-tasks";
    }

    if (isToday) {
        dayClass += " today";
    }

    calendarHTML += `
        <button class="${dayClass}" onclick="openDay('${dateKey}', ${day})">
            ${day}
        </button>
    `;
}

    calendarHTML += `</div>`;

    content.innerHTML = calendarHTML;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    showCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    showCalendar();
}

function openDay(dateKey, day) {
    const content = document.querySelector(".hero");
const [year, month, selectedDay] = dateKey.split("-").map(Number);

const monthNamesGenitive = [
    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
    "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
];

const fullDate = `${selectedDay} ${monthNamesGenitive[month - 1]} ${year}`;

const maturaDate = new Date(2027, 4, 4);
const selectedDate = new Date(year, month - 1, selectedDay);

const daysToMatura = Math.ceil(
    (maturaDate - selectedDate) / (1000 * 60 * 60 * 24)
);
    if (!dayTasks[dateKey]) {
        dayTasks[dateKey] = [];
    }

    const tasks = dayTasks[dateKey];

    let tasksHTML = "";

    tasks.forEach((task, index) => {
    tasksHTML += `
        <div class="task-row">
            <label>
                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="toggleTask('${dateKey}', ${index})"
                >
                ${task.text}
            </label>

            <button onclick="deleteTask('${dateKey}', ${index})">
                Usuń
            </button>
        </div>
    `;
});
const completedTasks =
    tasks.filter(task => task.done).length;

const progress =
    tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks / tasks.length) * 100
        );
    content.innerHTML = `
        <button onclick="showCalendar()">← Wróć do kalendarza</button>

        <h2>${fullDate}</h2>
<p>Od tego dnia do matury zostanie: <strong>${daysToMatura} dni</strong></p>

        <input
            type="text"
            id="new-task"
            placeholder="Dodaj zadanie"
        >

        <button onclick="addTask('${dateKey}', ${day})">
            Dodaj
        </button>

        <hr>

<h3>Postęp: ${progress}%</h3>

<div class="progress-bar">
    <div
        class="progress-fill"
        style="width:${progress}%"
    ></div>
</div>

<br>

${tasksHTML}


    `;
}
function addTask(dateKey, day) {

    const input =
        document.getElementById("new-task");

    const text = input.value.trim();

    if (text === "") return;

    dayTasks[dateKey].push({
        text: text,
        done: false
    });

    localStorage.setItem(
        "dayTasks",
        JSON.stringify(dayTasks)
    );

    openDay(dateKey, day);
}


function toggleTask(dateKey, index) {

    dayTasks[dateKey][index].done =
        !dayTasks[dateKey][index].done;

    localStorage.setItem(
        "dayTasks",
        JSON.stringify(dayTasks)
    );

    const day =
        parseInt(dateKey.split("-")[2]);

    openDay(dateKey, day);
}
function renderSubjects() {
    const subjectsList = document.getElementById("subjects-list");
    subjectsList.innerHTML = "";

    subjects.forEach((subject) => {
        subjectsList.innerHTML += `
            <button onclick="showSubject('${subject}')">
                ${subject}
            </button>
        `;
    });
}

function addSubject() {
    const subjectName = prompt("Podaj nazwę przedmiotu:");

    if (!subjectName) return;

    subjects.push(subjectName);
    localStorage.setItem("subjects", JSON.stringify(subjects));

    renderSubjects();
}

document.addEventListener("DOMContentLoaded", function () {
    renderSubjects();
});
function deleteSubject(subjectName) {

    const confirmDelete = confirm(
        `Czy na pewno chcesz usunąć przedmiot "${subjectName}"?`
    );

    if (!confirmDelete) return;

    subjects = subjects.filter(
        subject => subject !== subjectName
    );

    delete subjectTasks[subjectName];

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "subjectTasks",
        JSON.stringify(subjectTasks)
    );

    renderSubjects();

    showView("calendar");
}
function showSubject(subjectName) {
    const content = document.querySelector(".hero");

    if (!subjectTasks[subjectName]) {
        subjectTasks[subjectName] = [];
    }

    const tasks = subjectTasks[subjectName];

    const completedTasks =
        tasks.filter(task => task.done).length;

    const progress =
        tasks.length === 0
            ? 0
            : Math.round((completedTasks / tasks.length) * 100);

    let tasksHTML = "";

    tasks.forEach((task, index) => {
    tasksHTML += `
        <div class="task-row">
            <label>
                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="toggleSubjectTask('${subjectName}', ${index})"
                >
                ${task.text}
            </label>

            <button onclick="deleteSubjectTask('${subjectName}', ${index})">
                Usuń
            </button>
        </div>
    `;
});

    content.innerHTML = `
        <div class="subject-header">
            <h2>${subjectName}</h2>
            <button onclick="deleteSubject('${subjectName}')">
                Usuń zakładkę
            </button>
        </div>

        <input
            type="text"
            id="new-subject-task"
            placeholder="Dodaj zadanie"
        >

        <button onclick="addSubjectTask('${subjectName}')">
            Dodaj
        </button>

        <hr>

        <h3>Postęp: ${progress}%</h3>

        <div class="progress-bar">
            <div
                class="progress-fill"
                style="width:${progress}%"
            ></div>
        </div>

        <br>

        ${tasksHTML}
    `;
}


function addSubjectTask(subjectName) {
    const input = document.getElementById("new-subject-task");
    const text = input.value.trim();

    if (text === "") return;

    subjectTasks[subjectName].push({
        text: text,
        done: false
    });

    localStorage.setItem(
        "subjectTasks",
        JSON.stringify(subjectTasks)
    );

    showSubject(subjectName);
}


function toggleSubjectTask(subjectName, index) {
    subjectTasks[subjectName][index].done =
        !subjectTasks[subjectName][index].done;

    localStorage.setItem(
        "subjectTasks",
        JSON.stringify(subjectTasks)
    );

    showSubject(subjectName);
}
function deleteTask(dateKey, index) {
    dayTasks[dateKey].splice(index, 1);

    localStorage.setItem(
        "dayTasks",
        JSON.stringify(dayTasks)
    );

    const day = parseInt(dateKey.split("-")[2]);

    openDay(dateKey, day);
}
function deleteSubjectTask(subjectName, index) {
    subjectTasks[subjectName].splice(index, 1);

    localStorage.setItem(
        "subjectTasks",
        JSON.stringify(subjectTasks)
    );

    showSubject(subjectName);
}
function updateDaysLeft() {
    const maturaDate = new Date(2027, 4, 4);
    const today = new Date();

    maturaDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = maturaDate - today;
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

    const daysElement = document.getElementById("days-left");

    if (daysElement) {
        daysElement.textContent = daysLeft;
    }
}

updateDaysLeft();