let stops = {
    day1: [], day2: [], day3: [],
    day4: [], day5: [], day6: [], day7: []
};

let coordinates = {
    day1: [], day2: [], day3: [],
    day4: [], day5: [], day6: [], day7: []
};

function addStop() {
    const name = document.getElementById("stopInput").value.trim();
    const day = document.getElementById("daySelect").value;
 
    if (!name) return alert("Enter a destination");

    const li = document.createElement("li");
    li.innerHTML = `<span>${name}</span><span class="drag-hint">⇅ drag</span>`;
    li.dataset.day = day;
    document.getElementById(day + "List").appendChild(li);

    stops[day].push({ name });

    getCoordinates(name, coords => {
        if (!coords) return;

        coordinates[day].push({
            lat: coords.lat,
            lng: coords.lng,
            name
        });

        updateDayRoute(day, coordinates[day]);
    });

    document.getElementById("stopInput").value = "";
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

document.querySelectorAll(".sortable").forEach(list => {
    Sortable.create(list, {
        group: "days",
        animation: 150,
        onEnd: function () {
            rebuildFromUI();
        }
    });
});

function rebuildFromUI() {
    for (let d = 1; d <= 7; d++) {
        const key = `day${d}`;
        stops[key] = [];
        coordinates[key] = [];

        const items = document.querySelectorAll(`#${key}List li`);
        items.forEach(li => {
            const name = li.querySelector("span").innerText;

            stops[key].push({ name });

            getCoordinates(name, coords => {
                if (!coords) return;

                coordinates[key].push({
                    lat: coords.lat,
                    lng: coords.lng,
                    name
                });

                updateDayRoute(key, coordinates[key]);
            });
        });
    }
}
