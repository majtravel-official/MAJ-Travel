// -----------------------------
// Create a stop list item
// -----------------------------
function createListItem(text, notes = "") {
    const li = document.createElement("li");
    li.draggable = true;

    const mainText = document.createElement("div");
    mainText.textContent = text;
    mainText.classList.add("stop-text");

    const notesBox = document.createElement("textarea");
    notesBox.placeholder = "Notes...";
    notesBox.value = notes;
    notesBox.classList.add("notes-box");

    notesBox.addEventListener("input", saveItinerary);

    li.appendChild(mainText);
    li.appendChild(notesBox);

    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragend", dragEnd);

    return li;
}

// -----------------------------
// Add a stop to a selected day
// -----------------------------
function addStop() {
    const input = document.getElementById("stopInput");
    const time = document.getElementById("timeInput").value;
    const day = document.getElementById("daySelect").value;

    if (input.value.trim() !== "") {
        const text = (time ? time + " — " : "") + input.value;
        const li = createListItem(text);

        document.getElementById(day + "List").appendChild(li);

        input.value = "";
        document.getElementById("timeInput").value = "";

        saveItinerary();
    }
}

// -----------------------------
// Drag & Drop Logic
// -----------------------------
let draggedItem = null;

function dragStart(e) {
    draggedItem = e.target;
    e.target.classList.add("dragging");

    // Enable dragover and drop on ALL day lists
    document.querySelectorAll("ul").forEach(list => {
        list.addEventListener("dragover", dragOver);
        list.addEventListener("drop", dropItem);
        list.classList.add("highlight");
    });
}

function dragEnd(e) {
    e.target.classList.remove("dragging");

    // Remove listeners from all lists
    document.querySelectorAll("ul").forEach(list => {
        list.removeEventListener("dragover", dragOver);
        list.removeEventListener("drop", dropItem);
        list.classList.remove("highlight");
    });

    saveItinerary();
}

function dragOver(e) {
    e.preventDefault();
}

function dropItem(e) {
    e.preventDefault();
    const list = e.currentTarget;

    if (draggedItem && list) {
        list.appendChild(draggedItem);
        saveItinerary();
    }
}

// -----------------------------
// Save itinerary to localStorage
// -----------------------------
function saveItinerary() {
    const days = ["day1", "day2", "day3"];
    const data = {};

    days.forEach(day => {
        const items = [];
        document.querySelectorAll(`#${day}List li`).forEach(li => {
            items.push({
                text: li.querySelector(".stop-text").textContent,
                notes: li.querySelector(".notes-box").value
            });
        });
        data[day] = items;
    });

    localStorage.setItem("itinerary", JSON.stringify(data));
}

// -----------------------------
// Load itinerary from localStorage
// -----------------------------
function loadItinerary() {
    const saved = JSON.parse(localStorage.getItem("itinerary"));
    if (!saved) return;

    Object.keys(saved).forEach(day => {
        const list = document.getElementById(day + "List");
        saved[day].forEach(item => {
            const li = createListItem(item.text, item.notes);
            list.appendChild(li);
        });
    });
}

// -----------------------------
// Initialise
// -----------------------------
loadItinerary();
