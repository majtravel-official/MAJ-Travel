/* ============================================================
   MAJ TRAVEL — TRAVEL‑TIME AUTO‑CALCULATION ENGINE
   MODULE 5
============================================================ */

let distanceService;

/* ------------------------------------------------------------
   INITIALISE GOOGLE DISTANCE MATRIX
------------------------------------------------------------ */
function initTravelTimeEngine() {
    distanceService = new google.maps.DistanceMatrixService();
}

/* ------------------------------------------------------------
   CALCULATE TRAVEL TIME BETWEEN TWO STOPS
------------------------------------------------------------ */
function calculateTravelTime(origin, destination) {
    return new Promise(resolve => {
        if (!origin || !destination) {
            resolve("");
            return;
        }

        distanceService.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING
            },
            (response, status) => {
                if (status !== "OK") {
                    resolve("");
                    return;
                }

                const result = response.rows[0].elements[0];
                if (result.status === "ZERO_RESULTS") {
                    resolve("");
                    return;
                }

                resolve(result.duration.text);
            }
        );
    });
}

/* ------------------------------------------------------------
   UPDATE TRAVEL TIMES FOR ALL DAYS
------------------------------------------------------------ */
async function updateAllTravelTimes() {
    const saved = JSON.parse(localStorage.getItem("itinerary"));
    if (!saved) return;

    for (const day of Object.keys(saved)) {
        const stops = saved[day];

        for (let i = 0; i < stops.length - 1; i++) {
            const origin = stops[i].text;
            const destination = stops[i + 1].text;

            const travelTime = await calculateTravelTime(origin, destination);
            stops[i].travelTime = travelTime;
        }

        // Last stop has no travel time
        if (stops.length > 0) {
            stops[stops.length - 1].travelTime = "";
        }
    }

    localStorage.setItem("itinerary", JSON.stringify(saved));
}

/* ------------------------------------------------------------
   INITIALISE ENGINE
------------------------------------------------------------ */
initTravelTimeEngine();
