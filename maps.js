let map;
let dayRoutes = {}; // store route controls per day
let dayMarkers = {}; // store markers per day

// Colour palette for each day
const dayColours = {
    day1: "#007bff", // blue
    day2: "#28a745", // green
    day3: "#fd7e14", // orange
    day4: "#6f42c1", // purple
    day5: "#20c997", // teal
    day6: "#e83e8c", // pink
    day7: "#ffc107"  // yellow
};

// Initialise FREE Leaflet Map
function initMap() {
    map = L.map('map').setView([53.4808, -2.2426], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

// Draw route for a specific day
function updateDayRoute(day, locations) {

    // Remove old route for that day
    if (dayRoutes[day]) {
        map.removeControl(dayRoutes[day]);
    }

    // Remove old markers
    if (dayMarkers[day]) {
        dayMarkers[day].forEach(m => map.removeLayer(m));
    }
    dayMarkers[day] = [];

    if (locations.length < 2) return;

    // Create new route
    dayRoutes[day] = L.Routing.control({
        waypoints: locations.map(loc => L.latLng(loc.lat, loc.lng)),
        lineOptions: {
            styles: [{ color: dayColours[day], weight: 5 }]
        },
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true
    }).addTo(map);

    // Add markers for each stop
    locations.forEach((loc, index) => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(map);
        marker.bindPopup(`<b>${loc.name}</b><br>${loc.time}`);
        dayMarkers[day].push(marker);
    });
}
