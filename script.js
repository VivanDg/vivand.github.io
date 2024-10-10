document.addEventListener("DOMContentLoaded", function() {
    const tasksTable = document.getElementById("tasksTable").querySelector("tbody");

    // Crear tareas para 16 semanas
    for (let week = 1; week <= 16; week++) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>Semana ${week}</td>
            <td>Descripción de la tarea de la semana ${week}</td>
            <td><button onclick="toggleTaskCompletion(this)">Pendiente</button></td>
        `;
        tasksTable.appendChild(row);
    }
});

function toggleTaskCompletion(button) {
    const row = button.parentElement.parentElement;
    row.classList.toggle("completed");
    button.textContent = row.classList.contains("completed") ? "Completada" : "Pendiente";
}
