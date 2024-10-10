document.addEventListener("DOMContentLoaded", function() {
    const tasksTable = document.getElementById("tasksTable").querySelector("tbody");
    let authorized = false;

    // Generar filas de la tabla para cada semana
    for (let week = 1; week <= 16; week++) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>Semana ${week}</td>
            <td>Descripción de la tarea de la semana ${week}</td>
            <td>
                <input type="file" accept="application/pdf" onchange="uploadPDF(this, ${week})" disabled>
                <button onclick="togglePDFView(${week})" disabled>Ver PDF</button>
            </td>
            <td>
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png,.zip" onchange="uploadComplementaryFile(this, ${week})">
                <div id="complementaryFiles${week}" class="complementary-files"></div>
            </td>
        `;

        const pdfContainer = document.createElement("tr");
        pdfContainer.classList.add("pdf-container-row");
        pdfContainer.innerHTML = `
            <td colspan="4">
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

// Archivo PDF autorizado solo por usuario
const pdfFiles = {};  // Objeto para almacenar los archivos PDF subidos
const complementaryFiles = {};  // Objeto para almacenar archivos complementarios

// Función de autenticación para habilitar la subida de PDF
function authorize() {
    const accessCode = document.getElementById("accessCode").value;
    if (accessCode === "tuClaveSegura") {  // Reemplaza "tuClaveSegura" por la clave que desees
        authorized = true;
        alert("Autorización exitosa. Ahora puedes subir archivos PDF.");
        
        document.querySelectorAll("input[type='file'][accept='application/pdf']").forEach(input => {
            input.disabled = false;
        });
        
        document.querySelectorAll("td button[onclick^='togglePDFView']").forEach(button => {
            button.disabled = false;
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

function uploadComplementaryFile(input, week) {
    const file = input.files[0];
    if (file) {
        if (!complementaryFiles[week]) complementaryFiles[week] = [];
        complementaryFiles[week].push(file);

        const fileDisplay = document.createElement("p");
        fileDisplay.textContent = `Archivo: ${file.name}`;
        document.getElementById(`complementaryFiles${week}`).appendChild(fileDisplay);
    }
}


