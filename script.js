let stops = {
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
};

let coordinates = {
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
};

function addStop() {
    const name = document.getElementById("stopInput").value.trim();
    const time = document.getElementById("timeInput").value.trim();
    const day = document.getElementById("daySelect").value;

    if (!name) return alert("Enter a destination");
    if (!time) return alert("Enter a time");

    const li = document.createElement("li");
    li.innerHTML = `<span>${time} - ${name}</span><span class="drag-hint">⇅ drag</span>`;
    li.dataset.day = day;
    document.getElementById(day + "List").appendChild(li);

    stops[day].push({ name, time });

    getCoordinates(name, coords => {
        if (!coords) return;

        coordinates[day].push({
            lat: coords.lat,
            lng: coords.lng,
            name,
            time
        });

        updateDayRoute(day, coordinates[day]);
    });

    document.getElementById("stopInput").value = "";
    document.getElementById("timeInput").value = "";
}

function clearAll() {
    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        stops[key] = [];
        coordinates[key] = [];
        document.getElementById(key + "List").innerHTML = "";
        if (dayRoutes[key]) {
            map.removeControl(dayRoutes[key]);
            dayRoutes[key] = null;
        }
        if (dayMarkers[key]) {
            dayMarkers[key].forEach(m => map.removeLayer(m));
            dayMarkers[key] = [];
        }
    }
}

// initialise Sortable on each day list
document.querySelectorAll(".sortable").forEach(list => {
    Sortable.create(list, {
        group: "days",
        animation: 150,
        handle: "span", // whole item is draggable
        onEnd: function () {
            rebuildFromUI();
        }
    });
});

// rebuild internal data + routes from what’s on screen
function rebuildFromUI() {
    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        stops[key] = [];
        coordinates[key] = [];

        const items = document.querySelectorAll(`#${key}List li`);
        items.forEach(li => {
            const text = li.querySelector("span").innerText;
            const [time, name] = text.split(" - ");

            stops[key].push({ name, time });

            getCoordinates(name, coords => {
                if (!coords) return;

                coordinates[key].push({
                    lat: coords.lat,
                    lng: coords.lng,
                    name,
                    time
                });

                updateDayRoute(key, coordinates[key]);
            });
        });
    }
}
