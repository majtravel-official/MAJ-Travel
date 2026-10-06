// Global data model
let days = [];
let map;
let routeLayerGroup;

document.addEventListener("DOMContentLoaded", () => {
    const daysContainer = document.getElementById("daysContainer");
    const addDayBtn = document.getElementById("addDayBtn");
    const updateMapBtn = document.getElementById("updateMapBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const printBtn = document.getElementById("printBtn");
    const clearBtn = document.getElementById("clearBtn");

    // Only run on itinerary page
    if (!daysContainer) return;
 
    initDays(daysContainer);
    initMap();

    addDayBtn.addEventListener("click", () => addDay(daysContainer));
    updateMapBtn.addEventListener("click", updateMapFromDays);
    downloadBtn.addEventListener("click", downloadItinerary);
    printBtn.addEventListener("click", () => window.print());
    clearBtn.addEventListener("click", () => clearAll(daysContainer));
});

// ----- Days & stops -----

function initDays(container) {
    days = [];
    addDay(container);
}

function addDay(container) {
    const dayIndex = days.length;
    const day = {
        id: "day-" + (Date.now() + "-" + dayIndex),
        name: `Day ${dayIndex + 1}`,
        stops: [
            { id: `stop-${dayIndex}-1`, name: "" },
            { id: `stop-${dayIndex}-2`, name: "" }
        ]
    };
    days.push(day);
    renderDays(container);
}

function removeDay(dayId, container) {
    days = days.filter(d => d.id !== dayId);
    renderDays(container);
}

function addStop(dayId, container) {
    const day = days.find(d => d.id === dayId);
    if (!day) return;
    const stopIndex = day.stops.length + 1;
    day.stops.push({
        id: `stop-${dayId}-${stopIndex}`,
        name: ""
    });
    renderDays(container);
}

function removeStop(dayId, stopId, container) {
    const day = days.find(d => d.id === dayId);
    if (!day) return;
    day.stops = day.stops.filter(s => s.id !== stopId);
    renderDays(container);
}

function renderDays(container) {
    container.innerHTML = "";

    days.forEach(day => {
        const dayEl = document.createElement("div");
        dayEl.className = "maj-day";
        dayEl.dataset.dayId = day.id;
        dayEl.draggable = true;

        const header = document.createElement("div");
        header.className = "maj-day-header";

        const title = document.createElement("span");
        title.className = "maj-day-title";
        title.textContent = day.name;

        const controls = document.createElement("div");

        const handle = document.createElement("span");
        handle.className = "maj-day-handle";
        handle.textContent = "⇅";
        handle.title = "Drag to reorder day";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "maj-btn maj-btn-outline";
        removeBtn.textContent = "Remove day";
        removeBtn.addEventListener("click", () => removeDay(day.id, container));

        controls.appendChild(handle);
        controls.appendChild(removeBtn);

        header.appendChild(title);
        header.appendChild(controls);

        const stopsList = document.createElement("ul");
        stopsList.className = "maj-stops-list";
        stopsList.dataset.dayId = day.id;

        day.stops.forEach(stop => {
            const li = document.createElement("li");
            li.className = "maj-stop";
            li.dataset.stopId = stop.id;
            li.draggable = true;

            const handleStop = document.createElement("span");
            handleStop.className = "maj-stop-handle";
            handleStop.textContent = "⋮⋮";
            handleStop.title = "Drag to reorder stop";

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Stop name (town, venue, service area)";
            input.value = stop.name;
            input.addEventListener("input", e => {
                stop.name = e.target.value;
            });

            const removeStopBtn = document.createElement("span");
            removeStopBtn.className = "maj-stop-remove";
            removeStopBtn.textContent = "✕";
            removeStopBtn.title = "Remove stop";
            removeStopBtn.addEventListener("click", () =>
                removeStop(day.id, stop.id, container)
            );

            li.appendChild(handleStop);
            li.appendChild(input);
            li.appendChild(removeStopBtn);
            stopsList.appendChild(li);
        });

        const addStopBtn = document.createElement("button");
        addStopBtn.type = "button";
        addStopBtn.className = "maj-btn maj-btn-secondary";
        addStopBtn.textContent = "Add stop";
        addStopBtn.addEventListener("click", () => addStop(day.id, container));

        dayEl.appendChild(header);
        dayEl.appendChild(stopsList);
        dayEl.appendChild(addStopBtn);

        container.appendChild(dayEl);
    });

    attachDragDrop(container);
}

// ----- Drag & drop -----

function attachDragDrop(container) {
    // Days
    const dayEls = Array.from(container.querySelectorAll(".maj-day"));
    let draggedDay = null;

    dayEls.forEach(dayEl => {
        dayEl.addEventListener("dragstart", () => {
            draggedDay = dayEl;
            dayEl.style.opacity = "0.5";
        });

        dayEl.addEventListener("dragend", () => {
            dayEl.style.opacity = "1";
            draggedDay = null;
            syncDaysFromDOM(container);
        });

        dayEl.addEventListener("dragover", e => {
            e.preventDefault();
            if (!draggedDay) return;
            const bounding = dayEl.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            const parent = dayEl.parentNode;
            if (offset > bounding.height / 2) {
                parent.insertBefore(draggedDay, dayEl.nextSibling);
            } else {
                parent.insertBefore(draggedDay, dayEl);
            }
        });
    });

    // Stops
    const stopLists = Array.from(container.querySelectorAll(".maj-stops-list"));
    stopLists.forEach(list => {
        let draggedStop = null;

        const stopEls = Array.from(list.querySelectorAll(".maj-stop"));
        stopEls.forEach(stopEl => {
            stopEl.addEventListener("dragstart", () => {
                draggedStop = stopEl;
                stopEl.style.opacity = "0.5";
            });

            stopEl.addEventListener("dragend", () => {
                stopEl.style.opacity = "1";
                draggedStop = null;
                syncStopsFromDOM(list);
            });

            stopEl.addEventListener("dragover", e => {
                e.preventDefault();
                if (!draggedStop) return;
                const bounding = stopEl.getBoundingClientRect();
                const offset = e.clientY - bounding.top;
                const parent = stopEl.parentNode;
                if (offset > bounding.height / 2) {
                    parent.insertBefore(draggedStop, stopEl.nextSibling);
                } else {
                    parent.insertBefore(draggedStop, stopEl);
                }
            });
        });
    });
}

function syncDaysFromDOM(container) {
    const dayEls = Array.from(container.querySelectorAll(".maj-day"));
    const newDaysOrder = [];
    dayEls.forEach(dayEl => {
        const dayId = dayEl.dataset.dayId;
        const existing = days.find(d => d.id === dayId);
        if (existing) newDaysOrder.push(existing);
    });
    days = newDaysOrder;
}

function syncStopsFromDOM(list) {
    const dayId = list.dataset.dayId;
    const day = days.find(d => d.id === dayId);
    if (!day) return;

    const stopEls = Array.from(list.querySelectorAll(".maj-stop"));
    const newStops = [];
    stopEls.forEach(stopEl => {
        const stopId = stopEl.dataset.stopId;
        const input = stopEl.querySelector("input[type='text']");
        newStops.push({
            id: stopId,
            name: input ? input.value : ""
        });
    });
    day.stops = newStops;
}

// ----- Map & routes -----

function initMap() {
    const mapEl = document.getElementById("map");
    if (!mapEl) return;
    if (typeof L === "undefined") {
        console.error("Leaflet (L) is not loaded.");
        return;
    }

    map = L.map("map").setView([52.5, -1.5], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    routeLayerGroup = L.layerGroup().addTo(map);
}

function updateMapFromDays() {
    if (!map || !routeLayerGroup) return;

    routeLayerGroup.clearLayers();

    const colourSelect = document.getElementById("routeColour");
    const colour = colourSelect ? colourSelect.value : "#C9A86A";

    const allCoords = [];

    days.forEach((day, dayIndex) => {
        const dayCoords = [];
        day.stops.forEach((stop, stopIndex) => {
            const lat = 50 + dayIndex * 0.5 + stopIndex * 0.2;
            const lng = -2 + dayIndex * 0.3 + stopIndex * 0.15;
            dayCoords.push([lat, lng]);

            const marker = L.circleMarker([lat, lng], {
                radius: 5,
                color: colour,
                fillColor: colour,
                fillOpacity: 0.9
            }).addTo(routeLayerGroup);

            marker.bindPopup(
                `<strong>${day.name}</strong><br>${stop.name || "Unnamed stop"}`
            );
        });

        if (dayCoords.length > 1) {
            const polyline = L.polyline(dayCoords, {
                color: colour,
                weight: 4,
                opacity: 0.9
            }).addTo(routeLayerGroup);
            allCoords.push(...dayCoords);
        } else if (dayCoords.length === 1) {
            allCoords.push(dayCoords[0]);
        }
    });

    if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [20, 20] });
    }
}

// ----- Download / clear -----

function downloadItinerary() {
    const tripName = document.getElementById("tripName")?.value || "";
    const tripDate = document.getElementById("tripDate")?.value || "";
    const tripNotes = document.getElementById("tripNotes")?.value || "";

    const data = {
        tripName,
        tripDate,
        tripNotes,
        days
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (tripName || "itinerary") + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearAll(container) {
    if (!confirm("Clear all itinerary data?")) return;
    days = [];
    initDays(container);
    if (routeLayerGroup) routeLayerGroup.clearLayers();
}
