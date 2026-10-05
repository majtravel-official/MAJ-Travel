// Store stops and coordinates
let stops = [];
let stopCoordinates = [];

// Add stop to itinerary
function addStop() {
    const stopName = document.getElementById("stopInput").value;
    const stopTime = document.getElementById("timeInput").value;
    const day = document.getElementById("daySelect").value;

    if (!stopName) return alert("Please enter a stop name.");

    // Add stop to the correct day list
    const list = document.getElementById(day + "List");
    const li = document.createElement("li");
    li.textContent = `${stopTime} - ${stopName}`;
    list.appendChild(li);

    // Store stop
    stops.push({ name: stopName, time: stopTime });

    // Get coordinates using travel-time.js
    getCoordinates(stopName, function(coords) {
        if (coords) {
            stopCoordinates.push(coords);
            updateRoute(stopCoordinates); // Leaflet route update
        }
    });

    // Clear input
    document.getElementById("stopInput").value = "";
    document.getElementById("timeInput").value = "";
}

// Share itinerary (simple JSON link)
function shareItinerary() {
    const data = JSON.stringify(stops);
    alert("Copy this itinerary data:\n\n" + data);
}

// Download itinerary JSON
function downloadJSON() {
    const data = JSON.stringify(stops, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "itinerary.json";
    a.click();
}

// Clear everything
function clearAll() {
    stops = [];
    stopCoordinates = [];

    // Clear lists
    for (let i = 1; i <= 7; i++) {
        document.getElementById(`day${i}List`).innerHTML = "";
    }

    // Clear route
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }
}
