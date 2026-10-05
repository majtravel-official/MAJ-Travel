let map;
let routeControl;

// Initialise FREE Leaflet Map
function initMap() {
    map = L.map('map').setView([53.4808, -2.2426], 7); // Default: Manchester

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

// Draw route using Leaflet Routing Machine
function updateRoute(locations) {
    if (routeControl) {
        map.removeControl(routeControl);
    }

    if (locations.length < 2) return;

    routeControl = L.Routing.control({
        waypoints: locations.map(loc => L.latLng(loc.lat, loc.lng)),
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false
    }).addTo(map);
}
