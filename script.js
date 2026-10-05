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
    const name = document.getElementById("stopInput").value;
    const time = document.getElementById("timeInput").value;
    const day = document.getElementById("daySelect").value;

    if (!name) return alert("Enter a destination");

    const li = document.createElement("li");
    li.innerHTML = `<span>${time} - ${name}</span>`;
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
    }
}

document.querySelectorAll(".sortable").forEach(list => {
    Sortable.create(list, {
        group: "days",
        animation: 150,
        onSort: function () {
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
            const text = li.innerText;
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
