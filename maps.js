// maps.js
// ------------------------------------------------------------
// Helper functions for coach-friendly travel calculations.
// Used by script.js for:
// - Travel time per stop
// - Distance per stop
// - Day summaries
// ------------------------------------------------------------

/**
 * Safely parse a number from input (string or number).
 */
function toNumber(value) {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
}

/**
 * Calculate total travel time (minutes) for a day.
 * Expects an array of stops with stop.travelMinutes.
 */
function calculateTotalTravelMinutes(stops) {
    return (stops || []).reduce((sum, stop) => {
        return sum + toNumber(stop.travelMinutes);
    }, 0);
}

/**
 * Calculate total distance (miles) for a day.
 * Expects an array of stops with stop.distanceMiles.
 */
function calculateTotalDistanceMiles(stops) {
    return (stops || []).reduce((sum, stop) => {
        return sum + toNumber(stop.distanceMiles);
    }, 0);
}

/**
 * Build a simple automatic summary string for a day.
 */
function buildDaySummary(day) {
    const stops = day.stops || [];
    const totalStops = stops.length;
    const totalMinutes = calculateTotalTravelMinutes(stops);
    const totalMiles = calculateTotalDistanceMiles(stops);

    const parts = [];
    parts.push(`${totalStops} stop${totalStops === 1 ? "" : "s"}`);

    if (totalMiles > 0) {
        parts.push(`${totalMiles.toFixed(1)} miles`);
    }
    if (totalMinutes > 0) {
        parts.push(`${totalMinutes} mins travel`);
    }

    return parts.join(" · ");
}

console.log("maps.js loaded – coach-friendly helpers ready.");
