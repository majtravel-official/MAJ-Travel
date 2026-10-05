/* ============================================================
   MAJ TRAVEL — FULL 7‑DAY ITINERARY BUILDER ENGINE
   MODULE 4: PHOTO SYSTEM ENABLED
============================================================ */

const DAYS = ["day1","day2","day3","day4","day5","day6","day7"];

/* ------------------------------------------------------------
   CREATE LIST ITEM (Stop)
------------------------------------------------------------ */
function createListItem(text, notes = "", photo = "") {
    const li = document.createElement("li");
    li.draggable = true;

    // Main stop text
    const mainText = document.createElement("div");
    mainText.textContent = text;
    mainText.classList.add("stop-text");

    // Notes box
    const notesBox = document.createElement("textarea");
    notesBox.placeholder = "Notes...";
    notesBox.value = notes;
    notesBox.classList.add("notes-box");
    notesBox.addEventListener("input", saveItinerary);

    // Photo URL input
    const photoInput = document.createElement("input");
    photoInput.type = "text";
    photoInput.placeholder = "Photo URL";
    photoInput.value = photo;
    photoInput.classList.add("photo-box");
    photoInput.addEventListener("input", () => {
        updatePhotoPreview(li, photoInput.value);
        saveItinerary();
    });

    // Photo preview
    updatePhotoPreview(li, photo);

    li.appendChild(mainText);
    li.appendChild(notesBox);
    li.appendChild(photoInput);

    // Drag events
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragend", dragEnd);

    return li;
}

/* ------------------------------------------------------------
   UPDATE PHOTO PREVIEW
------------------------------------------------------------ */
function updatePhotoPreview(li, url) {
    // Remove old preview
    const oldImg = li.querySelector(".stop-photo");
    if (oldImg) oldImg.remove();

    if (url && url.trim() !== "") {
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("stop-photo");
        li.appendChild(img);
    }
}

/* ------------------------------------------------------------
   ADD STOP
------------------------------------------------------------ */
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

/* ------------------------------------------------------------
   DRAG & DROP (Cross‑Day)
------------------------------------------------------------ */
let draggedItem = null;

function dragStart(e) {
    draggedItem = e.target;
    e.target.classList.add("dragging");

    document.querySelectorAll("ul").forEach(list => {
        list.addEventListener("dragover", dragOver);
        list.addEventListener("drop", dropItem);
        list.classList.add("highlight");
    });
}

function dragEnd(e) {
    e.target.classList.remove("dragging");

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

/* ------------------------------------------------------------
   SAVE ITINERARY (LocalStorage)
------------------------------------------------------------ */
function saveItinerary() {
    const data = {};

    DAYS.forEach(day => {
        const items = [];
        document.querySelectorAll(`#${day}List li`).forEach(li => {
            items.push({
                text: li.querySelector(".stop-text").textContent,
                notes: li.querySelector(".notes-box").value,
                photo: li.querySelector(".photo-box").value
            });
        });
        data[day] = items;
    });

    localStorage.setItem("itinerary", JSON.stringify(data));
}

/* ------------------------------------------------------------
   LOAD ITINERARY
------------------------------------------------------------ */
function loadItinerary() {
    const saved = JSON.parse(localStorage.getItem("itinerary"));
    if (!saved) return;

    DAYS.forEach(day => {
        const list = document.getElementById(day + "List");
        saved[day].forEach(item => {
            const li = createListItem(item.text, item.notes, item.photo);
            list.appendChild(li);
        });
    });
}

/* ------------------------------------------------------------
   INITIALISE
------------------------------------------------------------ */
loadItinerary();
/* ============================================================
   SHARE ITINERARY LINK
============================================================ */
function shareItinerary() {
    const data = localStorage.getItem("itinerary");
    const encoded = encodeURIComponent(data);

    const shareURL = `${window.location.origin}${window.location.pathname}?itinerary=${encoded}`;

    navigator.clipboard.writeText(shareURL);

    alert("Share link copied to clipboard!");
}
