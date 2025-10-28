const adminPassword = "admin123";

let semesters = JSON.parse(localStorage.getItem("semesters")) || {
  "Semester-1": [
    { name: "Python with Lab", credit: 5 },
    { name: "Programming in C", credit: 4 },
    { name: "Practical: C Programming", credit: 3 },
    { name: "Statistics for Computing", credit: 4 }
  ],
  "Semester-2": [
    { name: "Computer Organization and Architecture", credit: 3 },
    { name: "DSA", credit: 5 },
    { name: "Business Analytics", credit: 4 },
    { name: "Mathematics for Computing", credit: 4 }
  ],
  "Semester-3": [
    { name: "OOPS", credit: 5 },
    { name: "Computer Graphics", credit: 4 },
    { name: "Cloud Computing", credit: 3 },
    { name: "Software Engineering", credit: 4 },
    { name: "Operations Research", credit: 4 },
    { name: "Business Intelligence", credit: 4 },
    { name: "Open Elective Subject", credit: 3 }
  ],
  "Semester-4": [
    { name: "RDBMS", credit: 5 },
    { name: "Computer Networks", credit: 4 },
    { name: "Unified Modeling Language", credit: 3 },
    { name: "Blockchain Technology", credit: 3 },
    { name: "Information Security", credit: 3 },
    { name: "Predictive Modeling", credit: 4 },
    { name: "Business Accounting", credit: 4 }
  ]
};

function saveSemesters() {
  localStorage.setItem("semesters", JSON.stringify(semesters));
}

let selectedSemesters = JSON.parse(localStorage.getItem("selectedSemesters")) || [];
let gradeRecords = JSON.parse(localStorage.getItem("gradeRecords")) || {};

function showAlert(message) {
  const msgBox = document.getElementById("warningMessage");
  if (msgBox) msgBox.textContent = message;
  const warningModal = new bootstrap.Modal(document.getElementById("warningModal"));
  warningModal.show();
}

const semesterContainer = document.getElementById("semesterContainer");
const semesterList = document.getElementById("semesterList");
const adminSubjectsContainer = document.getElementById("adminSubjectsContainer");
const adminBtn = document.getElementById("adminBtn");
const adminLoginBtn = document.getElementById("adminLoginBtn");
const adminPassInput = document.getElementById("adminPassInput");
const passwordError = document.getElementById("passwordError");
const cgpaResult = document.getElementById("cgpaResult");
const avgResult = document.getElementById("avgResult");

// ======================== ADMIN AUTHENTICATION ========================
if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("adminPasswordModal"));
    passwordError.style.display = "none";
    adminPassInput.value = "";
    modal.show();
  });
}

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", () => {
    const enteredPass = adminPassInput.value;
    if (enteredPass === adminPassword) {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      window.location.href = "admin.html";
    } else {
      passwordError.textContent = "Incorrect password!";
      passwordError.style.display = "block";
    }
  });
}

// ======================== MAIN PAGE FUNCTIONS ========================

if (semesterList) {
  Object.keys(semesters).forEach(sem => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "dropdown-item";
    btn.textContent = sem;
    btn.onclick = () => addSemester(sem);
    li.appendChild(btn);
    semesterList.appendChild(li);
  });
}

function persistData() {
  localStorage.setItem("gradeRecords", JSON.stringify(gradeRecords));
  localStorage.setItem("selectedSemesters", JSON.stringify(selectedSemesters));
}

function addSemester(sem) {
  if (!selectedSemesters.includes(sem)) selectedSemesters.push(sem);
  persistData();
  renderAllSemesters();
}

function removeSemester(sem) {
  selectedSemesters = selectedSemesters.filter(s => s !== sem);
  persistData();
  renderAllSemesters();
}

function renderSemesterBlock(sem) {
  const semDiv = document.createElement("div");
  semDiv.className = "border p-3 rounded mb-4 shadow-sm";

  const header = document.createElement("div");
  header.className = "d-flex justify-content-between align-items-center mb-3";

  const title = document.createElement("h5");
  title.textContent = sem;

  const remBtn = document.createElement("button");
  remBtn.className = "btn btn-danger btn-sm";
  remBtn.textContent = "Remove Semester";
  remBtn.onclick = () => removeSemester(sem);

  header.append(title, remBtn);
  semDiv.append(header);

  semesters[sem].forEach(sub => {
    const row = document.createElement("div");
    row.className = "row gx-2 mb-2";

    const colName = document.createElement("div");
    colName.className = "col-8";
    const name = document.createElement("input");
    name.className = "form-control";
    name.readOnly = true;
    name.value = sub.name;
    colName.append(name);

    const colGrade = document.createElement("div");
    colGrade.className = "col-4";
    const grade = document.createElement("input");
    grade.type = "number";
    grade.min = 0;
    grade.max = 10;
    grade.placeholder = "Grade (0–10)";
    grade.className = "form-control";

    if (gradeRecords?.[sem]?.[sub.name]) grade.value = gradeRecords[sem][sub.name];
    grade.addEventListener("input", () => {
      if (!gradeRecords[sem]) gradeRecords[sem] = {};
      gradeRecords[sem][sub.name] = grade.value;
      persistData();
    });

    colGrade.append(grade);
    row.append(colName, colGrade);
    semDiv.append(row);
  });

  semesterContainer.append(semDiv);
}

