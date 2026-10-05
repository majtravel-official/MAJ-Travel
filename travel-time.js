function getCoordinates(placeName, callback) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            if (data && data.length > 0) {
                callback({
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                });
            } else {
                callback(null);
            }
        })
        .catch(() => callback(null));
}
