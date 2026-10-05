function getCoordinates(place, callback) {
    // Try exact search first
    fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(place + ", UK")}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                callback({
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                });
                return;
            }

            // Fallback: try town only
            fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&city=${encodeURIComponent(place)}`)
                .then(res => res.json())
                .then(data2 => {
                    if (data2 && data2.length > 0) {
                        callback({
                            lat: parseFloat(data2[0].lat),
                            lng: parseFloat(data2[0].lon)
                        });
                        return;
                    }

                    // Fallback: try county search
                    fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&county=${encodeURIComponent(place)}`)
                        .then(res => res.json())
                        .then(data3 => {
                            if (data3 && data3.length > 0) {
                                callback({
                                    lat: parseFloat(data3[0].lat),
                                    lng: parseFloat(data3[0].lon)
                                });
                                return;
                            }

                            // Final fallback: fail gracefully
                            callback(null);
                        });
                });
        })
        .catch(() => callback(null));
}
