let tasks = [];
let editIndex = null;

const form = document.getElementById("taskForm");
const table = document.getElementById("tasksTable");
const courseSelect = document.getElementById("course");

// Load static courses
function loadCoursesIntoSelect() {
  courseSelect.innerHTML = "";

  const courses = ["CS 381", "CS 382", "MATH 101", "CS 201", "PHYSICS 101"];

  courses.forEach((course) => {
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

// Handle submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const task = {
    title: document.getElementById("title").value,
    course: document.getElementById("course").value,
    type: document.getElementById("type").value,
    dueDate: document.getElementById("date").value,
    priority: document.getElementById("priority").value,
    status: "pending",
  };

  try {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const result = await response.json();

    task._id = result.insertedId;
    tasks.push(task);

    displayTasks();
    form.reset();

    showNotification("Task added successfully ✅");
  } catch (error) {
    console.log(error);
    showNotification("Error adding task", "error");
  }
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
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </td>
        `;

    // Checkbox behavior (green highlight)
    const checkbox = row.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        row.classList.add("completed-row");
      } else {
        row.classList.remove("completed-row");
      }
    });

    table.appendChild(row);
  });
}

// Delete
function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
  showNotification("Task deleted 🗑️", "error");
}

// Edit
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
