let tasks = [];
let editIndex = -1;

const form = document.getElementById("taskForm");
const table = document.getElementById("tasksTable");
const submitBtn = document.querySelector("input[type='submit']");

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
        showNotification("Task added successfully ✅");
    } else {
        tasks[editIndex] = task;
        editIndex = -1;

        showNotification("Task updated ✏️");

        submitBtn.value = "Add Task";
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
            showNotification("Task deleted 🗑️");
        });

        row.querySelector(".edit").addEventListener("click", function () {
            document.getElementById("title").value = task.title;
            document.getElementById("course").value = task.course;
            document.getElementById("type").value = task.type;
            document.getElementById("date").value = task.date;
            document.getElementById("priority").value = task.priority;

            editIndex = index;

            submitBtn.value = "Update Task";
        });

        table.appendChild(row);
    });
}

function showNotification(message) {
    const note = document.createElement("div");

    note.textContent = message;

    note.style.position = "fixed";
    note.style.bottom = "20px";
    note.style.right = "20px";
    note.style.background = "#ec6f09";
    note.style.color = "white";
    note.style.padding = "12px 18px";
    note.style.borderRadius = "10px";
    note.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
    note.style.zIndex = "999";
    note.style.fontSize = "14px";

    document.body.appendChild(note);

    setTimeout(() => {
        note.remove();
    }, 2000);
}