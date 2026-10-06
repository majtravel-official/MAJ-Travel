// script.js
// ------------------------------------------------------------
// Itinerary builder with:
// - Travel time per stop
// - Distance per stop
// - Automatic day summaries
// - Drag-and-drop stops
// - Day reordering
// ------------------------------------------------------------

const STORAGE_KEY = "majtravel_itinerary";

function loadItinerary() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return { tripName: "", tripStart: "", days: [] };
    }
    try {
        return JSON.parse(raw);
    } catch {
        return { tripName: "", tripStart: "", days: [] };
    }
}

function saveItinerary(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
    const tripNameInput = document.getElementById("tripName");
    const tripStartInput = document.getElementById("tripStart");
    const daysContainer = document.getElementById("daysContainer");
    const addDayBtn = document.getElementById("addDayBtn");
    const saveBtn = document.getElementById("saveItineraryBtn");

    if (!tripNameInput || !tripStartInput || !daysContainer) return;

    let itinerary = loadItinerary();

    tripNameInput.value = itinerary.tripName || "";
    tripStartInput.value = itinerary.tripStart || "";

    let dragContext = {
        dayIndex: null,
        stopIndex: null
    };

    function renderDays() {
        daysContainer.innerHTML = "";

        itinerary.days.forEach((day, index) => {
            const dayDiv = document.createElement("div");
            dayDiv.className = "day-card";

            // Heading + summary
            const heading = document.createElement("h3");
            heading.textContent = `Day ${index + 1}: ${day.title || ""}`;
            dayDiv.appendChild(heading);

            const summaryP = document.createElement("p");
            summaryP.style.fontStyle = "italic";
            summaryP.style.fontSize = "0.85rem";
            summaryP.textContent = buildDaySummary(day);
            dayDiv.appendChild(summaryP);

            // Day title
            const titleLabel = document.createElement("label");
            titleLabel.textContent = "Day title:";
            const titleInput = document.createElement("input");
            titleInput.value = day.title || "";
            titleInput.addEventListener("input", () => {
                day.title = titleInput.value;
                heading.textContent = `Day ${index + 1}: ${day.title || ""}`;
            });
            titleLabel.appendChild(titleInput);
            dayDiv.appendChild(titleLabel);

            // Day notes
            const notesLabel = document.createElement("label");
            notesLabel.textContent = "Day notes:";
            const notesArea = document.createElement("textarea");
            notesArea.rows = 3;
            notesArea.value = day.notes || "";
            notesArea.addEventListener("input", () => {
                day.notes = notesArea.value;
            });
            notesLabel.appendChild(notesArea);
            dayDiv.appendChild(notesLabel);

            // Stops container
            const stopsContainer = document.createElement("div");
            day.stops = day.stops || [];

            day.stops.forEach((stop, sIndex) => {
                const stopDiv = document.createElement("div");
                stopDiv.className = "stop-card";
                stopDiv.draggable = true;

                // Drag-and-drop attributes
                stopDiv.addEventListener("dragstart", (e) => {
                    dragContext.dayIndex = index;
                    dragContext.stopIndex = sIndex;
                    e.dataTransfer.effectAllowed = "move";
                });

                stopDiv.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                });

                stopDiv.addEventListener("drop", (e) => {
                    e.preventDefault();
                    if (dragContext.dayIndex === null || dragContext.stopIndex === null) return;

                    const fromDay = dragContext.dayIndex;
                    const fromStop = dragContext.stopIndex;
                    const toDay = index;
                    const toStop = sIndex;

                    const draggedStop = itinerary.days[fromDay].stops[fromStop];
                    itinerary.days[fromDay].stops.splice(fromStop, 1);
                    itinerary.days[toDay].stops.splice(toStop, 0, draggedStop);

                    dragContext.dayIndex = null;
                    dragContext.stopIndex = null;

                    renderDays();
                });

                // Stop name
                const stopLabel = document.createElement("label");
                stopLabel.textContent = `Stop ${sIndex + 1} name:`;
                const stopInput = document.createElement("input");
                stopInput.value = stop.name || "";
                stopInput.addEventListener("input", () => {
                    stop.name = stopInput.value;
                });
                stopLabel.appendChild(stopInput);
                stopDiv.appendChild(stopLabel);

                // Time
                const timeLabel = document.createElement("label");
                timeLabel.textContent = "Time:";
                const timeInput = document.createElement("input");
                timeInput.type = "time";
                timeInput.value = stop.time || "";
                timeInput.addEventListener("input", () => {
                    stop.time = timeInput.value;
                });
                timeLabel.appendChild(timeInput);
                stopDiv.appendChild(timeLabel);

                // Travel time (minutes from previous stop)
                const travelLabel = document.createElement("label");
                travelLabel.textContent = "Travel time from previous stop (mins):";
                const travelInput = document.createElement("input");
                travelInput.type = "number";
                travelInput.min = "0";
                travelInput.value = stop.travelMinutes || "";
                travelInput.addEventListener("input", () => {
                    stop.travelMinutes = travelInput.value;
                    summaryP.textContent = buildDaySummary(day);
                });
                travelLabel.appendChild(travelInput);
                stopDiv.appendChild(travelLabel);

                // Distance (miles from previous stop)
                const distanceLabel = document.createElement("label");
                distanceLabel.textContent = "Distance from previous stop (miles):";
                const distanceInput = document.createElement("input");
                distanceInput.type = "number";
                distanceInput.min = "0";
                distanceInput.step = "0.1";
                distanceInput.value = stop.distanceMiles || "";
                distanceInput.addEventListener("input", () => {
                    stop.distanceMiles = distanceInput.value;
                    summaryP.textContent = buildDaySummary(day);
                });
                distanceLabel.appendChild(distanceInput);
                stopDiv.appendChild(distanceLabel);

                // Stop notes
                const stopNotesLabel = document.createElement("label");
                stopNotesLabel.textContent = "Notes:";
                const stopNotesArea = document.createElement("textarea");
                stopNotesArea.rows = 2;
                stopNotesArea.value = stop.notes || "";
                stopNotesArea.addEventListener("input", () => {
                    stop.notes = stopNotesArea.value;
                });
                stopNotesLabel.appendChild(stopNotesArea);
                stopDiv.appendChild(stopNotesLabel);

                // Remove stop
                const removeStopBtn = document.createElement("button");
                removeStopBtn.textContent = "Remove Stop";
                removeStopBtn.addEventListener("click", () => {
                    day.stops.splice(sIndex, 1);
                    renderDays();
                });
                stopDiv.appendChild(removeStopBtn);

                stopsContainer.appendChild(stopDiv);
            });

            // Add stop button
            const addStopBtn = document.createElement("button");
            addStopBtn.textContent = "Add Stop";
            addStopBtn.addEventListener("click", () => {
                day.stops.push({
                    name: "",
                    time: "",
                    notes: "",
                    travelMinutes: "",
                    distanceMiles: ""
                });
                renderDays();
            });

            dayDiv.appendChild(stopsContainer);
            dayDiv.appendChild(addStopBtn);

            // Day reordering buttons
            const reorderContainer = document.createElement("div");

            const moveUpBtn = document.createElement("button");
            moveUpBtn.textContent = "Move Day Up";
            moveUpBtn.addEventListener("click", () => {
                if (index > 0) {
                    const temp = itinerary.days[index];
                    itinerary.days[index] = itinerary.days[index - 1];
                    itinerary.days[index - 1] = temp;
                    renderDays();
                }
            });
            reorderContainer.appendChild(moveUpBtn);

            const moveDownBtn = document.createElement("button");
            moveDownBtn.textContent = "Move Day Down";
            moveDownBtn.addEventListener("click", () => {
                if (index < itinerary.days.length - 1) {
                    const temp = itinerary.days[index];
                    itinerary.days[index] = itinerary.days[index + 1];
                    itinerary.days[index + 1] = temp;
                    renderDays();
                }
            });
            reorderContainer.appendChild(moveDownBtn);

            dayDiv.appendChild(reorderContainer);

            // Remove day
            const removeDayBtn = document.createElement("button");
            removeDayBtn.textContent = "Remove Day";
            removeDayBtn.addEventListener("click", () => {
                itinerary.days.splice(index, 1);
                renderDays();
            });
            dayDiv.appendChild(removeDayBtn);

            daysContainer.appendChild(dayDiv);
        });
    }

    renderDays();

    addDayBtn.addEventListener("click", () => {
        itinerary.days.push({ title: "", notes: "", stops: [] });
        renderDays();
    });

    saveBtn.addEventListener("click", () => {
        itinerary.tripName = tripNameInput.value;
        itinerary.tripStart = tripStartInput.value;
        saveItinerary(itinerary);
        alert("Itinerary saved.");
    });
});
