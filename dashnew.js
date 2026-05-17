let completed = 0;
const total = 3;

window.onload = function () {
  updateRate();
};

function markCompleted(button) {
  const actions = button.closest(".session-actions");
  const missedBtn = actions.querySelector(".missed-btn");
  const undoBtn = actions.querySelector(".undo-btn");

  if (button.dataset.selected === "true") return;

  completed++;

  button.dataset.selected = "true";
  button.textContent = "Done";

  button.disabled = true;
  missedBtn.disabled = true;
  undoBtn.disabled = false;

  updateRate();
}

function markMissed(button) {
  const actions = button.closest(".session-actions");
  const completedBtn = actions.querySelector(".session-btn");
  const undoBtn = actions.querySelector(".undo-btn");

  button.dataset.selected = "true";
  button.textContent = "Missed";

  button.disabled = true;
  completedBtn.disabled = true;
  undoBtn.disabled = false;

  updateRate();
}

function undoSession(button) {
  const actions = button.closest(".session-actions");
  const completedBtn = actions.querySelector(".session-btn");
  const missedBtn = actions.querySelector(".missed-btn");

  if (completedBtn.dataset.selected === "true") {
    completed--;
  }

  completedBtn.dataset.selected = "false";
  missedBtn.dataset.selected = "false";

  completedBtn.textContent = "Completed";
  missedBtn.textContent = "Missed";

  completedBtn.disabled = false;
  missedBtn.disabled = false;
  button.disabled = true;

  updateRate();
}

function updateRate() {
  const rate = Math.round((completed / total) * 100);
  document.getElementById("completionRate").textContent = rate + "%";
}
