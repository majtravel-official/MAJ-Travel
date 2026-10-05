// FREE OpenStreetMap Geocoding (Nominatim)

function getCoordinates(placeName, callback) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                callback({ lat: lat, lng: lon });
            } else {
                console.warn("Location not found:", placeName);
                callback(null);
            }
        })
        .catch(err => {
            console.error("Geocoding error:", err);
            callback(null);
        });
}
