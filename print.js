/* ============================================================
   MAJ TRAVEL — PRINT ENGINE
   MODULE 4: PHOTO SYSTEM ENABLED
============================================================ */

function loadPrintData() {
    const saved = JSON.parse(localStorage.getItem("itinerary"));
    if (!saved) return;
 
    const container = document.getElementById("printArea");

    Object.keys(saved).forEach(day => {
        const section = document.createElement("div");
        section.classList.add("day-section");

        const title = document.createElement("h2");
        title.textContent = day.toUpperCase().replace("DAY", "Day ");
        section.appendChild(title);

        saved[day].forEach(item => {
            const stopDiv = document.createElement("div");
            stopDiv.classList.add("stop");

            // Stop text
            const text = document.createElement("strong");
            text.textContent = item.text;
            stopDiv.appendChild(text);

            // Notes
            if (item.notes && item.notes.trim() !== "") {
                const notes = document.createElement("div");
                notes.classList.add("notes");
                notes.textContent = item.notes;
                stopDiv.appendChild(notes);
            }

            // Photo
            if (item.photo && item.photo.trim() !== "") {
                const img = document.createElement("img");
                img.src = item.photo;
                stopDiv.appendChild(img);
            }

            section.appendChild(stopDiv);
        });

        container.appendChild(section);
    });
}

/* ------------------------------------------------------------
   PDF EXPORT
------------------------------------------------------------ */
document.getElementById("pdfBtn").addEventListener("click", () => {
    const element = document.getElementById("printArea");

    const options = {
        margin: 10,
        filename: 'MAJ-Travel-Itinerary.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
});

/* ------------------------------------------------------------
   INITIALISE
------------------------------------------------------------ */
loadPrintData();
