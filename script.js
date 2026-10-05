let stops = {
    day1: [], day2: [], day3: [],
    day4: [], day5: [], day6: [], day7: []
};

let coordinates = {};   // store coordinates by name permanently

function addStop() {
    const name = document.getElementById("stopInput").value.trim();
    const day = document.getElementById("daySelect").value;

    if (!name) return alert("Enter a destination");

    const li = document.createElement("li");

    li.innerHTML = `
        <span class="stop-name">${name}</span>
        <span class="drag-hint">⇅</span>
        <button class="delete-btn" onclick="deleteStop('${name}', '${day}', this)">✖</button>
    `;

    li.dataset.day = day;
    document.getElementById(day + "List").appendChild(li);

    stops[day].push(name);

    if (coordinates[name]) {
        updateAllRoutes();
        document.getElementById("stopInput").value = "";
        return;
    }

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

function clearAll() {
    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        stops[key] = [];
        document.getElementById(key + "List").innerHTML = "";
    }

    document.getElementById("directionsContent").innerHTML = "";
}

document.querySelectorAll(".sortable").forEach(list => {
    Sortable.create(list, {
        group: "days",
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
        dragClass: "dragging",
        ghostClass: "ghost",
        forceFallback: true,
        onEnd: function () {
            rebuildStopsFromUI();
            updateAllRoutes();
        }
    });
});

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

function updateAllRoutes() {
    document.getElementById("directionsContent").innerHTML = "";

    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        const locs = stops[key].map(name => coordinates[name]).filter(Boolean);
        updateDayRoute(key, locs);
    }
}

function deleteStop(name, day, element) {
    stops[day] = stops[day].filter(n => n !== name);
    element.parentElement.remove();
    updateAllRoutes();
}
