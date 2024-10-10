document.addEventListener("DOMContentLoaded", function() {
    const tasksTable = document.getElementById("tasksTable").querySelector("tbody");

    for (let week = 1; week <= 16; week++) {
        const row = document.createElement("tr");

        // URL de los archivos en GitHub
        const pdfURL = `semana/actividad01.pdf`;
        const complementaryFiles = [
            { name: "Ejemplo_Archivo_1.docx", url: `complementos/semana${week}/Ejemplo_Archivo_1.docx` },
            { name: "Ejemplo_Archivo_2.xlsx", url: `complementos/semana${week}/Ejemplo_Archivo_2.xlsx` }
        ];

        row.innerHTML = `
            <td>Semana ${week}</td>
            <td>
                <button onclick="togglePDFView(${week})">Ver PDF</button>
                <div class="pdf-container" id="pdfContainer${week}">
                    <iframe src="${pdfURL}" id="pdfViewer${week}"></iframe>
                    <button class="button-download" onclick="downloadPDF('${pdfURL}')">Descargar PDF</button>
                </div>
            </td>
            <td id="complementaryFiles${week}"></td>
        `;
        
        tasksTable.appendChild(row);
        showComplementaryFiles(week, complementaryFiles);
    }
});

function togglePDFView(week) {
    const pdfContainer = document.getElementById(`pdfContainer${week}`);
    pdfContainer.style.display = pdfContainer.style.display === "block" ? "none" : "block";
}

function downloadPDF(pdfURL) {
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = pdfURL.split('/').pop();
    link.click();
}

function showComplementaryFiles(week, files) {
    const container = document.getElementById(`complementaryFiles${week}`);
    files.forEach(file => {
        const fileElement = document.createElement("p");
        fileElement.innerHTML = `<a href="${file.url}" download>${file.name}</a>`;
        container.appendChild(fileElement);
    });
}
