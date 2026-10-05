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
    const stopName = document.getElementById("stopInput").value;
    const stopTime = document.getElementById("timeInput").value;
    const day = document.getElementById("daySelect").value;

    if (!stopName) return alert("Please enter a stop name.");

    // Add stop to UI list
    const list = document.getElementById(day + "List");
    const li = document.createElement("li");
    li.textContent = `${stopTime} - ${stopName}`;
    list.appendChild(li);

    // Store stop
    stops[day].push({ name: stopName, time: stopTime });

    // Get coordinates
    getCoordinates(stopName, function(coords) {
        if (coords) {
            coordinates[day].push({
                lat: coords.lat,
                lng: coords.lng,
                name: stopName,
                time: stopTime
            });

            // Update route for that day only
            updateDayRoute(day, coordinates[day]);
        }
    });

    // Clear inputs
    document.getElementById("stopInput").value = "";
    document.getElementById("timeInput").value = "";
}

function clearAll() {
    for (let d = 1; d <= 7; d++) {
        const dayKey = `day${d}`;
        stops[dayKey] = [];
        coordinates[dayKey] = [];
        document.getElementById(`day${d}List`).innerHTML = "";
    }

    // Remove all routes and markers
    for (let day in dayRoutes) {
        map.removeControl(dayRoutes[day]);
    }
    dayRoutes = {};

    for (let day in dayMarkers) {
        dayMarkers[day].forEach(m => map.removeLayer(m));
    }
    dayMarkers = {};
}
