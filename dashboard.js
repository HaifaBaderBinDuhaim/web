
window.onload = function () {
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled") {
    document.body.classList.add("dark");
  }
};
let completedSessions = 0;
const totalSessions = 3;

window.onload = function () {
  const savedName = localStorage.getItem("studentName");
  const savedEmail = localStorage.getItem("loggedInUser");

  if (savedName) {
    document.getElementById("studentName").textContent = savedName;
  } else if (savedEmail) {
    document.getElementById("studentName").textContent = savedEmail;
  }
};

function markCompleted(button) {
  if (button.classList.contains("done-btn")) {
    return;
  }

  button.classList.add("done-btn");
  button.textContent = "Done";

  completedSessions++;
  updateCompletionRate();
}

function updateCompletionRate() {
  const completionRate = Math.round((completedSessions / totalSessions) * 100);
  document.getElementById("completionRate").textContent = completionRate + "%";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("studentName");
  window.location.href = "logIn.html";
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  // نحفظ الحالة
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}

// لما الصفحة تفتح
window.onload = function () {
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled") {
    document.body.classList.add("dark");
  }

  const savedName = localStorage.getItem("studentName");
  const savedEmail = localStorage.getItem("loggedInUser");

  if (savedName) {
    document.getElementById("studentName").textContent = savedName;
  } else if (savedEmail) {
    document.getElementById("studentName").textContent = savedEmail;
  }
};
