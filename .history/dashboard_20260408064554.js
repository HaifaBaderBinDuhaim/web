let completed = 0;
const total = 3;

window.onload = function () {
  updateRate();
};

function markCompleted(button) {
  if (button.disabled) return;

  const parent = button.closest(".session-actions");
  const missedBtn = parent.querySelector(".missed-btn");

  completed++;

  button.disabled = true;
  missedBtn.disabled = true;

  button.textContent = "Done";

  updateRate();
}

function markMissed(button) {
  if (button.disabled) return;

  const parent = button.closest(".session-actions");
  const completedBtn = parent.querySelector(".session-btn");

  button.disabled = true;
  completedBtn.disabled = true;

  button.textContent = "Missed";

  updateRate();
}

function updateRate() {
  const rate = Math.round((completed / total) * 100);
  document.getElementById("completionRate").textContent = rate + "%";
}