function renderAllSemesters() {
  if (!semesterContainer) return;
  semesterContainer.innerHTML = "";
  selectedSemesters.forEach(renderSemesterBlock);
}

if (semesterContainer)
  document.addEventListener("DOMContentLoaded", renderAllSemesters);

// ======================== MAIN CALCULATION========================
function calculateCGPA() {
  let totalCredits = 0, totalWeighted = 0;
  for (const sem of selectedSemesters) {
    if (!semesters[sem]) continue;
    for (const sub of semesters[sem]) {
      const g = parseFloat(gradeRecords?.[sem]?.[sub.name]);
      if (isNaN(g)) return showAlert("Fill all grade fields before calculation!");
      if (g < 0 || g > 10) return showAlert("Grade must be between 0 and 10!");
      totalCredits += sub.credit;
      totalWeighted += g * sub.credit;
    }
  }
  if (!totalCredits) return showAlert("No semesters selected for calculation!");
  const cgpa = (totalWeighted / totalCredits).toFixed(2);
  const avg = (cgpa * 9.5).toFixed(2);
  cgpaResult.textContent = `CGPA: ${cgpa}`;
  avgResult.textContent = `Average Marks: ${avg}`;
}

// ======================== ADMIN PAGE FUNCTIONS ========================
function renderAdminSubjects() {
  if (!adminSubjectsContainer) return;
  adminSubjectsContainer.innerHTML = "";

  Object.keys(semesters).forEach(sem => {
    const block = document.createElement("div");
    block.className = "border p-3 rounded mb-4 bg-light";

    const header = document.createElement("div");
    header.className = "d-flex justify-content-between align-items-center mb-3";

    const title = document.createElement("h5");
    title.textContent = sem;

    const modify = document.createElement("button");
    modify.className = "btn btn-warning btn-sm";
    modify.textContent = "Modify";
    header.append(title, modify);
    block.append(header);

    const container = document.createElement("div");
    block.append(container);

    function renderReadonly() {
      container.innerHTML = "";
      semesters[sem].forEach(sub => {
        const row = document.createElement("div");
        row.className = "row gx-2 mb-2";

        const colName = document.createElement("div");
        colName.className = "col-8";
        const name = document.createElement("input");
        name.className = "form-control";
        name.value = sub.name;
        name.readOnly = true;
        colName.append(name);

        const colCredit = document.createElement("div");
        colCredit.className = "col-4";
        const credit = document.createElement("input");
        credit.className = "form-control";
        credit.value = sub.credit;
        credit.readOnly = true;
        colCredit.append(credit);

        row.append(colName, colCredit);
        container.append(row);
      });
    }
    renderReadonly();

    modify.onclick = () => {
      modify.style.display = "none";

      const save = document.createElement("button");
      save.className = "btn btn-success btn-sm me-2";
      save.textContent = "Save";
      const cancel = document.createElement("button");
      cancel.className = "btn btn-secondary btn-sm";
      cancel.textContent = "Cancel";
      header.append(save, cancel);

      container.innerHTML = "";

      const makeEditableRow = (sub = { name: "", credit: 0 }) => {
        const row = document.createElement("div");
        row.className = "row gx-2 mb-2";

        const nameCol = document.createElement("div");
        nameCol.className = "col-8";
        const name = document.createElement("input");
        name.className = "form-control";
        name.value = sub.name;
        nameCol.append(name);

        const creditCol = document.createElement("div");
        creditCol.className = "col-4 d-flex gap-2";
        const credit = document.createElement("input");
        credit.className = "form-control";
        credit.type = "number";
        credit.min = 1;
        credit.value = sub.credit;
        const del = document.createElement("button");
        del.className = "btn btn-danger btn-sm";
        del.textContent = "X";
        del.onclick = () => row.remove();
        creditCol.append(credit, del);

        row.append(nameCol, creditCol);
        return row;
      };

      semesters[sem].forEach(sub => container.append(makeEditableRow(sub)));

      const addBtn = document.createElement("button");
      addBtn.className = "btn btn-primary btn-sm mt-2 mb-2";
      addBtn.textContent = "Add Subject";
      addBtn.onclick = () => container.appendChild(makeEditableRow());
      container.append(addBtn);

      save.onclick = () => {
        const updated = [];
        const rows = container.querySelectorAll(".row.gx-2.mb-2");
        for (const r of rows) {
          const inputs = r.querySelectorAll("input");
          const nameVal = inputs[0].value.trim();
          const creditVal = Number(inputs[1]?.value);
          if (!nameVal) return showAlert("Subject name cannot be empty!");
          if (isNaN(creditVal) || creditVal <= 0) return showAlert("Credit must be valid positive value!");
          updated.push({ name: nameVal, credit: creditVal });
        }
        semesters[sem] = updated;
        saveSemesters();
        save.remove();
        cancel.remove();
        modify.style.display = "";
        renderReadonly();
      };

      cancel.onclick = () => {
        save.remove();
        cancel.remove();
        modify.style.display = "";
        renderReadonly();
      };
    };

    adminSubjectsContainer.append(block);
  });
}

if (adminSubjectsContainer)
  document.addEventListener("DOMContentLoaded", renderAdminSubjects);

const exitBtn = document.getElementById("exitBtn");
if (exitBtn) {
  exitBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    window.location.href = "index.html";
  });
}
