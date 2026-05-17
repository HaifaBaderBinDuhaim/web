let tasks = [];
let editIndex = null;

const form = document.getElementById("taskForm");
const table = document.getElementById("tasksTable");
const courseSelect = document.getElementById("course");

// Load static courses
function loadCoursesIntoSelect() {
    courseSelect.innerHTML = "";

    const courses = [
        "CS 381",
        "CS 382",
        "MATH 101",
        "CS 201",
        "PHYSICS 101"
    ];

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course;
        option.text = course;
        courseSelect.appendChild(option);
    });
}

// Init
window.onload = function () {
    loadCoursesIntoSelect();
};

// Handle submit (add / update)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const task = {
        title: document.getElementById("title").value,
        course: document.getElementById("course").value,
        type: document.getElementById("type").value,
        date: document.getElementById("date").value,
        priority: document.getElementById("priority").value
    };

    if (editIndex === null) {
        tasks.push(task);
        showNotification("Task added successfully ✅");
    } else {
        tasks[editIndex] = task;
        showNotification("Task updated successfully ✏️");
        editIndex = null;
    }

    displayTasks();
    form.reset();
});

// Render table
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
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </td>
        `;

        // Checkbox behavior (UI only)
        const checkbox = row.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                row.style.opacity = "0.5";
                row.style.textDecoration = "line-through";
            } else {
                row.style.opacity = "1";
                row.style.textDecoration = "none";
            }
        });

        table.appendChild(row);
    });
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    displayTasks();
    showNotification("Task deleted 🗑️", "error");
}

// Edit task
function editTask(index) {
    const task = tasks[index];

    document.getElementById("title").value = task.title;
    document.getElementById("course").value = task.course;
    document.getElementById("type").value = task.type;
    document.getElementById("date").value = task.date;
    document.getElementById("priority").value = task.priority;

    editIndex = index;
}

// Notification
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#ef4444"};
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 1000;
        font-weight: bold;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2500);
}