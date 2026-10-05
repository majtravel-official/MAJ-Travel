/* ============================================================
   MAJ TRAVEL — GOOGLE MAPS ROUTE PREVIEW ENGINE
   MODULE 6
============================================================ */

let map;
let directionsService;
let directionsRenderer;

/* ------------------------------------------------------------
   INITIALISE MAP
------------------------------------------------------------ */
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 53.4808, lng: -2.2426 } // Manchester (default)
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        preserveViewport: false
    });

    updateRoutePreview();
}

/* ------------------------------------------------------------
   GET ALL STOPS IN ORDER
------------------------------------------------------------ */
function getAllStops() {
    const saved = JSON.parse(localStorage.getItem("itinerary"));
    if (!saved) return [];

    const allStops = [];

    Object.keys(saved).forEach(day => {
        saved[day].forEach(item => {
            allStops.push(item.text);
        });
    });

    return allStops;
}

/* ------------------------------------------------------------
   UPDATE ROUTE PREVIEW
------------------------------------------------------------ */
function updateRoutePreview() {
    const stops = getAllStops();

    if (!stops || stops.length < 2) {
        directionsRenderer.setDirections({ routes: [] });
        return;
    }

    const origin = stops[0];
    const destination = stops[stops.length - 1];

    const waypoints = stops.slice(1, -1).map(stop => ({
        location: stop,
        stopover: true
    }));

    const request = {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
        }
    });
}

/* ------------------------------------------------------------
   LISTEN FOR ITINERARY CHANGES
------------------------------------------------------------ */
window.addEventListener("storage", () => {
    updateRoutePreview();
});

/* ------------------------------------------------------------
   INITIALISE
------------------------------------------------------------ */
window.initMap = initMap;
