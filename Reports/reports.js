// reports.js
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { auth } from "../firebase/firebase-config.js";

// Load reports data from localStorage and display in table
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

// Logout function for reports page
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "../Login/login.html";
  }).catch((error) => {
    console.error("Logout failed: ", error);
  });
};
