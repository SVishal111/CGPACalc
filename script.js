// let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let subjects = [
  { "name": "RDBMS", "credit": 5 },
  { "name": "Computer Networks", "credit": 4 },
  { "name": "Unified Modeling Language", "credit": 3 },
  { "name": "Blockchain Technology", "credit": 3 },
  { "name": "Information Security", "credit": 3 },
  { "name": "Predictive Modeling", "credit": 4 },
  { "name": "Business Accounting", "credit": 4 },

  { "name": "OOPS", "credit": 5 },
  { "name": "Computer Graphics", "credit": 4 },
  { "name": "Cloud Computing", "credit": 3 },
  { "name": "Software Engineering", "credit": 4 },
  { "name": "Operations Research", "credit": 4 },
  { "name": "Business Intelligence", "credit": 4 },
  { "name": "Open Elective Subject", "credit": 3 },

  { "name": "Computer Organization and Architecture", "credit": 3 },
  { "name": "DSA", "credit": 5 },
  { "name": "Business Analytics", "credit": 4 },
  { "name": "Mathematics for Computing", "credit": 4 },

  { "name": "Python with Lab", "credit": 5 },
  { "name": "Programming in C", "credit": 4 },
  { "name": "Practical: C Programming", "credit": 3 },
  { "name": "Statistics for Computing", "credit": 4 }
];

const subjectContainer = document.getElementById("subjectContainer");
const adminSubjectsContainer = document.getElementById("adminSubjectsContainer");
const cgpaResult = document.getElementById("cgpaResult");
const avgResult = document.getElementById("avgResult");

function renderSubjectRow() {
  const row = document.createElement("div");
  row.className = "row g-2 align-items-center subject-row mt-2";
  row.innerHTML = `
    <div class="col-md-6">
      <select class="form-select subjectSelect" required>
        <option value="">Select Subject</option>
        ${subjects.map((s) => `<option value="${s.name}">${s.name}</option>`).join("")}
      </select>
    </div>
    <div class="col-md-4">
      <input type="number" step="0.01" min="0" max="10" class="form-control grade" placeholder="Grade (0 - 10)" required />
    </div>
    <div class="col-md-2">
      <button type="button" class="btn btn-danger remove-subject w-100">Remove</button>
    </div>`;
  subjectContainer.appendChild(row);
}

document.getElementById("addSubject").addEventListener("click", renderSubjectRow);

subjectContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-subject")) {
    e.target.closest(".subject-row").remove();
  }
});

document.getElementById("cgpaForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const subjectSelects = document.querySelectorAll(".subjectSelect");
  const grades = document.querySelectorAll(".grade");

  let totalCredits = 0;
  let weightedSum = 0;
  let gradeSum = 0;
  let validSubjects = 0;

  for (let i = 0; i < grades.length; i++) {
    const subjectName = subjectSelects[i].value;
    const grade = parseFloat(grades[i].value);
    const subject = subjects.find((s) => s.name === subjectName);

    if (!subject || isNaN(grade)) continue;

    totalCredits += subject.credit;
    weightedSum += grade * subject.credit;

    gradeSum += grade;
    validSubjects++;
  }

  const cgpa = totalCredits ? (weightedSum / totalCredits).toFixed(2) : 0;
  const avg = validSubjects ? (gradeSum / validSubjects).toFixed(2) : 0;

  cgpaResult.textContent = `Your CGPA is: ${cgpa} / 10`;
  avgResult.textContent = `Your Average is: ${avg} / 10`;
});

const adminModal = new bootstrap.Modal(document.getElementById("adminModal"));
const subjectModal = new bootstrap.Modal(document.getElementById("subjectModal"));

document.getElementById("openAdmin").addEventListener("click", () => adminModal.show());

document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const pass = document.getElementById("adminPassword");
  if (pass.value === "root") {
    pass.value = "";
    adminModal.hide();
    loadAdminSubjects();
    subjectModal.show();
  } else {
    alert("Incorrect password!");
  }
});

document.getElementById("addAdminSubject").addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "row g-2 align-items-center admin-subject-row mb-2";
  row.innerHTML = `
    <div class="col-md-6">
      <input type="text" class="form-control admin-subject-name" placeholder="Subject Name" required />
    </div>
    <div class="col-md-4">
      <input type="number" min="1" class="form-control admin-subject-credit" placeholder="Credits" required />
    </div>
    <div class="col-md-2">
      <button type="button" class="btn btn-danger w-100 remove-admin-subject">Remove</button>
    </div>`;
  adminSubjectsContainer.appendChild(row);
});

adminSubjectsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-admin-subject")) {
    e.target.closest(".admin-subject-row").remove();
  }
});

document.getElementById("subjectForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const names = document.querySelectorAll(".admin-subject-name");
  const credits = document.querySelectorAll(".admin-subject-credit");

  subjects = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();
    const credit = parseInt(credits[i].value);
    if (name && !isNaN(credit)) {
      subjects.push({ name, credit });
    }
  }

  localStorage.setItem("subjects", JSON.stringify(subjects));
  subjectModal.hide();
  subjectContainer.innerHTML = "";
  renderSubjectRow();
});

function loadAdminSubjects() {
  adminSubjectsContainer.innerHTML = "";
  subjects.forEach((s) => {
    const row = document.createElement("div");
    row.className = "row g-2 align-items-center admin-subject-row mb-2";
    row.innerHTML = `
      <div class="col-md-6">
        <input type="text" class="form-control admin-subject-name" value="${s.name}" required />
      </div>
      <div class="col-md-4">
        <input type="number" min="1" class="form-control admin-subject-credit" value="${s.credit}" required />
      </div>
      <div class="col-md-2">
        <button type="button" class="btn btn-danger w-100 remove-admin-subject">Remove</button>
      </div>`;
    adminSubjectsContainer.appendChild(row);
  });
}

if (subjects.length > 0) renderSubjectRow();
