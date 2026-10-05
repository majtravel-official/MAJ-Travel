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
        show: true
    }).addTo(map);

    // ⭐ MOVE ALL ROUTING PANELS INTO SCROLL WRAPPER
    setTimeout(() => {
        const wrapper = document.getElementById("routeScrollWrapper");
        const panels = document.querySelectorAll(".leaflet-routing-container");

        panels.forEach(panel => {
            wrapper.appendChild(panel);
        });
    }, 200);
}
