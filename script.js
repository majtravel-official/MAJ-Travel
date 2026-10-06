// Basic itinerary structure stored in localStorage
const STORAGE_KEY = 'majtravel_itinerary';

function loadItinerary() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return { tripName: '', tripStart: '', days: [] };
    }
    try {
        return JSON.parse(raw);
    } catch {
        return { tripName: '', tripStart: '', days: [] };
    }
}

function saveItinerary(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
 
document.addEventListener('DOMContentLoaded', () => {
    const tripNameInput = document.getElementById('tripName');
    const tripStartInput = document.getElementById('tripStart');
    const daysContainer = document.getElementById('daysContainer');
    const addDayBtn = document.getElementById('addDayBtn');
    const saveBtn = document.getElementById('saveItineraryBtn');

    if (!tripNameInput || !tripStartInput || !daysContainer) return;

    let itinerary = loadItinerary();

    tripNameInput.value = itinerary.tripName || '';
    tripStartInput.value = itinerary.tripStart || '';

    function renderDays() {
        daysContainer.innerHTML = '';
        itinerary.days.forEach((day, index) => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-card';

            const heading = document.createElement('h3');
            heading.textContent = `Day ${index + 1}: ${day.title || ''}`;
            dayDiv.appendChild(heading);

            const titleLabel = document.createElement('label');
            titleLabel.textContent = 'Day title:';
            const titleInput = document.createElement('input');
            titleInput.value = day.title || '';
            titleInput.addEventListener('input', () => {
                day.title = titleInput.value;
            });
            titleLabel.appendChild(titleInput);
            dayDiv.appendChild(titleLabel);

            const notesLabel = document.createElement('label');
            notesLabel.textContent = 'Day notes:';
            const notesArea = document.createElement('textarea');
            notesArea.value = day.notes || '';
            notesArea.rows = 3;
            notesArea.addEventListener('input', () => {
                day.notes = notesArea.value;
            });
            notesLabel.appendChild(notesArea);
            dayDiv.appendChild(notesLabel);

            const stopsContainer = document.createElement('div');
            day.stops = day.stops || [];
            day.stops.forEach((stop, sIndex) => {
                const stopDiv = document.createElement('div');
                stopDiv.className = 'stop-card';

                const stopLabel = document.createElement('label');
                stopLabel.textContent = `Stop ${sIndex + 1} name:`;
                const stopInput = document.createElement('input');
                stopInput.value = stop.name || '';
                stopInput.addEventListener('input', () => {
                    stop.name = stopInput.value;
                });
                stopLabel.appendChild(stopInput);
                stopDiv.appendChild(stopLabel);

                const timeLabel = document.createElement('label');
                timeLabel.textContent = 'Time:';
                const timeInput = document.createElement('input');
                timeInput.type = 'time';
                timeInput.value = stop.time || '';
                timeInput.addEventListener('input', () => {
                    stop.time = timeInput.value;
                });
                timeLabel.appendChild(timeInput);
                stopDiv.appendChild(timeLabel);

                const stopNotesLabel = document.createElement('label');
                stopNotesLabel.textContent = 'Notes:';
                const stopNotesArea = document.createElement('textarea');
                stopNotesArea.rows = 2;
                stopNotesArea.value = stop.notes || '';
                stopNotesArea.addEventListener('input', () => {
                    stop.notes = stopNotesArea.value;
                });
                stopNotesLabel.appendChild(stopNotesArea);
                stopDiv.appendChild(stopNotesLabel);

                stopsContainer.appendChild(stopDiv);
            });

            const addStopBtn = document.createElement('button');
            addStopBtn.textContent = 'Add Stop';
            addStopBtn.addEventListener('click', () => {
                day.stops.push({ name: '', time: '', notes: '' });
                renderDays();
            });

            dayDiv.appendChild(stopsContainer);
            dayDiv.appendChild(addStopBtn);

            const removeDayBtn = document.createElement('button');
            removeDayBtn.textContent = 'Remove Day';
            removeDayBtn.addEventListener('click', () => {
                itinerary.days.splice(index, 1);
                renderDays();
            });
            dayDiv.appendChild(removeDayBtn);

            daysContainer.appendChild(dayDiv);
        });
    }

    renderDays();

    addDayBtn.addEventListener('click', () => {
        itinerary.days.push({ title: '', notes: '', stops: [] });
        renderDays();
    });

    saveBtn.addEventListener('click', () => {
        itinerary.tripName = tripNameInput.value;
        itinerary.tripStart = tripStartInput.value;
        saveItinerary(itinerary);
        alert('Itinerary saved.');
    });
});
