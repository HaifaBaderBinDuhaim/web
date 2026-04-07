
window.onload = function () {
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled") {
    document.body.classList.add("dark");
  }
};
function generateResponse() {
  const question = document.getElementById("studentQuestion").value.toLowerCase();
  const responseBox = document.getElementById("aiResponse");

  let response = "";

  if (question.includes("exam")) {
    response = "Focus on the most important topics first, review summaries, and solve short practice questions.";
  } else if (question.includes("deadline") || question.includes("assignment")) {
    response = "Break the task into smaller parts and finish the hardest part first.";
  } else if (question.includes("tired") || question.includes("stress") || question.includes("lost")) {
    response = "Start with a 25-minute session only. A small start is better than waiting for motivation.";
  } else if (question.trim() === "") {
    response = "Please type your question first.";
  } else {
    response = "Make a short plan, study one subject at a time, and take small breaks between sessions.";
  }

  responseBox.textContent = response;
}

function goBack() {
  window.location.href = "dashboard.html";
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}
