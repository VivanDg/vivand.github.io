document.addEventListener("DOMContentLoaded", function() {
    const tasksTable = document.getElementById("tasksTable").querySelector("tbody");

    // Generar filas de la tabla para cada semana
    for (let week = 1; week <= 16; week++) {
        const row = document.createElement("tr");

        // Crear un contenedor para la sección de cada tarea
        row.innerHTML = `
            <td>Semana ${week}</td>
            <td>Descripción de la tarea de la semana ${week}</td>
            <td>
                <input type="file" accept="application/pdf" onchange="uploadPDF(this, ${week})">
                <button onclick="togglePDFView(${week})" disabled>Ver PDF</button>
            </td>
        `;
        const pdfContainer = document.createElement("tr");
        pdfContainer.classList.add("pdf-container-row");
        pdfContainer.innerHTML = `
            <td colspan="3">
                <div class="pdf-container" id="pdfContainer${week}">
                    <iframe id="pdfViewer${week}" src=""></iframe>
                    <div class="button-group">
                        <button class="button-download" onclick="downloadPDF(${week})">Descargar PDF</button>
                        <button class="button-delete" onclick="deletePDF(${week})">Eliminar PDF</button>
                    </div>
                </div>
            </td>
        `;
        tasksTable.appendChild(row);
        tasksTable.appendChild(pdfContainer);
    }
});

const pdfFiles = {};  // Objeto para almacenar los archivos PDF subidos

function uploadPDF(input, week) {
    const file = input.files[0];
    if (file && file.type === "application/pdf") {
        pdfFiles[week] = URL.createObjectURL(file);

        // Habilitar el botón de visualización del PDF para esta semana
        const viewButton = input.nextElementSibling;
        viewButton.disabled = false;
    } else {
        alert("Por favor, sube un archivo PDF válido.");
    }
}

function togglePDFView(week) {
    const pdfContainer = document.getElementById(`pdfContainer${week}`);
    const pdfViewer = document.getElementById(`pdfViewer${week}`);

    if (pdfFiles[week]) {
        pdfViewer.src = pdfFiles[week];
        pdfContainer.style.display = pdfContainer.style.display === "block" ? "none" : "block";
    } else {
        alert("No hay ningún archivo PDF disponible para esta semana.");
    }
}

function downloadPDF(week) {
    if (pdfFiles[week]) {
        const link = document.createElement("a");
        link.href = pdfFiles[week];
        link.download = `Semana_${week}.pdf`;
        link.click();
    }
}

function deletePDF(week) {
    if (pdfFiles[week]) {
        URL.revokeObjectURL(pdfFiles[week]);
        delete pdfFiles[week];

        // Ocultar el contenedor PDF y resetear el input y el botón
        document.getElementById(`pdfContainer${week}`).style.display = "none";
        document.querySelectorAll(`#tasksTable tr:nth-child(${week * 2 - 1}) input[type="file"]`)[0].value = "";
        document.querySelectorAll(`#tasksTable tr:nth-child(${week * 2 - 1}) button`)[0].disabled = true;

        alert("El archivo PDF ha sido eliminado.");
    }
}
