let map;
let dayRoutes = {};
let dayMarkers = {};

const dayColours = {
    day1: "#007bff",
    day2: "#28a745",
    day3: "#fd7e14",
    day4: "#6f42c1",
    day5: "#20c997",
    day6: "#e83e8c",
    day7: "#ffc107"
};

function initMap() {
    map = L.map('map').setView([53.48, -2.24], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

function updateDayRoute(day, locations) {
    if (!map) return;

    // remove old route
    if (dayRoutes[day]) {
        map.removeControl(dayRoutes[day]);
    }

    // remove old markers
    if (dayMarkers[day]) {
        dayMarkers[day].forEach(m => map.removeLayer(m));
    }
    dayMarkers[day] = [];

    if (locations.length < 2) return;

    dayRoutes[day] = L.Routing.control({
        waypoints: locations.map(loc => L.latLng(loc.lat, loc.lng)),
        lineOptions: {
            styles: [{ color: dayColours[day], weight: 5 }]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: false
    }).addTo(map);

    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(map);
        marker.bindPopup(`<b>${loc.name}</b><br>${loc.time}`);
        dayMarkers[day].push(marker);
    });
}

window.addEventListener("load", initMap);
