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
function formatReminderDate(dateValue) {
  const taskDate = new Date(dateValue);
  taskDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === 2) return "After tomorrow";

  return dateValue;
}

function markMissed(button) {
  const actions = button.closest(".session-actions");
  const sessionBox = button.closest(".session-box");

  const completedBtn = actions.querySelector(".session-btn");
  const undoBtn = actions.querySelector(".undo-btn");

  // current session title
  const title = sessionBox.querySelector(".session-info strong").textContent;

  const time = sessionBox.querySelector(".session-info p").textContent;

  // current date
  const today = new Date();

  // add 2 days
  today.setDate(today.getDate() + 2);

  const futureDate = today.toLocaleDateString();

  // mark current as missed
  button.dataset.selected = "true";
  button.textContent = "Missed";

  button.disabled = true;
  completedBtn.disabled = true;
  undoBtn.disabled = false;

  // create new session automatically
  const sessionsContainer = document.getElementById("sessionsContainer");

  const newSession = document.createElement("div");

  newSession.className = "session-box";

  newSession.innerHTML = `
    <div class="session-info">
      <strong>${title} (Rescheduled)</strong>
      <p>${futureDate} | ${time}</p>
    </div>

    <div class="session-actions">
      <button class="session-btn"
        onclick="markCompleted(this)">
        Completed
      </button>

      <button class="missed-btn"
       onclick="markMissed(${session.id})">
        Missed
      </button>

      <button class="undo-btn"
        onclick="undoSession(this)"
        disabled>
        Undo
      </button>
    </div>
  `;

  sessionsContainer.appendChild(newSession);

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
