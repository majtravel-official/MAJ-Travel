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
    console.log("initMap running");

    map = L.map('map').setView([53.48, -2.24], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

function updateDayRoute(day, locations) {
    if (!map) {
        console.log("map not ready");
        return;
    }

    if (dayRoutes[day]) {
        map.removeControl(dayRoutes[day]);
    }

    if (dayMarkers[day]) {
        dayMarkers[day].forEach(m => map.removeLayer(m));
    }
    dayMarkers[day] = [];

    if (locations.length < 2) {
        console.log(`Day ${day} has fewer than 2 stops`);
        return;
    }

    dayRoutes[day] = L.Routing.control({
        waypoints: locations.map(loc => L.latLng(loc.lat, loc.lng)),
        lineOptions: {
            styles: [{ color: dayColours[day], weight: 5 }]
        },
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        show: true,
        routeWhileDragging: false
    }).addTo(map);

    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(map);
        marker.bindPopup(`<b>${loc.name}</b>`);
        dayMarkers[day].push(marker);
    });
}

window.addEventListener("load", initMap);
