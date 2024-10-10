document.addEventListener("DOMContentLoaded", function() {
    const tasksTable = document.getElementById("tasksTable").querySelector("tbody");
    let authorized = false;

    // Array con descripciones personalizadas para cada semana
    const descripciones = [
        "Actividad 01: Modelo conceptual de base de datos",
        "Actividad 02: Modelo Entidad - Relación",
        "Actividad 03: Modelo Lógico",
        "Actividad 04: Modelo Físico",
        "Actividad 05: Consultas básicas en SQL Server y PostgreSQL",
        "Descripción de la tarea de la semana 6",
        "Descripción de la tarea de la semana 7",
        "Descripción de la tarea de la semana 8",
        "Descripción de la tarea de la semana 9",
        "Descripción de la tarea de la semana 10",
        "Descripción de la tarea de la semana 11",
        "Descripción de la tarea de la semana 12",
        "Descripción de la tarea de la semana 13",
        "Descripción de la tarea de la semana 14",
        "Descripción de la tarea de la semana 15",
        "Descripción de la tarea de la semana 16"
    ];

    // Recuperar PDF y archivos complementarios desde localStorage
    const pdfFiles = JSON.parse(localStorage.getItem('pdfFiles')) || {};
    const complementaryFiles = JSON.parse(localStorage.getItem('complementaryFiles')) || {};

    // Generar filas de la tabla para cada semana
    for (let week = 1; week <= 16; week++) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>Semana ${week}</td>
            <td>${descripciones[week - 1]}</td>
            <td>
                <label class="label-upload" for="uploadPDF${week}">Subir PDF</label>
                <input type="file" id="uploadPDF${week}" accept="application/pdf" onchange="uploadPDF(this, ${week})" ${authorized ? '' : 'disabled'}>
                <button class="view-button" onclick="togglePDFView(${week})">Ver PDF</button>
                <button class="button-save" onclick="savePDF(${week})">Guardar PDF</button>
            </td>
            <td>
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.zip" onchange="uploadComplementaryFile(this, ${week})" ${authorized ? '' : 'disabled'}>
                <div id="complementaryFiles${week}" class="complementary-files"></div>
                <button class="button-download" onclick="downloadComplementaryFiles(${week})">Descargar Complementarios</button>
            </td>
        `;

        const pdfContainer = document.createElement("tr");
        pdfContainer.classList.add("pdf-container-row");
        pdfContainer.innerHTML = `
            <td colspan="4">
                <div class="pdf-container" id="pdfContainer${week}" style="display: none;">
                    <iframe id="pdfViewer${week}" src="${pdfFiles[week] || ''}"></iframe>
                    <div class="button-group">
                        <button class="button-download" onclick="downloadPDF(${week})">Descargar PDF</button>
                        <button class="button-delete" onclick="deletePDF(${week})" ${authorized ? '' : 'disabled'}>Eliminar PDF</button>
                    </div>
                </div>
            </td>
        `;
        tasksTable.appendChild(row);
        tasksTable.appendChild(pdfContainer);

        // Mostrar archivos complementarios si existen
        if (complementaryFiles[week]) {
            complementaryFiles[week].forEach(fileName => {
                const fileDisplay = document.createElement("p");
                fileDisplay.textContent = `Archivo: ${fileName}`;
                document.getElementById(`complementaryFiles${week}`).appendChild(fileDisplay);
            });
        }
    }
});

// Objeto para almacenar los archivos PDF y complementarios subidos en memoria temporal
let pdfFiles = JSON.parse(localStorage.getItem('pdfFiles')) || {};
let complementaryFiles = JSON.parse(localStorage.getItem('complementaryFiles')) || {};

// Función de autenticación para habilitar la subida de PDF
function authorize() {
    const accessCode = document.getElementById("accessCode").value;
    if (accessCode === "tuClaveSegura") {  // Reemplaza "tuClaveSegura" por la clave que desees
        authorized = true;
        alert("Autorización exitosa. Ahora puedes subir archivos PDF.");

        // Habilitar solo los inputs de subida de archivos
        document.querySelectorAll("input[type='file']").forEach(input => {
            input.disabled = false;
        });
    } else {
        alert("Clave incorrecta. Inténtalo de nuevo.");
    }
}

function uploadPDF(input, week) {
    if (!authorized) {
        alert("No estás autorizado para subir archivos PDF.");
        return;
    }
    
    const file = input.files[0];
    if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        pdfFiles[week] = fileURL;
        localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));  // Guardar en localStorage

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

function savePDF(week) {
    if (pdfFiles[week]) {
        localStorage.setItem(`savedPDFWeek${week}`, pdfFiles[week]); // Guardar en localStorage
        alert("PDF guardado en la página.");
    } else {
        alert("No hay PDF para guardar.");
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
        localStorage.setItem("pdfFiles", JSON.stringify(pdfFiles));  // Actualizar localStorage

        // Ocultar el contenedor PDF y resetear el input y el botón
        document.getElementById(`pdfContainer${week}`).style.display = "none";
        document.querySelectorAll(`#tasksTable tr:nth-child(${week * 2 - 1}) input[type="file"]`)[0].value = "";
        document.querySelectorAll(`#tasksTable tr:nth-child(${week * 2 - 1}) button`)[0].disabled = true;

        alert("El archivo PDF ha sido eliminado.");
    }
}

function uploadComplementaryFile(input, week) {
    const file = input.files[0];
    if (file) {
        if (!complementaryFiles[week]) complementaryFiles[week] = [];
        complementaryFiles[week].push(file.name);
        localStorage.setItem("complementaryFiles", JSON.stringify(complementaryFiles));  // Guardar en localStorage

        const fileDisplay = document.createElement("p");
        fileDisplay.textContent = `Archivo: ${file.name}`;
        document.getElementById(`complementaryFiles${week}`).appendChild(fileDisplay);
    }
}

function downloadComplementaryFiles(week) {
    if (complementaryFiles[week] && complementaryFiles[week].length > 0) {
        complementaryFiles[week].forEach((fileName, index) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([fileName]));  // Asegúrate de que este Blob sea el correcto para los archivos.
            link.download = `Complementario_Semana_${week}_${index + 1}_${fileName}`;
            link.click();
        });
    } else {
        alert("No hay archivos complementarios disponibles para esta semana.");
    }
}

