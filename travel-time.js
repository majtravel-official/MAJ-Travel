function getCoordinates(place, callback) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                callback(null);
                return;
            }

            callback({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            });
        })
        .catch(() => callback(null));
}
