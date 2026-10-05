/* ============================================================
   MAJ TRAVEL — PRINTABLE ITINERARY ENGINE (TEXT‑ONLY VERSION)
   MODULE 7
============================================================ */

/* ------------------------------------------------------------
   LOAD ITINERARY FROM LOCALSTORAGE
------------------------------------------------------------ */
function loadPrintableItinerary() {
    const saved = JSON.parse(localStorage.getItem("itinerary"));
    const printArea = document.getElementById("printArea");

    if (!saved) {
        printArea.innerHTML = "<p>No itinerary found.</p>";
        return;
    }

    printArea.innerHTML = ""; // Clear existing content
 
    Object.keys(saved).forEach(day => {
        const dayBlock = document.createElement("div");
        dayBlock.classList.add("print-day");

        const heading = document.createElement("h2");
        heading.textContent = day.replace("day", "Day ");
        dayBlock.appendChild(heading);

        const list = document.createElement("ul");

        saved[day].forEach(item => {
            const li = document.createElement("li");

            // Stop text
            const stopText = document.createElement("div");
            stopText.textContent = item.text;
            stopText.classList.add("print-stop-text");
            li.appendChild(stopText);

            // Notes
            if (item.notes && item.notes.trim() !== "") {
                const notes = document.createElement("div");
                notes.textContent = "Notes: " + item.notes;
                notes.classList.add("print-notes");
                li.appendChild(notes);
            }

            // Travel time
            if (item.travelTime && item.travelTime.trim() !== "") {
                const travel = document.createElement("div");
                travel.textContent = "Travel time: " + item.travelTime;
                travel.classList.add("print-travel");
                li.appendChild(travel);
            }

            list.appendChild(li);
        });

        dayBlock.appendChild(list);
        printArea.appendChild(dayBlock);
    });
}

/* ------------------------------------------------------------
   PDF DOWNLOAD
------------------------------------------------------------ */
function setupPDFButton() {
    const btn = document.getElementById("pdfBtn");

    btn.addEventListener("click", () => {
        const element = document.getElementById("printArea");

        const options = {
            margin: 10,
            filename: "MAJ-Travel-Itinerary.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(options).from(element).save();
    });
}

/* ------------------------------------------------------------
   INITIALISE
------------------------------------------------------------ */
loadPrintableItinerary();
setupPDFButton();
