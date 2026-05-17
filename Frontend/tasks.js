let tasks = [];
let editIndex = -1;

const form = document.getElementById("taskForm");
const table = document.getElementById("tasksTable");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = {
        title: document.getElementById("title").value,
        course: document.getElementById("course").value,
        type: document.getElementById("type").value,
        date: document.getElementById("date").value,
        priority: document.getElementById("priority").value
    };

    if (editIndex === -1) {
        tasks.push(task);
    } else {
        tasks[editIndex] = task;
        editIndex = -1;
    }

    displayTasks();
    form.reset();
});

function displayTasks() {
    table.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${task.title}</td>
            <td>${task.course}</td>
            <td>${task.type}</td>
            <td>${task.date}</td>
            <td>${task.priority}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;

        row.querySelector(".delete").addEventListener("click", function () {
            tasks.splice(index, 1);
            displayTasks();
        });

        row.querySelector(".edit").addEventListener("click", function () {
            document.getElementById("title").value = task.title;
            document.getElementById("course").value = task.course;
            document.getElementById("type").value = task.type;
            document.getElementById("date").value = task.date;
            document.getElementById("priority").value = task.priority;

            editIndex = index;
        });

        table.appendChild(row);
    });
}