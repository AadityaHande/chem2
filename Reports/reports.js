
export function initReports() {
  generateUsageReport();
  generateInventoryReport();
  generateInsights();
}

export function switchReport() {
  const type = document.getElementById("reportType").value;
  document.getElementById("usageReport").style.display = type === "usage" ? "block" : "none";
  document.getElementById("inventoryReport").style.display = type === "inventory" ? "block" : "none";
  document.getElementById("insightReport").style.display = type === "insight" ? "block" : "none";
}

export function searchReports() {
  const query = document.getElementById("reportSearch").value.toLowerCase();
  const type = document.getElementById("reportType").value;
  const tableId = type === "usage" ? "usageTable" : type === "inventory" ? "inventoryTable" : "insightTable";
  const table = document.getElementById(tableId);
  Array.from(table.tBodies[0].rows).forEach(row => {
    row.style.display = [...row.cells].some(cell => cell.innerText.toLowerCase().includes(query)) ? "" : "none";
  });
}

// Placeholder implementations (fill with actual data logic)
export function generateUsageReport() { /* populate usageTable */ }
export function generateInventoryReport() { /* populate inventoryTable */ }
export function generateInsights() { /* populate insightTable */ }
export function exportToCSV(type) { alert(`Exporting ${type} to CSV`); }
export function clearLogs() { alert("Logs cleared"); }
export function toggleColumns() { alert("Toggle columns"); }
export function renewStock() { alert("Renew stock functionality"); }
export function refreshInsights() { alert("Refreshed insights"); }
export function logout() { window.location.href = '../Login/login.html'; }
