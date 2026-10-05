// ===============================
//   MAP INITIALISATION
// ===============================

let map = L.map('map').setView([53.48, -2.24], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// ===============================
//   ROUTE + MARKER STORAGE
// ===============================

let dayRoutes = {};
let dayMarkers = {};

const dayOrder = ["day1","day2","day3","day4","day5","day6","day7"];


// ===============================
//   UPDATE ROUTE FOR A SINGLE DAY
// ===============================

function updateDayRoute(day, locs) {

    // Remove existing route control
    if (dayRoutes[day]) {
        map.removeControl(dayRoutes[day]);
    }

    // Remove existing markers
    if (dayMarkers[day]) {
        dayMarkers[day].forEach(m => map.removeLayer(m));
    }
    dayMarkers[day] = [];

    // Remove existing directions box for this day
    const existingBox = document.getElementById(`dir-${day}`);
    if (existingBox) {
        existingBox.remove();
    }

    // Need at least 2 locations to build a route
    if (!locs || locs.length < 2) {
        return;
    }

    // Create route control (Leaflet Routing Machine)
    dayRoutes[day] = L.Routing.control({
        waypoints: locs.map(c => L.latLng(c.lat, c.lng)),
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        show: false // hide built-in instruction panel
    }).addTo(map);

    // When route is found, build directions box
    dayRoutes[day].on('routesfound', function(e) {
        const instructions = e.routes[0].instructions;

        const box = document.createElement("div");
        box.className = "directionBox";
        box.id = `dir-${day}`;
        box.innerHTML = `<h3>${day.toUpperCase()}</h3>`;

        instructions.forEach(i => {
            box.innerHTML += `<p>${i.text}</p>`;
        });

        const container = document.getElementById("directionsContent");

        // Insert in strict Day 1–Day 7 order
        const index = dayOrder.indexOf(day);
        const existingBoxes = Array.from(container.querySelectorAll(".directionBox"));

        let inserted = false;

        for (const b of existingBoxes) {
            const bDay = b.id.replace("dir-", "");
            const bIndex = dayOrder.indexOf(bDay);

            if (bIndex > index) {
                container.insertBefore(box, b);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            container.appendChild(box);
        }
    });
}
