// ربط عناصر واجهة المستخدم بالبلانر
const modal = document.getElementById("sessionModal");
const generatePlanBtn = document.getElementById("generatePlanBtn");
const closeBtn = document.querySelector(".close-btn");
const sessionForm = document.getElementById("sessionForm");
const deleteBtn = document.getElementById("deleteBtn");
const eventCourseSelect = document.getElementById("eventCourse");
const timetableBody = document.getElementById("timetableBody");
// تعريف الفترات الزمنية (يمكن تعديلها حسب الحاجة)
const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
];

// مصفوفة الجلسات المرفقة
let sessions = [];

async function loadSessions() {
  try {
    const response = await fetch("http://localhost:3000/studySchedule");
    sessions = await response.json();
    displayTable();
  } catch (error) {
    console.log(error);
  }
}

loadSessions();

// 1) جلب مواد الداشبورد تلقائياً
function loadDashboardCourses() {
  eventCourseSelect.innerHTML = "";
  let dashboardCourses = JSON.parse(localStorage.getItem("courses")) || [];

  if (dashboardCourses.length === 0) {
    let option = document.createElement("option");
    option.text = "No courses found - Add via Dashboard";
    option.value = "";
    eventCourseSelect.appendChild(option);
  } else {
    dashboardCourses.forEach((course) => {
      let option = document.createElement("option");
      let courseName = course.name || course;
      option.value = courseName;
      option.text = courseName;
      eventCourseSelect.appendChild(option);
    });
  }
}

// 2) فتح المودال لإضافة جلسة
generatePlanBtn.onclick = function () {
  sessionForm.reset();
  document.getElementById("sessionId").value = "";
  document.getElementById("modalTitle").innerText = "Add New Session";
  deleteBtn.style.display = "none";
  loadDashboardCourses();
  modal.style.display = "block";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event == modal) {
    modal.style.display = "none";
  }
};

// 3) حفظ الجلسات والتكرار
sessionForm.onsubmit = async function (e) {
  e.preventDefault();
  const id = document.getElementById("sessionId").value;

  const sessionData = {
    _id: id || undefined,
    title: document.getElementById("eventTitle").value,
    day: document.getElementById("eventDay").value,
    course: document.getElementById("eventCourse").value,
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value,
    status: document.getElementById("eventStatus").value,
    repeat: document.getElementById("repeatWeekly").checked,
  };

  if (id) {
    // سنربط التعديل مع MongoDB لاحقًا
    sessions = sessions.map((s) =>
      s._id === id ? { ...sessionData, _id: id } : s,
    );
  } else {
    const response = await fetch("http://localhost:3000/studySchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    });

    const result = await response.json();

    sessionData._id = result.insertedId;
    sessions.push(sessionData);
  }

  modal.style.display = "none";
  displayTable();
};

// 4) وضع التعديل (عند الضغط على الجلسة داخل الجدول)
function openEditModal(sessionId) {
  const session = sessions.find((s) => s._id === sessionId);

  if (!session) return;

  loadDashboardCourses();

  document.getElementById("sessionId").value = session._id;
  document.getElementById("eventTitle").value = session.title;
  document.getElementById("eventDay").value = session.day;
  document.getElementById("eventCourse").value = session.course;
  document.getElementById("startTime").value = session.startTime;
  document.getElementById("endTime").value = session.endTime;
  document.getElementById("eventStatus").value = session.status;
  document.getElementById("repeatWeekly").checked = session.repeat;

  document.getElementById("modalTitle").innerText = "Edit Session";
  deleteBtn.style.display = "inline-block";
  modal.style.display = "block";
}
// 5) حذف الموعد
deleteBtn.onclick = async function () {
  const id = document.getElementById("sessionId").value;

  try {
    await fetch(`http://localhost:3000/studySchedule/${id}`, {
      method: "DELETE",
    });

    sessions = sessions.filter((s) => s._id !== id);

    modal.style.display = "none";
    displayTable();

    alert("Session deleted successfully");
  } catch (error) {
    console.log(error);
    alert("Error deleting session");
  }
};
// تحويل الوقت من 12 ساعة إلى 24 ساعة للمقارنة الصحيحة
function convertTo24(time12) {
  let [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = (parseInt(hours) + 12).toString();

  return `${hours.padStart(2, "0")}:${minutes}`;
}
function getClosestHour(time) {
  let [h, m] = time.split(":").map(Number);

  // نرجع الساعة فقط بدون الدقائق
  return h.toString().padStart(2, "0") + ":00";
}

// 6) عرض الجدول وبنائه بالساعات والأيام
function displayTable() {
  timetableBody.innerHTML = "";

  timeSlots.forEach((slot) => {
    let tr = document.createElement("tr");

    let timeTd = document.createElement("td");
    timeTd.innerText = slot;
    timeTd.className = "time-column";
    tr.appendChild(timeTd);

    const slot24 = convertTo24(slot);

    daysOrder.forEach((day) => {
      let td = document.createElement("td");

      const matchedSession = sessions.find((s) => {
        const sessionHour = getClosestHour(s.startTime);
        return s.day === day && sessionHour === slot24;
      });

      if (matchedSession) {
        let sessionCard = document.createElement("div");
        sessionCard.className = `session-card ${matchedSession.status.toLowerCase()}`;
        sessionCard.innerHTML = `
                    <span class="card-title">${matchedSession.course} (${matchedSession.title})</span>
                    <span class="card-time">${matchedSession.startTime} - ${matchedSession.endTime}</span>
                `;

        sessionCard.onclick = function () {
          openEditModal(matchedSession._id);
        };
        td.appendChild(sessionCard);
      }

      tr.appendChild(td);
    });

    timetableBody.appendChild(tr);
  });
}

// تشغيل الواجهة فور تحميل ملف الـ Window وتنشيط أيقونات Lucide للـ Sidebar
window.onload = function () {
  displayTable();
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
};
