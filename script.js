// ===============================
//   DATA STRUCTURES
// ===============================

let stops = {
    day1: [], day2: [], day3: [],
    day4: [], day5: [], day6: [], day7: []
};

let coordinates = {}; // name -> {lat, lng}


// ===============================
//   ADD STOP
// ===============================

function addStop() {
    const name = document.getElementById("stopInput").value.trim();
    const day = document.getElementById("daySelect").value;

    if (!name) {
        alert("Enter a destination");
        return;
    }

    // Create card
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="stop-name">${name}</span>
        <span class="drag-hint">⇅</span>
        <button class="delete-btn" onclick="deleteStop('${name}', '${day}', this)">✖</button>
    `;
    li.dataset.day = day;

    // Add to UI
    document.getElementById(day + "List").appendChild(li);

    // Add to data
    stops[day].push(name);

    // If coordinates already known, update routes immediately
    if (coordinates[name]) {
        updateAllRoutes();
        document.getElementById("stopInput").value = "";
        return;
    }

    // Otherwise fetch coordinates
    getCoordinates(name, coords => {
        if (!coords) {
            alert("Could not find location: " + name);
            return;
        }
        coordinates[name] = coords;
        updateAllRoutes();
    });

    document.getElementById("stopInput").value = "";
}


// ===============================
//   CLEAR ALL
// ===============================

function clearAll() {
    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        stops[key] = [];
        document.getElementById(key + "List").innerHTML = "";
    }
    document.getElementById("directionsContent").innerHTML = "";
}


// ===============================
//   REBUILD STOPS FROM UI
// ===============================

function rebuildStopsFromUI() {
    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        stops[key] = [];
        const items = document.querySelectorAll(`#${key}List li`);
        items.forEach(li => {
            const name = li.querySelector(".stop-name").innerText;
            stops[key].push(name);
        });
    }
}


// ===============================
//   UPDATE ALL ROUTES
// ===============================

function updateAllRoutes() {
    const container = document.getElementById("directionsContent");
    container.innerHTML = "";

    const dayOrder = ["day1","day2","day3","day4","day5","day6","day7"];

    dayOrder.forEach(key => {
        const locs = stops[key]
            .map(name => coordinates[name])
            .filter(Boolean);
        updateDayRoute(key, locs);
    });
}


// ===============================
//   DELETE STOP
// ===============================

function deleteStop(name, day, element) {
    stops[day] = stops[day].filter(n => n !== name);
    element.parentElement.remove();
    updateAllRoutes();
}


// ===============================
//   SORTABLEJS SETUP
// ===============================

document.querySelectorAll(".sortable").forEach(list => {
    Sortable.create(list, {
        group: "days",
        animation: 150,
        draggable: "li",
        ghostClass: "ghost",
        dragClass: "dragging",
        onEnd: function () {
            rebuildStopsFromUI();
            updateAllRoutes();
        }
    });
});
