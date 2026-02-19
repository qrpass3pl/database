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
        showMessage("✅ Excel file imported successfully!", "success");
      }
    } catch (error) {
      showMessage("❌ Error reading file: " + error.message, "error");
    }
  };
  reader.readAsArrayBuffer(file);
  event.target.value = "";
}

// Edit column header
function editHeader(th, idx) {
  const currentValue = columns[idx];

  const input = document.createElement("input");
  input.type = "text";
  input.className = "header-input";
  input.value = currentValue;
  input.style.width = "100%";
  input.style.padding = "4px";
  input.style.fontSize = "inherit";
  input.style.fontWeight = "bold";
  input.style.border = "2px solid #4CAF50";
  input.style.borderRadius = "4px";

  th.textContent = "";
  th.appendChild(input);
  input.focus();
  input.select();

  const saveEdit = () => {
    const newValue = input.value.trim();
    if (newValue) {
      columns[idx] = newValue;
      renderTable();
      showMessage(`✅ Column renamed to "${newValue}"`, "success");
    } else {
      renderTable();
      showMessage("❌ Column name cannot be empty", "error");
    }
  };

  input.onblur = saveEdit;
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
    if (e.key === "Escape") {
      renderTable();
    }
  };
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
  document.querySelector(".table-wrapper").style.display = "inline-block";

  // Render header
  columns.forEach((col, idx) => {
    const th = document.createElement("th");
    th.textContent = col;
    th.style.cursor = "pointer";
    th.title = "Double-click to edit column name";
    th.ondblclick = () => editHeader(th, idx);
    headerRow.appendChild(th);
  });
  const th = document.createElement("th");
  th.textContent = "Actions";
  th.style.textAlign = "center";
  th.style.width = "80px";
  headerRow.appendChild(th);

  // Render rows
  tableData.forEach((row, rowIdx) => {
    const tr = document.createElement("tr");
    row.forEach((cell, colIdx) => {
      const td = document.createElement("td");
      td.className = "cell-editable";
      td.textContent = cell || "";
      td.ondblclick = () => editCell(tr, colIdx, rowIdx);
      td.onkeydown = (e) => {
        if (e.key === "Enter") {
          editCell(tr, colIdx, rowIdx);
        }
      };
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
    const newValue = input.value.trim();
    tableData[rowIdx][colIdx] = newValue;
    renderTable();
  };

  input.onblur = saveEdit;
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
      // Move to next row
      if (rowIdx + 1 < tableData.length) {
        setTimeout(() => editCell(tr.nextElementSibling, colIdx, rowIdx + 1), 50);
      }
    }
    if (e.key === "Escape") renderTable();
    if (e.key === "Tab") {
      e.preventDefault();
      saveEdit();
      // Move to next column
      if (colIdx + 1 < columns.length) {
        setTimeout(() => editCell(tr, colIdx + 1, rowIdx), 50);
      }
    }
  };
}

// Add new row
function addRow() {
  if (columns.length === 0) {
    columns = ["Column 1", "Column 2", "Column 3"];
  }
  const newRow = new Array(columns.length).fill("");
  tableData.push(newRow);
  renderTable();
  showMessage("✅ New row added", "success");
}

function addCol() {
  if (columns.length === 0) {
    columns = ["Column 1", "Column 2", "Column 3"];
  }
  columns.push(`Column ${columns.length + 1}`);
  tableData.forEach((row) => {
    row.push("");
  });
  renderTable();
  showMessage("✅ New column added", "success");
}

// Delete row
function deleteRow(idx) {
  if (confirm("Delete this row?")) {
    tableData.splice(idx, 1);
    renderTable();
    showMessage("✅ Row deleted", "success");
  }
}

// Download Excel
function downloadExcel() {
  if (tableData.length === 0) {
    showMessage("❌ No data to export", "error");
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet([columns, ...tableData]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  XLSX.writeFile(wb, "data-export.xlsx");
  showMessage("✅ Excel file downloaded!", "success");
}

// Clear all data
function clearData() {
  if (
    confirm(
      "Clear all data? This will delete all rows and columns. This cannot be undone."
    )
  ) {
    tableData = [];
    columns = [];
    renderTable();
    showMessage("✅ All data cleared", "success");
  }
}

// Update statistics
function updateStats() {
  const rowCount = document.getElementById("rowCount");
  const colCount = document.getElementById("colCount");
  rowCount.textContent = tableData.length;
  colCount.textContent = columns.length;
}

// Show success message
function showMessage(msg, type = "success") {
  const message = document.getElementById("successMessage");
  message.textContent = msg;
  message.className = `message show ${type}`;
  setTimeout(() => {
    message.classList.remove("show");
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Z for undo (placeholder)
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    // Implement undo functionality
  }

  // Ctrl/Cmd + Y for redo (placeholder)
  if ((e.ctrlKey || e.metaKey) && e.key === "y") {
    e.preventDefault();
    // Implement redo functionality
  }

  // Ctrl/Cmd + S to export
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    downloadExcel();
  }
});

// Initialize
initializeSampleData();