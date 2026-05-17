const courses = [];

const form = document.querySelector("form");
const courseTable = document.querySelector("table");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const courseName = document.querySelector("#courseName").value;
  const courseCode = document.querySelector("#courseCode").value;
  const instructor = document.querySelector("#instructor").value;
  const creditHours = document.querySelector("#creditHours").value;
  const category = document.querySelector("#category").value;

  let priority = "";

  if (document.querySelector("#high").checked) {
    priority = "High";
  } else if (document.querySelector("#medium").checked) {
    priority = "Medium";
  } else {
    priority = "Low";
  }

  const course = {
    name: courseName,
    code: courseCode,
    instructor: instructor,
    hours: creditHours,
    category: category,
    priority: priority,
  };

  courses.push(course);

  addCourseToTable(course);

  form.reset();

  document.querySelector("#medium").checked = true;
});

function addCourseToTable(course) {
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${course.name}</td>
        <td>${course.code}</td>
        <td>${course.instructor}</td>
        <td>${course.hours}</td>
        <td>${course.category}</td>
        <td>${course.priority}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

  courseTable.appendChild(row);
}

courseTable.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const row = event.target.parentElement.parentElement;

    row.remove();
  }

  if (event.target.classList.contains("edit-btn")) {
    const row = event.target.parentElement.parentElement;

    const courseName = row.children[0].textContent;
    const courseCode = row.children[1].textContent;
    const instructor = row.children[2].textContent;
    const creditHours = row.children[3].textContent;
    const category = row.children[4].textContent;

    document.querySelector("#courseName").value = courseName;
    document.querySelector("#courseCode").value = courseCode;
    document.querySelector("#instructor").value = instructor;
    document.querySelector("#creditHours").value = creditHours;
    document.querySelector("#category").value = category;

    row.remove();
  }
});

lucide.createIcons();