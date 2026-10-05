let map = L.map('map').setView([53.48, -2.24], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let dayRoutes = {};
let dayMarkers = {};

function updateDayRoute(day, locs) {
    if (dayRoutes[day]) {
        map.removeControl(dayRoutes[day]);
    }
    if (dayMarkers[day]) {
        dayMarkers[day].forEach(m => map.removeLayer(m));
    }
    dayMarkers[day] = [];

    if (locs.length < 2) return;

    dayRoutes[day] = L.Routing.control({
        waypoints: locs.map(c => L.latLng(c.lat, c.lng)),
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        show: false   // ⭐ DO NOT SHOW IN MAP
    }).addTo(map);

    dayRoutes[day].on('routesfound', function(e) {
        const instructions = e.routes[0].instructions;

        const box = document.createElement("div");
        box.className = "directionBox";
        box.innerHTML = `<h3>${day.toUpperCase()}</h3>`;

        instructions.forEach(i => {
            box.innerHTML += `<p>${i.text}</p>`;
        });

        document.getElementById("directionsContent").appendChild(box);
    });
}
