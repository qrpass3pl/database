// maintable.js

// CRITICAL: Check authentication before displaying content
authManager.requireAuth();
authManager.checkSession();

const successMessage = document.getElementById("successMessage");

// Update time display
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("timeDisplay").textContent =
    `${hours}:${minutes}:${seconds}`;
}

updateTime();
setInterval(updateTime, 1000);

// Logout button functionality
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear session/storage through auth manager
  authManager.logout();

  // Show logout message
  successMessage.classList.add("show");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});

let tableData = [];
let columns = [];

// Initialize with sample data
function initializeSampleData() {
  columns = ["Name", "Department", "Email", "Salary"];
  tableData = [
    ["John Doe", "Engineering", "john@example.com", "$95,000"],
    ["Jane Smith", "Marketing", "jane@example.com", "$75,000"],
    ["Bob Johnson", "Sales", "bob@example.com", "$85,000"],
  ];
  renderTable();
}

// Import Excel file
function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        columns = jsonData[0];
        tableData = jsonData.slice(1);
        renderTable();
        showMessage("✅ Excel file imported successfully!");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  reader.readAsArrayBuffer(file);
  event.target.value = "";
}

// Render table
function renderTable() {
  const headerRow = document.getElementById("headerRow");
  const tableBody = document.getElementById("tableBody");
  const emptyState = document.getElementById("emptyState");

  headerRow.innerHTML = "";
  tableBody.innerHTML = "";

  if (tableData.length === 0) {
    emptyState.style.display = "block";
    document.querySelector(".table-wrapper").style.display = "none";
    updateStats();
    return;
  }

  emptyState.style.display = "none";
  document.querySelector(".table-wrapper").style.display = "block";

  // Render header
  columns.forEach((col, idx) => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });
  const th = document.createElement("th");
  th.textContent = "Actions";
  th.style.textAlign = "center";
  headerRow.appendChild(th);

  // Render rows
  tableData.forEach((row, rowIdx) => {
    const tr = document.createElement("tr");
    row.forEach((cell, colIdx) => {
      const td = document.createElement("td");
      td.className = "cell-editable";
      td.textContent = cell || "";
      td.ondblclick = () => editCell(tr, colIdx, rowIdx);
      tr.appendChild(td);
    });

    const actionTd = document.createElement("td");
    actionTd.className = "actions-cell";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteRow(rowIdx);
    actionTd.appendChild(deleteBtn);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
  });

  updateStats();
}

// Edit cell
function editCell(tr, colIdx, rowIdx) {
  const td = tr.children[colIdx];
  const currentValue = tableData[rowIdx][colIdx] || "";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "cell-input";
  input.value = currentValue;

  td.textContent = "";
  td.appendChild(input);
  input.focus();
  input.select();

  const saveEdit = () => {
    tableData[rowIdx][colIdx] = input.value;
    renderTable();
  };

  input.onblur = saveEdit;
  input.onkeydown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") renderTable();
  };
}

// Add new row
function addRow() {
  if (columns.length === 0) {
    columns = ["Column 1", "Column 2", "Column 3"];
  }
  tableData.push(new Array(columns.length).fill(""));
  renderTable();
}

// Delete row
function deleteRow(idx) {
  if (confirm("Delete this row?")) {
    tableData.splice(idx, 1);
    renderTable();
  }
}

// Download Excel
function downloadExcel() {
  if (tableData.length === 0) {
    alert("No data to export");
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet([columns, ...tableData]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, "data-export.xlsx");
  showMessage("✅ Excel file downloaded!");
}

// Clear all data
function clearData() {
  if (confirm("Clear all data? This cannot be undone.")) {
    tableData = [];
    columns = [];
    renderTable();
  }
}

// Update statistics
function updateStats() {
  const statsDiv = document.getElementById("stats");
  statsDiv.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${tableData.length}</div>
                    <div class="stat-label">Rows</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${columns.length}</div>
                    <div class="stat-label">Columns</div>
                </div>
            `;
}

// Show success message
function showMessage(msg) {
  const message = document.createElement("div");
  message.className = "success-message";
  message.textContent = msg;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 3000);
}

// Initialize
initializeSampleData();
