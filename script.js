document.addEventListener("DOMContentLoaded", function() {
    const tasksTable = document.getElementById("tasksTable").querySelector("tbody");
    const pdfModal = document.getElementById("pdfModal");
    const pdfViewer = document.getElementById("pdfViewer");
    const closeModal = document.querySelector(".close");

    // Generar filas de la tabla para cada semana
    for (let week = 1; week <= 16; week++) {
        const row = document.createElement("tr");

        // Crear un input de tipo file para cargar el PDF
        row.innerHTML = `
            <td>Semana ${week}</td>
            <td>Descripción de la tarea de la semana ${week}</td>
            <td>
                <input type="file" accept="application/pdf" onchange="uploadPDF(this, ${week})">
                <button onclick="viewPDF(${week})" disabled>Ver PDF</button>
            </td>
        `;
        tasksTable.appendChild(row);
    }

    // Cerrar el modal
    closeModal.onclick = function() {
        pdfModal.style.display = "none";
        pdfViewer.src = "";
    };

    window.onclick = function(event) {
        if (event.target === pdfModal) {
            pdfModal.style.display = "none";
            pdfViewer.src = "";
        }
    };
});

const pdfFiles = {};  // Objeto para almacenar los archivos PDF subidos

function uploadPDF(input, week) {
    const file = input.files[0];
    if (file && file.type === "application/pdf") {
        // Guardar el archivo PDF en el objeto pdfFiles
        pdfFiles[week] = URL.createObjectURL(file);

        // Habilitar el botón de visualización del PDF para esta semana
        const viewButton = input.nextElementSibling;
        viewButton.disabled = false;
    } else {
        alert("Por favor, sube un archivo PDF válido.");
    }
}

function viewPDF(week) {
    const pdfModal = document.getElementById("pdfModal");
    const pdfViewer = document.getElementById("pdfViewer");

    if (pdfFiles[week]) {
        pdfViewer.src = pdfFiles[week];
        pdfModal.style.display = "block";
    } else {
        alert("No hay ningún archivo PDF disponible para esta semana.");
    }
}
