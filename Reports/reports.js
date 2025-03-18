// reports.js
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { auth } from "../firebase/firebase-config.js";

// Generate and display reports in the table
export function generateReport() {
  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = "";
  const reports = JSON.parse(localStorage.getItem("chemicalReports")) || [];
  reports.forEach(report => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${report.name}</td>
      <td>${report.quantity}</td>
      <td>${report.unit}</td>
      <td>${new Date(report.time).toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

// Filter reports by chemical unit
export function filterByUnit() {
  let selectedUnit = document.getElementById("filterUnit").value;
  const allReports = JSON.parse(localStorage.getItem("chemicalReports")) || [];
  const filtered = selectedUnit === "all" ? allReports : allReports.filter(report => report.unit.toLowerCase() === selectedUnit);
  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = "";
  filtered.forEach(report => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${report.name}</td>
      <td>${report.quantity}</td>
      <td>${report.unit}</td>
      <td>${new Date(report.time).toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

// Export reports data to an Excel file using SheetJS (xlsx)
export function exportReportsToExcel() {
  const reports = JSON.parse(localStorage.getItem("chemicalReports")) || [];
  
  // Prepare data with headers
  const data = [
    ["Chemical Name", "Quantity", "Unit", "Last Updated"]
  ];
  reports.forEach(report => {
    data.push([
      report.name,
      report.quantity,
      report.unit,
      new Date(report.time).toLocaleString()
    ]);
  });
  
  // Dynamically import SheetJS library
  import("https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js").then(XLSX => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "Chemical_Reports.xlsx");
  }).catch(error => {
    console.error("Error loading SheetJS library:", error);
  });
}

// Logout function for reports page
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "../Login/login.html";
  }).catch((error) => {
    console.error("Logout failed:", error);
  });
};

// Expose functions to global scope if needed
window.generateReport = generateReport;
window.filterByUnit = filterByUnit;
window.exportReportsToExcel = exportReportsToExcel;
