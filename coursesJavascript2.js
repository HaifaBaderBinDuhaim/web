const storageKey = "coursesPageDataV3";

let courses = JSON.parse(localStorage.getItem(storageKey));

const form = document.querySelector("form");
const courseTableBody = document.querySelector("tbody");

if (courses === null) {
  courses = [];

  const rows = courseTableBody.querySelectorAll("tr");

  for (let row of rows) {
    const course = {
      code: row.children[0].textContent.trim(),
      name: row.children[1].textContent.trim(),
      instructor: row.children[2].textContent.trim(),
      hours: row.children[3].textContent.trim(),
      priority: row.children[4].textContent.trim(),
      notes: "",
    };

    courses.push(course);
  }

  saveCourses();
}

displayCourses();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const course = {
    code: document.querySelector("#courseCode").value,
    name: document.querySelector("#courseName").value,
    instructor: document.querySelector("#instructor").value,
    hours: document.querySelector("#creditHours").value,
    priority: getPriority(),
    notes: document.querySelector("#notes").value,
  };

  courses.push(course);
  saveCourses();
  displayCourses();

  form.reset();
  document.querySelector("#medium").checked = true;
});

function getPriority() {
  if (document.querySelector("#high").checked) {
    return "High";
  } else if (document.querySelector("#medium").checked) {
    return "Medium";
  } else {
    return "Low";
  }
}

function saveCourses() {
  localStorage.setItem(storageKey, JSON.stringify(courses));
}

function displayCourses() {
  courseTableBody.innerHTML = "";

  for (let i = 0; i < courses.length; i++) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${courses[i].code}</td>
      <td>${courses[i].name}</td>
      <td>${courses[i].instructor}</td>
      <td>${courses[i].hours}</td>
      <td>${courses[i].priority}</td>
      <td>${courses[i].notes || ""}</td>
      <td>
        <button class="edit-btn table-btn edit-course" data-index="${i}">Edit</button>
        <button class="delete-btn table-btn remove-course" data-index="${i}">Remove</button>
      </td>
    `;

    courseTableBody.appendChild(row);
  }
}

courseTableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const index = event.target.getAttribute("data-index");

    courses.splice(index, 1);
    saveCourses();
    displayCourses();
  }

  if (event.target.classList.contains("edit-btn")) {
    const index = event.target.getAttribute("data-index");
    const course = courses[index];

    document.querySelector("#courseCode").value = course.code;
    document.querySelector("#courseName").value = course.name;
    document.querySelector("#instructor").value = course.instructor;
    document.querySelector("#creditHours").value = course.hours;
    document.querySelector("#notes").value = course.notes || "";

    if (course.priority === "High") {
      document.querySelector("#high").checked = true;
    } else if (course.priority === "Medium") {
      document.querySelector("#medium").checked = true;
    } else {
      document.querySelector("#low").checked = true;
    }

    courses.splice(index, 1);
    saveCourses();
    displayCourses();
  }
});
// This function is used to sync the courses data with the planner page haifa update
function syncCoursesForPlanner() {
  const simpleList = courses.map(c => ({
    id: Date.now() + Math.random(),
    name: c.name
  }));

  localStorage.setItem("courses", JSON.stringify(simpleList));
}
//end of haifa update

lucide.createIcons();
