let tasks = [];

const form = document.getElementById("taskForm");
const table = document.getElementById("tasksTable");

// عند الضغط على Add Task
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const course = document.getElementById("course").value;
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;
    const priority = document.getElementById("priority").value;

    const task = {
        title,
        course,
        type,
        date,
        priority
    };

    tasks.push(task);

    addTaskToTable(task);

    form.reset();
});

// إضافة صف في الجدول
function addTaskToTable(task) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${task.title}</td>
        <td>${task.course}</td>
        <td>${task.type}</td>
        <td>${task.date}</td>
        <td>${task.priority}</td>
        <td>
            <button class="delete">Delete</button>
        </td>
    `;

    table.appendChild(row);

    // زر الحذف
    row.querySelector(".delete").addEventListener("click", function () {
        row.remove();
    });
}